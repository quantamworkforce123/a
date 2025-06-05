import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { WorkflowEngine } from './WorkflowEngine';
import { createNodeInstance } from './NodeDefinitions';

const WorkflowContext = createContext();

// Initial state
const initialState = {
  workflows: [
    {
      id: '1',
      name: 'Email Marketing Campaign',
      description: 'Automated email workflow for new subscribers',
      nodes: [
        {
          id: 'trigger-1',
          type: 'webhook',
          position: { x: 100, y: 100 },
          data: { label: 'Webhook Trigger', config: { url: '/webhook/new-subscriber' } }
        },
        {
          id: 'action-1',
          type: 'email',
          position: { x: 350, y: 100 },
          data: { label: 'Send Welcome Email', config: { to: '{{email}}', subject: 'Welcome!' } }
        }
      ],
      connections: [
        { id: 'conn-1', source: 'trigger-1', target: 'action-1' }
      ],
      isActive: true,
      lastRun: new Date(Date.now() - 3600000).toISOString(),
      executions: 45
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
          data: { label: 'Daily Schedule', config: { cron: '0 2 * * *' } }
        },
        {
          id: 'action-2',
          type: 'database',
          position: { x: 350, y: 100 },
          data: { label: 'Export Data', config: { query: 'SELECT * FROM users' } }
        },
        {
          id: 'action-3',
          type: 'cloud-storage',
          position: { x: 600, y: 100 },
          data: { label: 'Upload to S3', config: { bucket: 'backups' } }
        }
      ],
      connections: [
        { id: 'conn-2', source: 'trigger-2', target: 'action-2' },
        { id: 'conn-3', source: 'action-2', target: 'action-3' }
      ],
      isActive: true,
      lastRun: new Date(Date.now() - 7200000).toISOString(),
      executions: 128
    }
  ],
  currentWorkflow: null,
  selectedNode: null,
  isExecuting: false,
  executionStatus: {},
  executionLogs: []
};

// Action types
const ACTIONS = {
  SET_CURRENT_WORKFLOW: 'SET_CURRENT_WORKFLOW',
  CREATE_WORKFLOW: 'CREATE_WORKFLOW',
  UPDATE_WORKFLOW: 'UPDATE_WORKFLOW',
  DELETE_WORKFLOW: 'DELETE_WORKFLOW',
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
  CLEAR_EXECUTION_LOGS: 'CLEAR_EXECUTION_LOGS'
};

// Reducer
function workflowReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_CURRENT_WORKFLOW:
      return {
        ...state,
        currentWorkflow: action.payload
      };

    case ACTIONS.CREATE_WORKFLOW:
      const newWorkflow = {
        id: uuidv4(),
        name: action.payload.name || 'New Workflow',
        description: action.payload.description || '',
        nodes: [],
        connections: [],
        isActive: false,
        lastRun: null,
        executions: 0
      };
      return {
        ...state,
        workflows: [...state.workflows, newWorkflow],
        currentWorkflow: newWorkflow
      };

    case ACTIONS.UPDATE_WORKFLOW:
      return {
        ...state,
        workflows: state.workflows.map(workflow =>
          workflow.id === action.payload.id
            ? { ...workflow, ...action.payload.updates }
            : workflow
        ),
        currentWorkflow: state.currentWorkflow?.id === action.payload.id
          ? { ...state.currentWorkflow, ...action.payload.updates }
          : state.currentWorkflow
      };

    case ACTIONS.DELETE_WORKFLOW:
      return {
        ...state,
        workflows: state.workflows.filter(workflow => workflow.id !== action.payload),
        currentWorkflow: state.currentWorkflow?.id === action.payload ? null : state.currentWorkflow
      };

    case ACTIONS.ADD_NODE:
      if (!state.currentWorkflow) return state;
      const updatedWorkflow = {
        ...state.currentWorkflow,
        nodes: [...state.currentWorkflow.nodes, action.payload]
      };
      return {
        ...state,
        currentWorkflow: updatedWorkflow,
        workflows: state.workflows.map(workflow =>
          workflow.id === updatedWorkflow.id ? updatedWorkflow : workflow
        )
      };

    case ACTIONS.UPDATE_NODE:
      if (!state.currentWorkflow) return state;
      const updatedWorkflowWithNode = {
        ...state.currentWorkflow,
        nodes: state.currentWorkflow.nodes.map(node =>
          node.id === action.payload.id ? { ...node, ...action.payload.updates } : node
        )
      };
      return {
        ...state,
        currentWorkflow: updatedWorkflowWithNode,
        workflows: state.workflows.map(workflow =>
          workflow.id === updatedWorkflowWithNode.id ? updatedWorkflowWithNode : workflow
        )
      };

    case ACTIONS.DELETE_NODE:
      if (!state.currentWorkflow) return state;
      const workflowWithoutNode = {
        ...state.currentWorkflow,
        nodes: state.currentWorkflow.nodes.filter(node => node.id !== action.payload),
        connections: state.currentWorkflow.connections.filter(
          conn => conn.source !== action.payload && conn.target !== action.payload
        )
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
        connections: [...state.currentWorkflow.connections, action.payload]
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
        connections: state.currentWorkflow.connections.filter(conn => conn.id !== action.payload)
      };
      return {
        ...state,
        currentWorkflow: workflowWithoutConnection,
        workflows: state.workflows.map(workflow =>
          workflow.id === workflowWithoutConnection.id ? workflowWithoutConnection : workflow
        )
      };

    case ACTIONS.SET_SELECTED_NODE:
      return {
        ...state,
        selectedNode: action.payload
      };

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
      const finishedWorkflow = {
        ...state.currentWorkflow,
        lastRun: new Date().toISOString(),
        executions: state.currentWorkflow.executions + 1
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
      return {
        ...state,
        executionLogs: []
      };

    default:
      return state;
  }
}

