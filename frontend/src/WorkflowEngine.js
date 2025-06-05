// Advanced workflow execution engine that simulates real N8N workflow processing

import { NODE_DEFINITIONS } from './NodeDefinitions';

export class WorkflowEngine {
  constructor() {
    this.isExecuting = false;
    this.executionId = null;
    this.executionLogs = [];
    this.nodeStatuses = {};
    this.nodeOutputs = {};
    this.executionData = {};
  }

  async executeWorkflow(workflow, onStatusUpdate, onLogUpdate) {
    if (this.isExecuting) {
      throw new Error('Workflow is already executing');
    }

    this.isExecuting = true;
    this.executionId = `exec_${Date.now()}`;
    this.executionLogs = [];
    this.nodeStatuses = {};
    this.nodeOutputs = {};
    this.executionData = {};

    this.log('info', 'Workflow', 'Starting workflow execution');

    try {
      // Find trigger nodes (nodes with no incoming connections)
      const triggerNodes = workflow.nodes.filter(node => 
        !workflow.connections.some(conn => conn.target === node.id)
      );

      if (triggerNodes.length === 0) {
        throw new Error('No trigger nodes found');
      }

      // Execute each trigger node
      for (const triggerNode of triggerNodes) {
        await this.executeNodeChain(triggerNode, workflow, onStatusUpdate, onLogUpdate);
      }

      this.log('success', 'Workflow', 'Workflow execution completed successfully');
      
    } catch (error) {
      this.log('error', 'Workflow', `Workflow execution failed: ${error.message}`);
      throw error;
    } finally {
      this.isExecuting = false;
    }
  }

  async executeNodeChain(node, workflow, onStatusUpdate, onLogUpdate) {
    // Set node status to executing
    this.updateNodeStatus(node.id, 'executing', onStatusUpdate);
    this.log('info', node.data.label, 'Starting node execution');

    try {
      // Simulate node execution delay
      await this.delay(500 + Math.random() * 2000);

      // Execute the node
      const output = await this.executeNode(node, workflow);
      
      // Store node output
      this.nodeOutputs[node.id] = output;
      
      // Set node status to success
      this.updateNodeStatus(node.id, 'success', onStatusUpdate);
      this.log('success', node.data.label, `Node executed successfully. Output: ${this.formatOutput(output)}`);

      // Find and execute connected nodes
      const connectedNodes = this.getConnectedNodes(node.id, workflow);
      
      for (const connectedNode of connectedNodes) {
        await this.executeNodeChain(connectedNode, workflow, onStatusUpdate, onLogUpdate);
      }

    } catch (error) {
      this.updateNodeStatus(node.id, 'error', onStatusUpdate);
      this.log('error', node.data.label, `Node execution failed: ${error.message}`);
      throw error;
    }
  }

  async executeNode(node, workflow) {
    const definition = NODE_DEFINITIONS[node.type];
    if (!definition) {
      throw new Error(`Unknown node type: ${node.type}`);
    }

    // Get input data from connected nodes
    const inputData = this.getNodeInputData(node.id, workflow);

    // Simulate node-specific execution
    return await this.simulateNodeExecution(node, inputData);
  }

  async simulateNodeExecution(node, inputData) {
    const nodeType = node.type;
    const config = node.data.config || {};

    // Simulate different node types
    switch (nodeType) {
      case 'manual-trigger':
        return [{ trigger: 'manual', timestamp: new Date().toISOString() }];

      case 'webhook':
        return [{
          body: { message: 'Webhook received', data: 'sample data' },
          headers: { 'content-type': 'application/json' },
          method: config.httpMethod || 'POST',
          timestamp: new Date().toISOString()
        }];

      case 'schedule':
        return [{
          trigger: 'schedule',
          cron: config.cronExpression || '0 0 * * *',
          timestamp: new Date().toISOString()
        }];

      case 'http-request':
        return await this.simulateHttpRequest(config, inputData);

      case 'gmail':
        return await this.simulateGmailOperation(config, inputData);

      case 'slack':
        return await this.simulateSlackOperation(config, inputData);

      case 'set':
        return this.simulateSetOperation(config, inputData);

      case 'if':
        return this.simulateIfOperation(config, inputData);

      case 'code':
        return this.simulateCodeExecution(config, inputData);

      case 'google-sheets':
        return await this.simulateGoogleSheetsOperation(config, inputData);

      case 'mysql':
      case 'postgres':
      case 'mongodb':
        return await this.simulateDatabaseOperation(nodeType, config, inputData);

      case 'openai':
        return await this.simulateOpenAIOperation(config, inputData);

      default:
        // Generic simulation for any other node
        return this.simulateGenericNode(node, inputData);
    }
  }

  async simulateHttpRequest(config, inputData) {
    const url = config.url || 'https://api.example.com/data';
    const method = config.method || 'GET';
    
    // Simulate API response
    return [{
      statusCode: 200,
      body: {
        success: true,
        data: { message: `Simulated ${method} request to ${url}`, timestamp: new Date().toISOString() },
        requestData: inputData
      },
      headers: { 'content-type': 'application/json' }
    }];
  }

  async simulateGmailOperation(config, inputData) {
    const operation = config.operation || 'send';
    
    switch (operation) {
      case 'send':
        return [{
          messageId: `msg_${Date.now()}`,
          to: config.to || 'example@gmail.com',
          subject: config.subject || 'Test Email',
          status: 'sent',
          timestamp: new Date().toISOString()
        }];
      default:
        return [{ operation, status: 'completed', timestamp: new Date().toISOString() }];
    }
  }

