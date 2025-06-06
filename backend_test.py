#!/usr/bin/env python3
import requests
import json
import os
import sys
import time
from datetime import datetime
import uuid
import random

# Get the backend URL from the frontend .env file
def get_backend_url():
    with open('/app/frontend/.env', 'r') as f:
        for line in f:
            if line.startswith('REACT_APP_BACKEND_URL='):
                return line.strip().split('=')[1].strip('"\'')
    return None

BACKEND_URL = get_backend_url()
if not BACKEND_URL:
    print("Error: Could not find REACT_APP_BACKEND_URL in frontend/.env")
    sys.exit(1)

API_URL = f"{BACKEND_URL}/api"
print(f"Using API URL: {API_URL}")

# Test results
test_results = {
    # Health & Status APIs
    "root_endpoint": {"success": False, "message": ""},
    "health_check": {"success": False, "message": ""},
    
    # Authentication APIs
    "user_registration": {"success": False, "message": ""},
    "user_login": {"success": False, "message": ""},
    "get_user_info": {"success": False, "message": ""},
    "update_user_info": {"success": False, "message": ""},
    
    # Workflow Management APIs
    "create_workflow": {"success": False, "message": ""},
    "get_workflows": {"success": False, "message": ""},
    "get_specific_workflow": {"success": False, "message": ""},
    "update_workflow": {"success": False, "message": ""},
    "delete_workflow": {"success": False, "message": ""},
    
    # Workflow Execution APIs
    "execute_workflow": {"success": False, "message": ""},
    "get_workflow_executions": {"success": False, "message": ""},
    "get_execution_details": {"success": False, "message": ""},
    
    # Node System APIs
    "get_node_definitions": {"success": False, "message": ""},
    "get_specific_node_definition": {"success": False, "message": ""},
    
    # Legacy Status APIs
    "create_status_check": {"success": False, "message": ""},
    "get_status_checks": {"success": False, "message": ""}
}

# Global variables to store test data
user_data = {
    "name": f"Test User {uuid.uuid4().hex[:8]}",
    "email": f"testuser_{uuid.uuid4().hex[:8]}@example.com",
    "password": f"Password123_{uuid.uuid4().hex[:8]}"
}
auth_token = None
workflow_id = None
execution_id = None
node_type = None

# ============================================================================
# Health & Status API Tests
# ============================================================================

def test_root_endpoint():
    """Test the root endpoint"""
    print("\n=== Testing Root Endpoint ===")
    try:
        response = requests.get(f"{API_URL}/")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if "message" in data and "status" in data:
                test_results["root_endpoint"]["success"] = True
                test_results["root_endpoint"]["message"] = "Root endpoint returned expected response"
            else:
                test_results["root_endpoint"]["message"] = f"Root endpoint returned unexpected response: {data}"
        else:
            test_results["root_endpoint"]["message"] = f"Root endpoint returned status code {response.status_code}"
    except Exception as e:
        test_results["root_endpoint"]["message"] = f"Error testing root endpoint: {str(e)}"
        print(f"Error: {str(e)}")

def test_health_check():
    """Test the health check endpoint"""
    print("\n=== Testing Health Check ===")
    try:
        response = requests.get(f"{API_URL}/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if "status" in data and data["status"] == "healthy" and "database" in data:
                test_results["health_check"]["success"] = True
                test_results["health_check"]["message"] = "Health check returned expected response"
            else:
                test_results["health_check"]["message"] = f"Health check returned unexpected response: {data}"
        else:
            test_results["health_check"]["message"] = f"Health check returned status code {response.status_code}"
    except Exception as e:
        test_results["health_check"]["message"] = f"Error testing health check: {str(e)}"
        print(f"Error: {str(e)}")

# ============================================================================
# Authentication API Tests
# ============================================================================

def test_user_registration():
    """Test user registration"""
    print("\n=== Testing User Registration ===")
    global auth_token
    try:
        payload = user_data
        print(f"Registering user: {payload['email']}")
        
        response = requests.post(f"{API_URL}/auth/register", json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:200]}...")  # Print first 200 chars
        
        if response.status_code == 200:
            data = response.json()
            if "access_token" in data and "user" in data:
                auth_token = data["access_token"]
                test_results["user_registration"]["success"] = True
                test_results["user_registration"]["message"] = f"User registered successfully: {data['user']['email']}"
            else:
                test_results["user_registration"]["message"] = f"User registration response missing expected fields: {data}"
        else:
            test_results["user_registration"]["message"] = f"User registration returned status code {response.status_code}: {response.text}"
    except Exception as e:
        test_results["user_registration"]["message"] = f"Error testing user registration: {str(e)}"
        print(f"Error: {str(e)}")

