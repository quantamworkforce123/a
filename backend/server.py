from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, validator
from typing import List, Optional, Dict, Any, Union
from datetime import datetime, timedelta
from pathlib import Path
import os
import logging
import uuid
import json
import jwt
import hashlib
import bcrypt
import asyncio
from contextlib import asynccontextmanager

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
security = HTTPBearer()
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'quantamworkforce-secret-key-2025')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# =============================================================================
# MODELS - User Management
# =============================================================================

class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)
    
    @validator('name')
    def validate_name(cls, v):
        if not v.strip():
            raise ValueError('Name cannot be empty')
        return v.strip()

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    avatar: Optional[str] = None
    role: str = "user"
    created_at: datetime
    updated_at: datetime

class UserUpdate(BaseModel):
    name: Optional[str] = None
    avatar: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# =============================================================================
# MODELS - Workflow Management
# =============================================================================

class NodeData(BaseModel):
    label: str
    properties: Dict[str, Any] = {}
    config: Dict[str, Any] = {}
    inputs: int = 1
    outputs: int = 1

class WorkflowNode(BaseModel):
    id: str
    type: str
    name: str
    position: Dict[str, float]
    data: NodeData

class WorkflowConnection(BaseModel):
    id: str
    source: str
    target: str
    sourceOutput: Optional[str] = "output_0"
    targetInput: Optional[str] = "input_0"

class WorkflowCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    tags: List[str] = []
    
    @validator('name')
    def validate_name(cls, v):
        if not v.strip():
            raise ValueError('Workflow name cannot be empty')
        return v.strip()

class WorkflowUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None
    is_active: Optional[bool] = None
    nodes: Optional[List[WorkflowNode]] = None
    connections: Optional[List[WorkflowConnection]] = None

class WorkflowResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    tags: List[str] = []
    nodes: List[WorkflowNode] = []
    connections: List[WorkflowConnection] = []
    is_active: bool = False
    last_run: Optional[datetime] = None
    executions: int = 0
    created_at: datetime
    updated_at: datetime
    created_by: str
    
class WorkflowExecution(BaseModel):
    id: str
    workflow_id: str
    status: str  # 'running', 'completed', 'failed', 'stopped'
    started_at: datetime
    finished_at: Optional[datetime] = None
    node_statuses: Dict[str, str] = {}
    execution_logs: List[Dict[str, Any]] = []
    input_data: Optional[Dict[str, Any]] = None
    output_data: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None

class ExecutionResponse(BaseModel):
    id: str
    workflow_id: str
    status: str
    started_at: datetime
    finished_at: Optional[datetime] = None
    node_statuses: Dict[str, str] = {}
    execution_logs: List[Dict[str, Any]] = []
    error_message: Optional[str] = None

# =============================================================================
# MODELS - Node System
# =============================================================================

class NodeDefinitionResponse(BaseModel):
    type: str
    name: str
    category: str
    color: str
    icon: str
    description: str
    inputs: int
    outputs: int
    properties: Dict[str, Any]
    is_trigger: bool = False

# =============================================================================
# AUTHENTICATION & AUTHORIZATION
# =============================================================================

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current authenticated user"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    user = await db.users.find_one({"id": user_id})
    if user is None:
        raise credentials_exception
    
    return UserResponse(**user)

# =============================================================================
# WORKFLOW EXECUTION ENGINE
# =============================================================================

