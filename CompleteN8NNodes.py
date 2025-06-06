"""
Mock N8N Nodes for testing purposes
"""

ALL_N8N_NODES = {
    "manual-trigger": {
        "name": "Manual Trigger",
        "category": "Triggers",
        "color": "#FF6D5A",
        "icon": "fa:play-circle",
        "description": "Starts the workflow execution manually",
        "inputs": 0,
        "outputs": 1,
        "properties": {},
        "isTrigger": True
    },
    "webhook": {
        "name": "Webhook",
        "category": "Triggers",
        "color": "#FF6D5A",
        "icon": "fa:bolt",
        "description": "Starts the workflow when a webhook is called",
        "inputs": 0,
        "outputs": 1,
        "properties": {
            "path": {
                "type": "string",
                "default": "",
                "description": "The path to use for the webhook"
            },
            "responseMode": {
                "type": "options",
                "options": [
                    {"name": "Last Node", "value": "lastNode"},
                    {"name": "Simple", "value": "simple"}
                ],
                "default": "lastNode",
                "description": "The response mode to use"
            }
        },
        "isTrigger": True
    },
    "schedule": {
        "name": "Schedule",
        "category": "Triggers",
        "color": "#FF6D5A",
        "icon": "fa:clock",
        "description": "Starts the workflow at a specific time",
        "inputs": 0,
        "outputs": 1,
        "properties": {
            "cronExpression": {
                "type": "string",
                "default": "* * * * *",
                "description": "The cron expression to use"
            }
        },
        "isTrigger": True
    },
    "http-request": {
        "name": "HTTP Request",
        "category": "Communication",
        "color": "#4CAF50",
        "icon": "fa:globe",
        "description": "Makes an HTTP request",
        "inputs": 1,
        "outputs": 1,
        "properties": {
            "url": {
                "type": "string",
                "default": "",
                "description": "The URL to make the request to"
            },
            "method": {
                "type": "options",
                "options": [
                    {"name": "GET", "value": "GET"},
                    {"name": "POST", "value": "POST"},
                    {"name": "PUT", "value": "PUT"},
                    {"name": "DELETE", "value": "DELETE"}
                ],
                "default": "GET",
                "description": "The HTTP method to use"
            }
        }
    },
    "function": {
        "name": "Function",
        "category": "Development",
        "color": "#3498DB",
        "icon": "fa:code",
        "description": "Runs custom JavaScript code",
        "inputs": 1,
        "outputs": 1,
        "properties": {
            "functionCode": {
                "type": "string",
                "default": "// Code here will run once\nreturn items;",
                "description": "The JavaScript code to execute"
            }
        }
    }
}
