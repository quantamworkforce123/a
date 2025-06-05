#!/usr/bin/env python3
import requests
import json
import os
import sys
import time
from datetime import datetime
import uuid

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
    "root_endpoint": {"success": False, "message": ""},
    "create_status_check": {"success": False, "message": ""},
    "get_status_checks": {"success": False, "message": ""}
}

def test_root_endpoint():
    """Test the root endpoint"""
    print("\n=== Testing Root Endpoint ===")
    try:
        response = requests.get(f"{API_URL}/")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("message") == "Hello World":
                test_results["root_endpoint"]["success"] = True
                test_results["root_endpoint"]["message"] = "Root endpoint returned expected response"
            else:
                test_results["root_endpoint"]["message"] = f"Root endpoint returned unexpected response: {data}"
        else:
            test_results["root_endpoint"]["message"] = f"Root endpoint returned status code {response.status_code}"
    except Exception as e:
        test_results["root_endpoint"]["message"] = f"Error testing root endpoint: {str(e)}"
        print(f"Error: {str(e)}")

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
        print(f"Response: {response.text[:200]}...")  # Print first 200 chars to avoid large output
        
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

def run_all_tests():
    """Run all tests"""
    print("Starting backend API tests...")
    
    # Run tests
    test_root_endpoint()
    test_create_status_check()
    test_get_status_checks()
    
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