class WorkflowExecutionEngine:
    def __init__(self):
        self.executing_workflows = {}
    
    async def execute_workflow(self, workflow: WorkflowResponse, user_id: str, input_data: Optional[Dict] = None):
        """Execute a workflow and track its progress"""
        execution_id = str(uuid.uuid4())
        
        # Create execution record
        execution = WorkflowExecution(
            id=execution_id,
            workflow_id=workflow.id,
            status="running",
            started_at=datetime.utcnow(),
            node_statuses={},
            execution_logs=[],
            input_data=input_data or {}
        )
        
        # Store in database
        await db.executions.insert_one(execution.dict())
        
        # Start background execution
        asyncio.create_task(self._execute_workflow_background(execution, workflow))
        
        return execution
    
    async def _execute_workflow_background(self, execution: WorkflowExecution, workflow: WorkflowResponse):
        """Background workflow execution"""
        try:
            # Update execution status
            await self._update_execution_status(execution.id, "running")
            await self._add_execution_log(execution.id, "info", "Workflow", "Starting workflow execution")
            
            # Find trigger nodes
            trigger_nodes = [node for node in workflow.nodes if self._is_trigger_node(node)]
            
            if not trigger_nodes:
                raise Exception("No trigger nodes found in workflow")
            
            # Execute trigger nodes
            for trigger_node in trigger_nodes:
                await self._execute_node_chain(execution.id, trigger_node, workflow)
            
            # Mark as completed
            await self._update_execution_status(execution.id, "completed")
            await self._add_execution_log(execution.id, "success", "Workflow", "Workflow execution completed successfully")
            
        except Exception as e:
            await self._update_execution_status(execution.id, "failed", str(e))
            await self._add_execution_log(execution.id, "error", "Workflow", f"Workflow execution failed: {str(e)}")
    
    async def _execute_node_chain(self, execution_id: str, node: WorkflowNode, workflow: WorkflowResponse):
        """Execute a chain of nodes starting from the given node"""
        try:
            # Update node status
            await self._update_node_status(execution_id, node.id, "executing")
            await self._add_execution_log(execution_id, "info", node.data.label, "Starting node execution")
            
            # Simulate node execution
            await asyncio.sleep(1 + (hash(node.id) % 3))  # 1-4 second delay
            
            # Simulate 95% success rate
            if hash(node.id) % 20 == 0:  # 5% failure rate
                raise Exception(f"Simulated execution failure in node {node.data.label}")
            
            # Mark node as success
            await self._update_node_status(execution_id, node.id, "success")
            await self._add_execution_log(execution_id, "success", node.data.label, "Node executed successfully")
            
            # Find and execute connected nodes
            connected_nodes = self._get_connected_nodes(node.id, workflow)
            for connected_node in connected_nodes:
                await self._execute_node_chain(execution_id, connected_node, workflow)
                
        except Exception as e:
            await self._update_node_status(execution_id, node.id, "error")
            await self._add_execution_log(execution_id, "error", node.data.label, f"Node execution failed: {str(e)}")
            raise
    
    def _is_trigger_node(self, node: WorkflowNode) -> bool:
        """Check if a node is a trigger node"""
        trigger_types = ['manual-trigger', 'webhook', 'schedule', 'email-trigger']
        return node.type in trigger_types
    
    def _get_connected_nodes(self, node_id: str, workflow: WorkflowResponse) -> List[WorkflowNode]:
        """Get nodes connected to the output of the given node"""
        connected_node_ids = [conn.target for conn in workflow.connections if conn.source == node_id]
        return [node for node in workflow.nodes if node.id in connected_node_ids]
    
    async def _update_execution_status(self, execution_id: str, status: str, error_message: Optional[str] = None):
        """Update execution status in database"""
        update_data = {"status": status, "updated_at": datetime.utcnow()}
        if status in ["completed", "failed", "stopped"]:
            update_data["finished_at"] = datetime.utcnow()
        if error_message:
            update_data["error_message"] = error_message
            
        await db.executions.update_one(
            {"id": execution_id},
            {"$set": update_data}
        )
    
    async def _update_node_status(self, execution_id: str, node_id: str, status: str):
        """Update node status in execution"""
        await db.executions.update_one(
            {"id": execution_id},
            {"$set": {f"node_statuses.{node_id}": status}}
        )
    
    async def _add_execution_log(self, execution_id: str, log_type: str, source: str, message: str):
        """Add log entry to execution"""
        log_entry = {
            "id": str(uuid.uuid4()),
            "type": log_type,
            "source": source,
            "message": message,
            "timestamp": datetime.utcnow()
        }
        
        await db.executions.update_one(
            {"id": execution_id},
            {"$push": {"execution_logs": log_entry}}
        )

# Initialize execution engine
execution_engine = WorkflowExecutionEngine()

# =============================================================================
# STARTUP/SHUTDOWN HANDLERS
# =============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting Quantamworkforce Backend API")
    
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.users.create_index("id", unique=True)
    await db.workflows.create_index("id", unique=True)
    await db.workflows.create_index("created_by")
    await db.executions.create_index("id", unique=True)
    await db.executions.create_index("workflow_id")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Quantamworkforce Backend API")
    client.close()

# Create FastAPI app
app = FastAPI(
    title="Quantamworkforce API",
    description="Production-grade N8N clone - Workflow automation platform",
    version="1.0.0",
    lifespan=lifespan
)

# Create API router
api_router = APIRouter(prefix="/api")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============================================================================
# API ROUTES - HEALTH & STATUS
# =============================================================================

@api_router.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Quantamworkforce API v1.0.0",
        "status": "healthy",
        "timestamp": datetime.utcnow()
    }