// Provider component
export function WorkflowProvider({ children }) {
  const [state, dispatch] = useReducer(workflowReducer, initialState);
  const workflowEngine = new WorkflowEngine();

  // Actions
  const setCurrentWorkflow = useCallback((workflow) => {
    dispatch({ type: ACTIONS.SET_CURRENT_WORKFLOW, payload: workflow });
  }, []);

  const createWorkflow = useCallback((workflowData) => {
    dispatch({ type: ACTIONS.CREATE_WORKFLOW, payload: workflowData });
  }, []);

  const updateWorkflow = useCallback((id, updates) => {
    dispatch({ type: ACTIONS.UPDATE_WORKFLOW, payload: { id, updates } });
  }, []);

  const deleteWorkflow = useCallback((id) => {
    dispatch({ type: ACTIONS.DELETE_WORKFLOW, payload: id });
  }, []);

  const addNode = useCallback((node) => {
    // Ensure the node has a unique position if not specified
    if (!node.position) {
      node.position = { x: 200 + Math.random() * 300, y: 150 + Math.random() * 200 };
    }
    dispatch({ type: ACTIONS.ADD_NODE, payload: node });
  }, []);

  const updateNode = useCallback((id, updates) => {
    dispatch({ type: ACTIONS.UPDATE_NODE, payload: { id, updates } });
  }, []);

  const deleteNode = useCallback((id) => {
    dispatch({ type: ACTIONS.DELETE_NODE, payload: id });
  }, []);

  const addConnection = useCallback((connection) => {
    dispatch({ type: ACTIONS.ADD_CONNECTION, payload: connection });
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
      
      // Add all logs from the engine
      workflowEngine.executionLogs.forEach(log => {
        dispatch({
          type: ACTIONS.ADD_EXECUTION_LOG,
          payload: log
        });
      });

      dispatch({ type: ACTIONS.FINISH_EXECUTION });
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

  const value = {
    ...state,
    setCurrentWorkflow,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    addNode,
    updateNode,
    deleteNode,
    addConnection,
    deleteConnection,
    setSelectedNode,
    executeWorkflow,
    stopExecution,
    workflowEngine
  };

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
}

// Helper function to execute node chain
async function executeNodeChain(nodeId, nodes, connections, dispatch) {
  const node = nodes.find(n => n.id === nodeId);
  if (!node) return;

  // Update node status to executing
  dispatch({
    type: ACTIONS.UPDATE_EXECUTION_STATUS,
    payload: { nodeId, status: 'executing' }
  });

  // Add execution log
  dispatch({
    type: ACTIONS.ADD_EXECUTION_LOG,
    payload: {
      nodeId,
      message: `Executing ${node.data.label}`,
      timestamp: new Date().toISOString(),
      type: 'info'
    }
  });

  // Simulate node execution
  const success = await simulateNodeExecution(node, dispatch);

  // Update node status
  dispatch({
    type: ACTIONS.UPDATE_EXECUTION_STATUS,
    payload: { nodeId, status: success ? 'success' : 'error' }
  });

  if (success) {
    // Find and execute connected nodes
    const connectedNodes = connections
      .filter(conn => conn.source === nodeId)
      .map(conn => conn.target);

    for (const connectedNodeId of connectedNodes) {
      await executeNodeChain(connectedNodeId, nodes, connections, dispatch);
    }
  }
}

// Simulate node execution
async function simulateNodeExecution(node, dispatch) {
  return new Promise(resolve => {
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate
      
      dispatch({
        type: ACTIONS.ADD_EXECUTION_LOG,
        payload: {
          nodeId: node.id,
          message: success 
            ? `✅ ${node.data.label} executed successfully`
            : `❌ ${node.data.label} failed to execute`,
          timestamp: new Date().toISOString(),
          type: success ? 'success' : 'error'
        }
      });

      resolve(success);
    }, Math.random() * 2000 + 500); // Random delay between 500-2500ms
  });
}

// Hook to use the workflow context
export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
}