def test_user_login():
    """Test user login"""
    print("\n=== Testing User Login ===")
    global auth_token
    try:
        payload = {
            "email": user_data["email"],
            "password": user_data["password"]
        }
        print(f"Logging in user: {payload['email']}")
        
        response = requests.post(f"{API_URL}/auth/login", json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:200]}...")  # Print first 200 chars
        
        if response.status_code == 200:
            data = response.json()
            if "access_token" in data and "user" in data:
                auth_token = data["access_token"]
                test_results["user_login"]["success"] = True
                test_results["user_login"]["message"] = f"User logged in successfully: {data['user']['email']}"
            else:
                test_results["user_login"]["message"] = f"User login response missing expected fields: {data}"
        else:
            test_results["user_login"]["message"] = f"User login returned status code {response.status_code}: {response.text}"
    except Exception as e:
        test_results["user_login"]["message"] = f"Error testing user login: {str(e)}"
        print(f"Error: {str(e)}")

def test_get_user_info():
    """Test getting user info"""
    print("\n=== Testing Get User Info ===")
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{API_URL}/auth/me", headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:200]}...")  # Print first 200 chars
        
        if response.status_code == 200:
            data = response.json()
            if "id" in data and "email" in data and data["email"] == user_data["email"]:
                test_results["get_user_info"]["success"] = True
                test_results["get_user_info"]["message"] = f"Got user info successfully: {data['email']}"
            else:
                test_results["get_user_info"]["message"] = f"Get user info response missing expected fields: {data}"
        else:
            test_results["get_user_info"]["message"] = f"Get user info returned status code {response.status_code}: {response.text}"
    except Exception as e:
        test_results["get_user_info"]["message"] = f"Error testing get user info: {str(e)}"
        print(f"Error: {str(e)}")

def test_update_user_info():
    """Test updating user info"""
    print("\n=== Testing Update User Info ===")
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        new_name = f"Updated User {uuid.uuid4().hex[:8]}"
        payload = {"name": new_name}
        
        response = requests.put(f"{API_URL}/auth/me", json=payload, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:200]}...")  # Print first 200 chars
        
        if response.status_code == 200:
            data = response.json()
            if "id" in data and "name" in data and data["name"] == new_name:
                test_results["update_user_info"]["success"] = True
                test_results["update_user_info"]["message"] = f"Updated user info successfully: {data['name']}"
            else:
                test_results["update_user_info"]["message"] = f"Update user info response missing expected fields: {data}"
        else:
            test_results["update_user_info"]["message"] = f"Update user info returned status code {response.status_code}: {response.text}"
    except Exception as e:
        test_results["update_user_info"]["message"] = f"Error testing update user info: {str(e)}"
        print(f"Error: {str(e)}")

# ============================================================================
# Workflow Management API Tests
# ============================================================================

def test_create_workflow():
    """Test creating a workflow"""
    print("\n=== Testing Create Workflow ===")
    global workflow_id
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        workflow_name = f"Test Workflow {uuid.uuid4().hex[:8]}"
        payload = {
            "name": workflow_name,
            "description": "A test workflow created by the automated test suite",
            "tags": ["test", "automation"]
        }
        
        response = requests.post(f"{API_URL}/workflows", json=payload, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:200]}...")  # Print first 200 chars
        
        if response.status_code == 200:
            data = response.json()
            if "id" in data and "name" in data and data["name"] == workflow_name:
                workflow_id = data["id"]
                test_results["create_workflow"]["success"] = True
                test_results["create_workflow"]["message"] = f"Created workflow successfully: {data['name']} (ID: {workflow_id})"
            else:
                test_results["create_workflow"]["message"] = f"Create workflow response missing expected fields: {data}"
        else:
            test_results["create_workflow"]["message"] = f"Create workflow returned status code {response.status_code}: {response.text}"
    except Exception as e:
        test_results["create_workflow"]["message"] = f"Error testing create workflow: {str(e)}"
        print(f"Error: {str(e)}")