@api_router.get("/health")
async def health_check():
    """Detailed health check"""
    try:
        # Test database connection
        await db.command("ping")
        
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.utcnow(),
            "version": "1.0.0"
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Service unavailable: {str(e)}")

# =============================================================================
# API ROUTES - AUTHENTICATION
# =============================================================================

@api_router.post("/auth/register", response_model=Token)
async def register(user: UserCreate):
    """Register a new user"""
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Create user
    user_id = str(uuid.uuid4())
    hashed_password = hash_password(user.password)
    
    user_data = {
        "id": user_id,
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "avatar": f"https://ui-avatars.com/api/?name={user.name.replace(' ', '+')}&background=ff7f4d&color=ffffff",
        "role": "user",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    await db.users.insert_one(user_data)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_id}, expires_delta=access_token_expires
    )
    
    user_response = UserResponse(**user_data)
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )

@api_router.post("/auth/login", response_model=Token)
async def login(user_login: UserLogin):
    """Login user"""
    # Find user
    user = await db.users.find_one({"email": user_login.email})
    if not user or not verify_password(user_login.password, user["password"]):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["id"]}, expires_delta=access_token_expires
    )
    
    user_response = UserResponse(**user)
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: UserResponse = Depends(get_current_user)):
    """Get current user information"""
    return current_user

