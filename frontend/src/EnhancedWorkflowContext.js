import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { WorkflowEngine } from './WorkflowEngine';
import { createNodeInstance } from './NodeDefinitions';
import { useAuth } from './AuthContext';

const WorkflowContext = createContext();

// Initial state
const initialState = {
  workflows: [],
  currentWorkflow: null,
  selectedNode: null,
  isExecuting: false,
  executionStatus: {},
  executionLogs: [],
  workflowHistory: [],
  templates: [],
  isLoading: false,
  error: null
};

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  LOAD_WORKFLOWS: 'LOAD_WORKFLOWS',
  SET_CURRENT_WORKFLOW: 'SET_CURRENT_WORKFLOW',
  CREATE_WORKFLOW: 'CREATE_WORKFLOW',
  UPDATE_WORKFLOW: 'UPDATE_WORKFLOW',
  DELETE_WORKFLOW: 'DELETE_WORKFLOW',
  DUPLICATE_WORKFLOW: 'DUPLICATE_WORKFLOW',
  ADD_NODE: 'ADD_NODE',
  UPDATE_NODE: 'UPDATE_NODE',
  DELETE_NODE: 'DELETE_NODE',
  ADD_CONNECTION: 'ADD_CONNECTION',
  DELETE_CONNECTION: 'DELETE_CONNECTION',
  SET_SELECTED_NODE: 'SET_SELECTED_NODE',
  START_EXECUTION: 'START_EXECUTION',
  UPDATE_EXECUTION_STATUS: 'UPDATE_EXECUTION_STATUS',
  FINISH_EXECUTION: 'FINISH_EXECUTION',
  ADD_EXECUTION_LOG: 'ADD_EXECUTION_LOG',
  CLEAR_EXECUTION_LOGS: 'CLEAR_EXECUTION_LOGS',
  ADD_TO_HISTORY: 'ADD_TO_HISTORY',
  SAVE_WORKFLOW: 'SAVE_WORKFLOW'
};