def test_get_workflows():
    """Test getting workflows"""
    print("\n=== Testing Get Workflows ===")
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{API_URL}/workflows", headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:200]}...")  # Print first 200 chars
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                # Check if our created workflow is in the list
                found = any(item.get("id") == workflow_id for item in data)
                if found:
                    print(f"Found our created workflow with ID: {workflow_id}")
                else:
                    print(f"Warning: Could not find our created workflow with ID: {workflow_id}")
                
                test_results["get_workflows"]["success"] = True
                test_results["get_workflows"]["message"] = f"Retrieved {len(data)} workflows successfully"
            else:
                test_results["get_workflows"]["message"] = f"Get workflows did not return a list: {data}"
        else:
            test_results["get_workflows"]["message"] = f"Get workflows returned status code {response.status_code}: {response.text}"
    except Exception as e:
        test_results["get_workflows"]["message"] = f"Error testing get workflows: {str(e)}"
        print(f"Error: {str(e)}")

def test_get_specific_workflow():
    """Test getting a specific workflow"""
    print("\n=== Testing Get Specific Workflow ===")
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{API_URL}/workflows/{workflow_id}", headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:200]}...")  # Print first 200 chars
        
        if response.status_code == 200:
            data = response.json()
            if "id" in data and data["id"] == workflow_id:
                test_results["get_specific_workflow"]["success"] = True
                test_results["get_specific_workflow"]["message"] = f"Retrieved workflow successfully: {data['name']} (ID: {workflow_id})"
            else:
                test_results["get_specific_workflow"]["message"] = f"Get specific workflow response missing expected fields: {data}"
        else:
            test_results["get_specific_workflow"]["message"] = f"Get specific workflow returned status code {response.status_code}: {response.text}"
    except Exception as e:
        test_results["get_specific_workflow"]["message"] = f"Error testing get specific workflow: {str(e)}"
        print(f"Error: {str(e)}")

def test_update_workflow():
    """Test updating a workflow"""
    print("\n=== Testing Update Workflow ===")
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        new_name = f"Updated Workflow {uuid.uuid4().hex[:8]}"
        new_description = "An updated test workflow"
        
        # Create a simple workflow with nodes and connections
        trigger_node_id = f"node_{uuid.uuid4().hex[:8]}"
        function_node_id = f"node_{uuid.uuid4().hex[:8]}"
        connection_id = f"conn_{uuid.uuid4().hex[:8]}"
        
        payload = {
            "name": new_name,
            "description": new_description,
            "tags": ["test", "updated", "automation"],
            "nodes": [
                {
                    "id": trigger_node_id,
                    "type": "manual-trigger",
                    "name": "Manual Trigger",
                    "position": {"x": 100, "y": 100},
                    "data": {
                        "label": "Start",
                        "properties": {},
                        "config": {}
                    }
                },
                {
                    "id": function_node_id,
                    "type": "function",
                    "name": "Function",
                    "position": {"x": 300, "y": 100},
                    "data": {
                        "label": "Process",
                        "properties": {
                            "functionCode": "return items;"
                        },
                        "config": {}
                    }
                }
            ],
            "connections": [
                {
                    "id": connection_id,
                    "source": trigger_node_id,
                    "target": function_node_id
                }
            ]
        }
        
        response = requests.put(f"{API_URL}/workflows/{workflow_id}", json=payload, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:200]}...")  # Print first 200 chars
        
        if response.status_code == 200:
            data = response.json()
            if "id" in data and data["id"] == workflow_id and data["name"] == new_name:
                test_results["update_workflow"]["success"] = True
                test_results["update_workflow"]["message"] = f"Updated workflow successfully: {data['name']} (ID: {workflow_id})"
            else:
                test_results["update_workflow"]["message"] = f"Update workflow response missing expected fields: {data}"
        else:
            test_results["update_workflow"]["message"] = f"Update workflow returned status code {response.status_code}: {response.text}"
    except Exception as e:
        test_results["update_workflow"]["message"] = f"Error testing update workflow: {str(e)}"
        print(f"Error: {str(e)}")

def test_delete_workflow():
    """Test deleting a workflow"""
    print("\n=== Testing Delete Workflow ===")
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.delete(f"{API_URL}/workflows/{workflow_id}", headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:200]}...")  # Print first 200 chars
        
        if response.status_code == 200:
            data = response.json()
            if "message" in data and "deleted" in data["message"].lower():
                test_results["delete_workflow"]["success"] = True
                test_results["delete_workflow"]["message"] = f"Deleted workflow successfully: {workflow_id}"
            else:
                test_results["delete_workflow"]["message"] = f"Delete workflow response missing expected message: {data}"
        else:
            test_results["delete_workflow"]["message"] = f"Delete workflow returned status code {response.status_code}: {response.text}"
    except Exception as e:
        test_results["delete_workflow"]["message"] = f"Error testing delete workflow: {str(e)}"
        print(f"Error: {str(e)}")

# ============================================================================
# Workflow Execution API Tests
# ============================================================================