@api_router.put("/auth/me", response_model=UserResponse)
async def update_current_user(
    user_update: UserUpdate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Update current user information"""
    update_data = {"updated_at": datetime.utcnow()}
    
    if user_update.name:
        update_data["name"] = user_update.name.strip()
    if user_update.avatar:
        update_data["avatar"] = user_update.avatar
    
    await db.users.update_one(
        {"id": current_user.id},
        {"$set": update_data}
    )
    
    # Get updated user
    updated_user = await db.users.find_one({"id": current_user.id})
    return UserResponse(**updated_user)

# =============================================================================
# API ROUTES - WORKFLOWS
# =============================================================================

@api_router.post("/workflows", response_model=WorkflowResponse)
async def create_workflow(
    workflow: WorkflowCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Create a new workflow"""
    workflow_id = str(uuid.uuid4())
    
    workflow_data = {
        "id": workflow_id,
        "name": workflow.name,
        "description": workflow.description,
        "tags": workflow.tags,
        "nodes": [],
        "connections": [],
        "is_active": False,
        "last_run": None,
        "executions": 0,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "created_by": current_user.id
    }
    
    await db.workflows.insert_one(workflow_data)
    return WorkflowResponse(**workflow_data)

@api_router.get("/workflows", response_model=List[WorkflowResponse])
async def get_workflows(
    skip: int = 0,
    limit: int = 100,
    current_user: UserResponse = Depends(get_current_user)
):
    """Get user's workflows"""
    cursor = db.workflows.find({"created_by": current_user.id}).skip(skip).limit(limit)
    workflows = await cursor.to_list(length=limit)
    
    return [WorkflowResponse(**workflow) for workflow in workflows]

@api_router.get("/workflows/{workflow_id}", response_model=WorkflowResponse)
async def get_workflow(
    workflow_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Get a specific workflow"""
    workflow = await db.workflows.find_one({
        "id": workflow_id,
        "created_by": current_user.id
    })
    
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    return WorkflowResponse(**workflow)

@api_router.put("/workflows/{workflow_id}", response_model=WorkflowResponse)
async def update_workflow(
    workflow_id: str,
    workflow_update: WorkflowUpdate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Update a workflow"""
    # Check if workflow exists and belongs to user
    existing_workflow = await db.workflows.find_one({
        "id": workflow_id,
        "created_by": current_user.id
    })
    
    if not existing_workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    # Prepare update data
    update_data = {"updated_at": datetime.utcnow()}
    
    if workflow_update.name:
        update_data["name"] = workflow_update.name.strip()
    if workflow_update.description is not None:
        update_data["description"] = workflow_update.description
    if workflow_update.tags is not None:
        update_data["tags"] = workflow_update.tags
    if workflow_update.is_active is not None:
        update_data["is_active"] = workflow_update.is_active
    if workflow_update.nodes is not None:
        update_data["nodes"] = [node.dict() for node in workflow_update.nodes]
    if workflow_update.connections is not None:
        update_data["connections"] = [conn.dict() for conn in workflow_update.connections]
    
    await db.workflows.update_one(
        {"id": workflow_id},
        {"$set": update_data}
    )
    
    # Get updated workflow
    updated_workflow = await db.workflows.find_one({"id": workflow_id})
    return WorkflowResponse(**updated_workflow)

@api_router.delete("/workflows/{workflow_id}")
async def delete_workflow(
    workflow_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Delete a workflow"""
    result = await db.workflows.delete_one({
        "id": workflow_id,
        "created_by": current_user.id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    # Also delete associated executions
    await db.executions.delete_many({"workflow_id": workflow_id})
    
    return {"message": "Workflow deleted successfully"}

# =============================================================================
# API ROUTES - WORKFLOW EXECUTION
# =============================================================================

@api_router.post("/workflows/{workflow_id}/execute", response_model=ExecutionResponse)
async def execute_workflow(
    workflow_id: str,
    input_data: Optional[Dict[str, Any]] = None,
    current_user: UserResponse = Depends(get_current_user)
):
    """Execute a workflow"""
    # Get workflow
    workflow_data = await db.workflows.find_one({
        "id": workflow_id,
        "created_by": current_user.id
    })
    
    if not workflow_data:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    workflow = WorkflowResponse(**workflow_data)
    
    # Execute workflow
    execution = await execution_engine.execute_workflow(workflow, current_user.id, input_data)
    
    # Update workflow execution count
    await db.workflows.update_one(
        {"id": workflow_id},
        {
            "$inc": {"executions": 1},
            "$set": {"last_run": datetime.utcnow()}
        }
    )
    
    return ExecutionResponse(**execution.dict())

@api_router.get("/workflows/{workflow_id}/executions", response_model=List[ExecutionResponse])
async def get_workflow_executions(
    workflow_id: str,
    skip: int = 0,
    limit: int = 50,
    current_user: UserResponse = Depends(get_current_user)
):
    """Get workflow execution history"""
    # Verify workflow ownership
    workflow = await db.workflows.find_one({
        "id": workflow_id,
        "created_by": current_user.id
    })
    
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    # Get executions
    cursor = db.executions.find({"workflow_id": workflow_id}).sort("started_at", -1).skip(skip).limit(limit)
    executions = await cursor.to_list(length=limit)
    
    return [ExecutionResponse(**execution) for execution in executions]

@api_router.get("/executions/{execution_id}", response_model=ExecutionResponse)
async def get_execution(
    execution_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Get execution details"""
    execution = await db.executions.find_one({"id": execution_id})
    
    if not execution:
        raise HTTPException(status_code=404, detail="Execution not found")
    
    # Verify ownership through workflow
    workflow = await db.workflows.find_one({
        "id": execution["workflow_id"],
        "created_by": current_user.id
    })
    
    if not workflow:
        raise HTTPException(status_code=404, detail="Execution not found")
    
    return ExecutionResponse(**execution)

# =============================================================================
# API ROUTES - NODE DEFINITIONS
# =============================================================================

@api_router.get("/nodes", response_model=List[NodeDefinitionResponse])
async def get_node_definitions():
    """Get all available node definitions"""
    # Import node definitions
    from CompleteN8NNodes import ALL_N8N_NODES
    
    node_definitions = []
    for node_type, definition in ALL_N8N_NODES.items():
        node_def = NodeDefinitionResponse(
            type=node_type,
            name=definition["name"],
            category=definition["category"],
            color=definition["color"],
            icon=definition["icon"],
            description=definition["description"],
            inputs=definition["inputs"],
            outputs=definition["outputs"],
            properties=definition["properties"],
            is_trigger=definition.get("isTrigger", False)
        )
        node_definitions.append(node_def)
    
    return node_definitions

@api_router.get("/nodes/{node_type}", response_model=NodeDefinitionResponse)
async def get_node_definition(node_type: str):
    """Get specific node definition"""
    from CompleteN8NNodes import ALL_N8N_NODES
    
    if node_type not in ALL_N8N_NODES:
        raise HTTPException(status_code=404, detail="Node type not found")
    
    definition = ALL_N8N_NODES[node_type]
    
    return NodeDefinitionResponse(
        type=node_type,
        name=definition["name"],
        category=definition["category"],
        color=definition["color"],
        icon=definition["icon"],
        description=definition["description"],
        inputs=definition["inputs"],
        outputs=definition["outputs"],
        properties=definition["properties"],
        is_trigger=definition.get("isTrigger", False)
    )

# =============================================================================
# API ROUTES - LEGACY STATUS (for existing tests)
# =============================================================================

class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    """Legacy status check endpoint"""
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    """Legacy status check retrieval endpoint"""
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include router in main app
app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)