// Reducer
function workflowReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };

    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    case ACTIONS.LOAD_WORKFLOWS:
      return { ...state, workflows: action.payload, isLoading: false };

    case ACTIONS.SET_CURRENT_WORKFLOW:
      return { ...state, currentWorkflow: action.payload };

    case ACTIONS.CREATE_WORKFLOW:
      const newWorkflow = {
        id: uuidv4(),
        name: action.payload.name || 'New Workflow',
        description: action.payload.description || '',
        nodes: [],
        connections: [],
        isActive: false,
        lastRun: null,
        executions: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: action.payload.userId
      };
      return {
        ...state,
        workflows: [...state.workflows, newWorkflow],
        currentWorkflow: newWorkflow
      };

    case ACTIONS.UPDATE_WORKFLOW:
      const updatedWorkflows = state.workflows.map(workflow =>
        workflow.id === action.payload.id
          ? { ...workflow, ...action.payload.updates, updatedAt: new Date().toISOString() }
          : workflow
      );
      return {
        ...state,
        workflows: updatedWorkflows,
        currentWorkflow: state.currentWorkflow?.id === action.payload.id
          ? { ...state.currentWorkflow, ...action.payload.updates, updatedAt: new Date().toISOString() }
          : state.currentWorkflow
      };

    case ACTIONS.DELETE_WORKFLOW:
      return {
        ...state,
        workflows: state.workflows.filter(workflow => workflow.id !== action.payload),
        currentWorkflow: state.currentWorkflow?.id === action.payload ? null : state.currentWorkflow
      };

    case ACTIONS.DUPLICATE_WORKFLOW:
      const originalWorkflow = state.workflows.find(w => w.id === action.payload);
      if (!originalWorkflow) return state;
      
      const duplicatedWorkflow = {
        ...originalWorkflow,
        id: uuidv4(),
        name: `${originalWorkflow.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: false,
        lastRun: null,
        executions: 0,
        nodes: originalWorkflow.nodes.map(node => ({
          ...node,
          id: uuidv4(),
          position: { x: node.position.x + 50, y: node.position.y + 50 }
        })),
        connections: []
      };
      
      return {
        ...state,
        workflows: [...state.workflows, duplicatedWorkflow],
        currentWorkflow: duplicatedWorkflow
      };

    case ACTIONS.ADD_NODE:
      if (!state.currentWorkflow) return state;
      const workflowWithNode = {
        ...state.currentWorkflow,
        nodes: [...state.currentWorkflow.nodes, action.payload],
        updatedAt: new Date().toISOString()
      };
      return {
        ...state,
        currentWorkflow: workflowWithNode,
        workflows: state.workflows.map(workflow =>
          workflow.id === workflowWithNode.id ? workflowWithNode : workflow
        )
      };

    case ACTIONS.UPDATE_NODE:
      if (!state.currentWorkflow) return state;
      const workflowWithUpdatedNode = {
        ...state.currentWorkflow,
        nodes: state.currentWorkflow.nodes.map(node =>
          node.id === action.payload.id ? { ...node, ...action.payload.updates } : node
        ),
        updatedAt: new Date().toISOString()
      };
      return {
        ...state,
        currentWorkflow: workflowWithUpdatedNode,
        workflows: state.workflows.map(workflow =>
          workflow.id === workflowWithUpdatedNode.id ? workflowWithUpdatedNode : workflow
        )
      };

    case ACTIONS.DELETE_NODE:
      if (!state.currentWorkflow) return state;
      const workflowWithoutNode = {
        ...state.currentWorkflow,
        nodes: state.currentWorkflow.nodes.filter(node => node.id !== action.payload),
        connections: state.currentWorkflow.connections.filter(
          conn => conn.source !== action.payload && conn.target !== action.payload
        ),
        updatedAt: new Date().toISOString()
      };
      return {
        ...state,
        currentWorkflow: workflowWithoutNode,
        workflows: state.workflows.map(workflow =>
          workflow.id === workflowWithoutNode.id ? workflowWithoutNode : workflow
        ),
        selectedNode: state.selectedNode === action.payload ? null : state.selectedNode
      };

    case ACTIONS.ADD_CONNECTION:
      if (!state.currentWorkflow) return state;
      const workflowWithConnection = {
        ...state.currentWorkflow,
        connections: [...state.currentWorkflow.connections, action.payload],
        updatedAt: new Date().toISOString()
      };
      return {
        ...state,
        currentWorkflow: workflowWithConnection,
        workflows: state.workflows.map(workflow =>
          workflow.id === workflowWithConnection.id ? workflowWithConnection : workflow
        )
      };

    case ACTIONS.DELETE_CONNECTION:
      if (!state.currentWorkflow) return state;
      const workflowWithoutConnection = {
        ...state.currentWorkflow,
        connections: state.currentWorkflow.connections.filter(conn => conn.id !== action.payload),
        updatedAt: new Date().toISOString()
      };
      return {
        ...state,
        currentWorkflow: workflowWithoutConnection,
        workflows: state.workflows.map(workflow =>
          workflow.id === workflowWithoutConnection.id ? workflowWithoutConnection : workflow
        )
      };

    case ACTIONS.SET_SELECTED_NODE:
      return { ...state, selectedNode: action.payload };

    case ACTIONS.START_EXECUTION:
      return {
        ...state,
        isExecuting: true,
        executionStatus: {},
        executionLogs: []
      };

    case ACTIONS.UPDATE_EXECUTION_STATUS:
      return {
        ...state,
        executionStatus: {
          ...state.executionStatus,
          [action.payload.nodeId]: action.payload.status
        }
      };

    case ACTIONS.FINISH_EXECUTION:
      if (!state.currentWorkflow) return state;
      const finishedWorkflow = {
        ...state.currentWorkflow,
        lastRun: new Date().toISOString(),
        executions: state.currentWorkflow.executions + 1,
        updatedAt: new Date().toISOString()
      };
      return {
        ...state,
        isExecuting: false,
        currentWorkflow: finishedWorkflow,
        workflows: state.workflows.map(workflow =>
          workflow.id === finishedWorkflow.id ? finishedWorkflow : workflow
        )
      };

    case ACTIONS.ADD_EXECUTION_LOG:
      return {
        ...state,
        executionLogs: [...state.executionLogs, action.payload]
      };

    case ACTIONS.CLEAR_EXECUTION_LOGS:
      return { ...state, executionLogs: [] };

    case ACTIONS.ADD_TO_HISTORY:
      return {
        ...state,
        workflowHistory: [action.payload, ...state.workflowHistory.slice(0, 49)] // Keep last 50 actions
      };

    case ACTIONS.SAVE_WORKFLOW:
      // This would be where we save to backend
      return state;

    default:
      return state;
  }
}

// Mock data
const createMockWorkflows = (userId) => [
  {
    id: '1',
    name: 'Email Marketing Campaign',
    description: 'Automated email workflow for new subscribers',
    nodes: [
      {
        id: 'trigger-1',
        type: 'webhook',
        position: { x: 100, y: 100 },
        data: { label: 'Webhook Trigger', config: { url: '/webhook/new-subscriber', httpMethod: 'POST' } }
      },
      {
        id: 'action-1',
        type: 'gmail',
        position: { x: 350, y: 100 },
        data: { label: 'Send Welcome Email', config: { to: '{{email}}', subject: 'Welcome to Quantamworkforce!' } }
      }
    ],
    connections: [
      { id: 'conn-1', source: 'trigger-1', target: 'action-1' }
    ],
    isActive: true,
    lastRun: new Date(Date.now() - 3600000).toISOString(),
    executions: 45,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    createdBy: userId
  },
  {
    id: '2',
    name: 'Data Backup Process',
    description: 'Daily backup of user data to cloud storage',
    nodes: [
      {
        id: 'trigger-2',
        type: 'schedule',
        position: { x: 100, y: 100 },
        data: { label: 'Daily Schedule', config: { cronExpression: '0 2 * * *' } }
      },
      {
        id: 'action-2',
        type: 'mysql',
        position: { x: 350, y: 100 },
        data: { label: 'Export Data', config: { query: 'SELECT * FROM users' } }
      },
      {
        id: 'action-3',
        type: 'aws-s3',
        position: { x: 600, y: 100 },
        data: { label: 'Upload to S3', config: { bucketName: 'backups' } }
      }
    ],
    connections: [
      { id: 'conn-2', source: 'trigger-2', target: 'action-2' },
      { id: 'conn-3', source: 'action-2', target: 'action-3' }
    ],
    isActive: true,
    lastRun: new Date(Date.now() - 7200000).toISOString(),
    executions: 128,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
    createdBy: userId
  }
];

// Provider component
export function EnhancedWorkflowProvider({ children }) {
  const [state, dispatch] = useReducer(workflowReducer, initialState);
  const { user, isAuthenticated } = useAuth();
  const workflowEngine = new WorkflowEngine();

  // Load workflows when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      
      // Simulate API call
      setTimeout(() => {
        const mockWorkflows = createMockWorkflows(user.id);
        dispatch({ type: ACTIONS.LOAD_WORKFLOWS, payload: mockWorkflows });
      }, 1000);
    } else {
      dispatch({ type: ACTIONS.LOAD_WORKFLOWS, payload: [] });
    }
  }, [isAuthenticated, user]);

  // Auto-save workflow changes
  useEffect(() => {
    if (state.currentWorkflow && isAuthenticated) {
      const saveTimer = setTimeout(() => {
        // Auto-save workflow to localStorage or API
        const savedWorkflows = JSON.parse(localStorage.getItem('quantamworkforce_workflows') || '[]');
        const updatedWorkflows = savedWorkflows.map(w => 
          w.id === state.currentWorkflow.id ? state.currentWorkflow : w
        );
        
        if (!updatedWorkflows.find(w => w.id === state.currentWorkflow.id)) {
          updatedWorkflows.push(state.currentWorkflow);
        }
        
        localStorage.setItem('quantamworkforce_workflows', JSON.stringify(updatedWorkflows));
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(saveTimer);
    }
  }, [state.currentWorkflow, isAuthenticated]);

  const setCurrentWorkflow = useCallback((workflow) => {
    dispatch({ type: ACTIONS.SET_CURRENT_WORKFLOW, payload: workflow });
  }, []);

  const createWorkflow = useCallback((workflowData) => {
    if (!user) return;
    dispatch({ type: ACTIONS.CREATE_WORKFLOW, payload: { ...workflowData, userId: user.id } });
  }, [user]);

  const updateWorkflow = useCallback((id, updates) => {
    dispatch({ type: ACTIONS.UPDATE_WORKFLOW, payload: { id, updates } });
    dispatch({ type: ACTIONS.ADD_TO_HISTORY, payload: {
      id: uuidv4(),
      action: 'update_workflow',
      workflowId: id,
      timestamp: new Date().toISOString(),
      changes: updates
    }});
  }, []);

  const deleteWorkflow = useCallback((id) => {
    dispatch({ type: ACTIONS.DELETE_WORKFLOW, payload: id });
    dispatch({ type: ACTIONS.ADD_TO_HISTORY, payload: {
      id: uuidv4(),
      action: 'delete_workflow',
      workflowId: id,
      timestamp: new Date().toISOString()
    }});
  }, []);

  const duplicateWorkflow = useCallback((id) => {
    dispatch({ type: ACTIONS.DUPLICATE_WORKFLOW, payload: id });
  }, []);

  const addNode = useCallback((node) => {
    if (!node.position) {
      node.position = { x: 200 + Math.random() * 300, y: 150 + Math.random() * 200 };
    }
    dispatch({ type: ACTIONS.ADD_NODE, payload: node });
    dispatch({ type: ACTIONS.ADD_TO_HISTORY, payload: {
      id: uuidv4(),
      action: 'add_node',
      nodeId: node.id,
      timestamp: new Date().toISOString()
    }});
  }, []);

  const updateNode = useCallback((id, updates) => {
    dispatch({ type: ACTIONS.UPDATE_NODE, payload: { id, updates } });
  }, []);

  const deleteNode = useCallback((id) => {
    dispatch({ type: ACTIONS.DELETE_NODE, payload: id });
    dispatch({ type: ACTIONS.ADD_TO_HISTORY, payload: {
      id: uuidv4(),
      action: 'delete_node',
      nodeId: id,
      timestamp: new Date().toISOString()
    }});
  }, []);

  const addConnection = useCallback((connection) => {
    const connectionWithId = { ...connection, id: connection.id || uuidv4() };
    dispatch({ type: ACTIONS.ADD_CONNECTION, payload: connectionWithId });
    dispatch({ type: ACTIONS.ADD_TO_HISTORY, payload: {
      id: uuidv4(),
      action: 'add_connection',
      connectionId: connectionWithId.id,
      timestamp: new Date().toISOString()
    }});
  }, []);

  const deleteConnection = useCallback((id) => {
    dispatch({ type: ACTIONS.DELETE_CONNECTION, payload: id });
  }, []);

  const setSelectedNode = useCallback((nodeId) => {
    dispatch({ type: ACTIONS.SET_SELECTED_NODE, payload: nodeId });
  }, []);

  const executeWorkflow = useCallback(async () => {
    if (!state.currentWorkflow || state.isExecuting) return;

    dispatch({ type: ACTIONS.START_EXECUTION });
    dispatch({ type: ACTIONS.CLEAR_EXECUTION_LOGS });

    const onStatusUpdate = (nodeId, status) => {
      dispatch({
        type: ACTIONS.UPDATE_EXECUTION_STATUS,
        payload: { nodeId, status }
      });
    };

    const onLogUpdate = (logEntry) => {
      dispatch({
        type: ACTIONS.ADD_EXECUTION_LOG,
        payload: logEntry
      });
    };

    try {
      await workflowEngine.executeWorkflow(state.currentWorkflow, onStatusUpdate, onLogUpdate);
      
      workflowEngine.executionLogs.forEach(log => {
        dispatch({
          type: ACTIONS.ADD_EXECUTION_LOG,
          payload: log
        });
      });

      dispatch({ type: ACTIONS.FINISH_EXECUTION });
      
      dispatch({ type: ACTIONS.ADD_TO_HISTORY, payload: {
        id: uuidv4(),
        action: 'execute_workflow',
        workflowId: state.currentWorkflow.id,
        timestamp: new Date().toISOString(),
        executionId: workflowEngine.executionId
      }});
      
    } catch (error) {
      dispatch({
        type: ACTIONS.ADD_EXECUTION_LOG,
        payload: {
          id: `log_${Date.now()}`,
          type: 'error',
          source: 'Workflow',
          message: `Execution failed: ${error.message}`,
          timestamp: new Date().toISOString()
        }
      });
      dispatch({ type: ACTIONS.FINISH_EXECUTION });
    }
  }, [state.currentWorkflow, state.isExecuting]);

  const stopExecution = useCallback(() => {
    workflowEngine.stopExecution();
    dispatch({ type: ACTIONS.FINISH_EXECUTION });
  }, []);

  const saveWorkflow = useCallback(async () => {
    if (!state.currentWorkflow) return;
    
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch({ type: ACTIONS.SAVE_WORKFLOW });
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      
      return { success: true, message: 'Workflow saved successfully' };
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, [state.currentWorkflow]);

  const value = {
    ...state,
    setCurrentWorkflow,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    duplicateWorkflow,
    addNode,
    updateNode,
    deleteNode,
    addConnection,
    deleteConnection,
    setSelectedNode,
    executeWorkflow,
    stopExecution,
    saveWorkflow,
    workflowEngine
  };

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useEnhancedWorkflow() {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useEnhancedWorkflow must be used within an EnhancedWorkflowProvider');
  }
  return context;
}