def test_execute_workflow():
    """Test executing a workflow"""
    print("\n=== Testing Execute Workflow ===")
    global execution_id
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        input_data = {"test_key": "test_value"}
        
        response = requests.post(f"{API_URL}/workflows/{workflow_id}/execute", json=input_data, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:200]}...")  # Print first 200 chars
        
        if response.status_code == 200:
            data = response.json()
            if "id" in data and "workflow_id" in data and data["workflow_id"] == workflow_id:
                execution_id = data["id"]
                test_results["execute_workflow"]["success"] = True
                test_results["execute_workflow"]["message"] = f"Executed workflow successfully: {workflow_id} (Execution ID: {execution_id})"
            else:
                test_results["execute_workflow"]["message"] = f"Execute workflow response missing expected fields: {data}"
        else:
            test_results["execute_workflow"]["message"] = f"Execute workflow returned status code {response.status_code}: {response.text}"
    except Exception as e:
        test_results["execute_workflow"]["message"] = f"Error testing execute workflow: {str(e)}"
        print(f"Error: {str(e)}")

def test_get_workflow_executions():
    """Test getting workflow executions"""
    print("\n=== Testing Get Workflow Executions ===")
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{API_URL}/workflows/{workflow_id}/executions", headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:200]}...")  # Print first 200 chars
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                # Check if our execution is in the list
                found = any(item.get("id") == execution_id for item in data)
                if found:
                    print(f"Found our execution with ID: {execution_id}")
                else:
                    print(f"Warning: Could not find our execution with ID: {execution_id}")
                
                test_results["get_workflow_executions"]["success"] = True
                test_results["get_workflow_executions"]["message"] = f"Retrieved {len(data)} executions successfully"
            else:
                test_results["get_workflow_executions"]["message"] = f"Get workflow executions did not return a list: {data}"
        else:
            test_results["get_workflow_executions"]["message"] = f"Get workflow executions returned status code {response.status_code}: {response.text}"
    except Exception as e:
        test_results["get_workflow_executions"]["message"] = f"Error testing get workflow executions: {str(e)}"
        print(f"Error: {str(e)}")

def test_get_execution_details():
    """Test getting execution details"""
    print("\n=== Testing Get Execution Details ===")
    try:
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{API_URL}/executions/{execution_id}", headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:200]}...")  # Print first 200 chars
        
        if response.status_code == 200:
            data = response.json()
            if "id" in data and data["id"] == execution_id and "workflow_id" in data and data["workflow_id"] == workflow_id:
                test_results["get_execution_details"]["success"] = True
                test_results["get_execution_details"]["message"] = f"Retrieved execution details successfully: {execution_id}"
            else:
                test_results["get_execution_details"]["message"] = f"Get execution details response missing expected fields: {data}"
        else:
            test_results["get_execution_details"]["message"] = f"Get execution details returned status code {response.status_code}: {response.text}"
    except Exception as e:
        test_results["get_execution_details"]["message"] = f"Error testing get execution details: {str(e)}"
        print(f"Error: {str(e)}")

# ============================================================================
# Node System API Tests
# ============================================================================

def test_get_node_definitions():
    """Test getting node definitions"""
    print("\n=== Testing Get Node Definitions ===")
    global node_type
    try:
        response = requests.get(f"{API_URL}/nodes")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:200]}...")  # Print first 200 chars
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) > 0:
                # Store a node type for the next test
                node_type = data[0]["type"]
                test_results["get_node_definitions"]["success"] = True
                test_results["get_node_definitions"]["message"] = f"Retrieved {len(data)} node definitions successfully"
            else:
                test_results["get_node_definitions"]["message"] = f"Get node definitions did not return a valid list: {data}"
        else:
            test_results["get_node_definitions"]["message"] = f"Get node definitions returned status code {response.status_code}: {response.text}"
    except Exception as e:
        test_results["get_node_definitions"]["message"] = f"Error testing get node definitions: {str(e)}"
        print(f"Error: {str(e)}")

def test_get_specific_node_definition():
    """Test getting a specific node definition"""
    print("\n=== Testing Get Specific Node Definition ===")
    try:
        if not node_type:
            test_results["get_specific_node_definition"]["message"] = "Skipped because no node type was found in previous test"
            return
            
        response = requests.get(f"{API_URL}/nodes/{node_type}")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:200]}...")  # Print first 200 chars
        
        if response.status_code == 200:
            data = response.json()
            if "type" in data and data["type"] == node_type:
                test_results["get_specific_node_definition"]["success"] = True
                test_results["get_specific_node_definition"]["message"] = f"Retrieved node definition successfully: {node_type}"
            else:
                test_results["get_specific_node_definition"]["message"] = f"Get specific node definition response missing expected fields: {data}"
        else:
            test_results["get_specific_node_definition"]["message"] = f"Get specific node definition returned status code {response.status_code}: {response.text}"
    except Exception as e:
        test_results["get_specific_node_definition"]["message"] = f"Error testing get specific node definition: {str(e)}"
        print(f"Error: {str(e)}")