  async simulateSlackOperation(config, inputData) {
    const operation = config.operation || 'postMessage';
    
    return [{
      channel: config.channel || '#general',
      text: config.text || 'Hello from n8n!',
      timestamp: new Date().toISOString(),
      messageId: `msg_${Date.now()}`,
      operation
    }];
  }

  simulateSetOperation(config, inputData) {
    const values = config.values || [];
    const result = {};
    
    values.forEach(({ key, value }) => {
      result[key] = this.processValue(value, inputData);
    });

    return inputData.map(item => ({
      ...(!config.keepOnlySet ? item : {}),
      ...result
    }));
  }

  simulateIfOperation(config, inputData) {
    const conditions = config.conditions || [];
    const combineOperation = config.combineOperation || 'AND';
    
    // Simulate condition evaluation (90% pass rate)
    const conditionResult = Math.random() > 0.1;
    
    return [{
      condition: conditionResult,
      combineOperation,
      evaluatedConditions: conditions.length,
      inputData: inputData.length,
      timestamp: new Date().toISOString()
    }];
  }

  simulateCodeExecution(config, inputData) {
    const jsCode = config.jsCode || 'return items;';
    
    // Simulate code execution
    return [{
      executedCode: jsCode.substring(0, 50) + '...',
      inputItems: inputData.length,
      outputItems: inputData.length,
      executionTime: Math.round(Math.random() * 100) + 'ms',
      timestamp: new Date().toISOString()
    }];
  }

  async simulateGoogleSheetsOperation(config, inputData) {
    const operation = config.operation || 'append';
    const sheetId = config.sheetId || 'sample_sheet_id';
    
    return [{
      operation,
      sheetId,
      range: config.range || 'A:Z',
      rowsAffected: inputData.length,
      timestamp: new Date().toISOString()
    }];
  }

  async simulateDatabaseOperation(nodeType, config, inputData) {
    const operation = config.operation || 'select';
    const query = config.query || 'SELECT * FROM table';
    
    return [{
      database: nodeType,
      operation,
      query: query.substring(0, 50) + '...',
      rowsAffected: Math.floor(Math.random() * 10) + 1,
      executionTime: Math.round(Math.random() * 200) + 'ms',
      timestamp: new Date().toISOString()
    }];
  }

  async simulateOpenAIOperation(config, inputData) {
    const model = config.model || 'gpt-3.5-turbo';
    const prompt = config.prompt || 'Hello, world!';
    
    return [{
      model,
      prompt: prompt.substring(0, 50) + '...',
      response: 'This is a simulated AI response based on your prompt.',
      tokensUsed: Math.floor(Math.random() * 500) + 100,
      timestamp: new Date().toISOString()
    }];
  }

  simulateGenericNode(node, inputData) {
    return [{
      nodeType: node.type,
      nodeName: node.data.label,
      inputItems: inputData.length,
      processing: 'completed',
      timestamp: new Date().toISOString()
    }];
  }

  getNodeInputData(nodeId, workflow) {
    // Find incoming connections
    const incomingConnections = workflow.connections.filter(conn => conn.target === nodeId);
    
    if (incomingConnections.length === 0) {
      // This is a trigger node, return empty input
      return [{}];
    }

    // Combine data from all incoming connections
    let combinedData = [];
    
    incomingConnections.forEach(conn => {
      const sourceOutput = this.nodeOutputs[conn.source] || [{}];
      combinedData = combinedData.concat(sourceOutput);
    });

    return combinedData.length > 0 ? combinedData : [{}];
  }

  getConnectedNodes(nodeId, workflow) {
    const connectedNodeIds = workflow.connections
      .filter(conn => conn.source === nodeId)
      .map(conn => conn.target);
    
    return workflow.nodes.filter(node => connectedNodeIds.includes(node.id));
  }

  updateNodeStatus(nodeId, status, onStatusUpdate) {
    this.nodeStatuses[nodeId] = status;
    if (onStatusUpdate) {
      onStatusUpdate(nodeId, status);
    }
  }

  log(type, source, message) {
    const logEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      source,
      message,
      timestamp: new Date().toISOString()
    };
    
    this.executionLogs.push(logEntry);
    return logEntry;
  }

  processValue(value, inputData) {
    // Simple expression processing
    if (typeof value === 'string' && value.includes('{{')) {
      // Simulate expression evaluation
      return value.replace(/\{\{.*?\}\}/g, 'processed_value');
    }
    return value;
  }

  formatOutput(output) {
    if (Array.isArray(output)) {
      return `${output.length} items`;
    }
    return JSON.stringify(output).substring(0, 100) + '...';
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  stopExecution() {
    this.isExecuting = false;
    this.log('warning', 'Workflow', 'Workflow execution stopped by user');
  }

  getExecutionSummary() {
    return {
      executionId: this.executionId,
      status: this.isExecuting ? 'running' : 'completed',
      nodeStatuses: { ...this.nodeStatuses },
      logs: [...this.executionLogs],
      startTime: this.executionLogs[0]?.timestamp,
      endTime: this.executionLogs[this.executionLogs.length - 1]?.timestamp
    };
  }
}