# ============================================================================
# Legacy Status API Tests
# ============================================================================

def test_create_status_check():
    """Test creating a status check"""
    print("\n=== Testing Create Status Check ===")
    try:
        client_name = f"test-client-{uuid.uuid4()}"
        payload = {"client_name": client_name}
        print(f"Sending payload: {payload}")
        
        response = requests.post(f"{API_URL}/status", json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("client_name") == client_name and "id" in data and "timestamp" in data:
                test_results["create_status_check"]["success"] = True
                test_results["create_status_check"]["message"] = "Status check created successfully"
                # Store the client name for the get test
                test_results["create_status_check"]["client_name"] = client_name
            else:
                test_results["create_status_check"]["message"] = f"Status check response missing expected fields: {data}"
        else:
            test_results["create_status_check"]["message"] = f"Create status check returned status code {response.status_code}"
    except Exception as e:
        test_results["create_status_check"]["message"] = f"Error testing create status check: {str(e)}"
        print(f"Error: {str(e)}")

def test_get_status_checks():
    """Test getting status checks"""
    print("\n=== Testing Get Status Checks ===")
    try:
        response = requests.get(f"{API_URL}/status")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:200]}...")  # Print first 200 chars
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                # Check if our created status check is in the list
                client_name = test_results.get("create_status_check", {}).get("client_name")
                if client_name:
                    found = any(item.get("client_name") == client_name for item in data)
                    if found:
                        print(f"Found our created status check with client_name: {client_name}")
                    else:
                        print(f"Warning: Could not find our created status check with client_name: {client_name}")
                
                test_results["get_status_checks"]["success"] = True
                test_results["get_status_checks"]["message"] = f"Retrieved {len(data)} status checks successfully"
            else:
                test_results["get_status_checks"]["message"] = f"Get status checks did not return a list: {data}"
        else:
            test_results["get_status_checks"]["message"] = f"Get status checks returned status code {response.status_code}"
    except Exception as e:
        test_results["get_status_checks"]["message"] = f"Error testing get status checks: {str(e)}"
        print(f"Error: {str(e)}")

# ============================================================================
# Main Test Runner
# ============================================================================

def run_all_tests():
    """Run all tests"""
    print("Starting backend API tests...")
    
    # Test Health & Status APIs
    test_root_endpoint()
    test_health_check()
    
    # Test Legacy Status APIs (these don't require authentication)
    test_create_status_check()
    test_get_status_checks()
    
    # Test Authentication APIs
    test_user_registration()
    
    if not test_results["user_registration"]["success"]:
        print("User registration failed, skipping remaining tests that require authentication")
        return False
    
    test_user_login()
    
    if not test_results["user_login"]["success"]:
        print("User login failed, skipping remaining tests that require authentication")
        return False
    
    test_get_user_info()
    test_update_user_info()
    
    # Test Workflow Management APIs
    test_create_workflow()
    
    if not test_results["create_workflow"]["success"]:
        print("Workflow creation failed, skipping remaining workflow tests")
        return False
    
    test_get_workflows()
    test_get_specific_workflow()
    test_update_workflow()
    
    # Test Workflow Execution APIs
    test_execute_workflow()
    
    if not test_results["execute_workflow"]["success"]:
        print("Workflow execution failed, skipping remaining execution tests")
    else:
        # Wait a moment for the execution to process
        print("Waiting 2 seconds for workflow execution to process...")
        time.sleep(2)
        
        test_get_workflow_executions()
        test_get_execution_details()
    
    # Test Node System APIs
    test_get_node_definitions()
    test_get_specific_node_definition()
    
    # Finally, test workflow deletion
    test_delete_workflow()
    
    # Print summary
    print("\n=== Test Results Summary ===")
    all_passed = True
    for test_name, result in test_results.items():
        status = "PASSED" if result["success"] else "FAILED"
        print(f"{test_name}: {status}")
        print(f"  {result['message']}")
        if not result["success"]:
            all_passed = False
    
    print("\nOverall Result:", "PASSED" if all_passed else "FAILED")
    return all_passed

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
