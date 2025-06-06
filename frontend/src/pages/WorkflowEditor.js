import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { 
  ExecutionLogs, 
  Header 
} from '../components.js';
import { EnhancedSidebar } from '../components/AdvancedComponents';
import { RealWorkflowCanvas } from '../components/RealWorkflowCanvas';
import { RealPropertiesPanel } from '../components/RealPropertiesPanel';
import { useEnhancedWorkflow } from '../EnhancedWorkflowContext';
import { useAuth } from '../AuthContext';
import { createCompleteNodeInstance } from '../CompleteN8NNodes';
import { 
  Play, 
  Pause, 
  Square, 
  Save, 
  Settings, 
  ArrowLeft,
  Download,
  Upload,
  Copy,
  Trash2,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Menu,
  X
} from 'lucide-react';

function WorkflowEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    workflows,
    currentWorkflow,
    setCurrentWorkflow,
    selectedNode,
    setSelectedNode,
    addNode,
    updateNode,
    deleteNode,
    addConnection,
    deleteConnection,
    executeWorkflow,
    stopExecution,
    isExecuting,
    executionStatus,
    executionLogs
  } = useEnhancedWorkflow();

  const [searchTerm, setSearchTerm] = useState('');
  const [isPropertiesPanelOpen, setIsPropertiesPanelOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [canvasZoom, setCanvasZoom] = useState(1);
  const [currentPage, setCurrentPage] = useState('editor');

  // Load workflow on mount
  useEffect(() => {
    if (id && workflows.length > 0) {
      const workflow = workflows.find(w => w.id === id);
      if (workflow) {
        setCurrentWorkflow(workflow);
      }
    } else if (!id && !currentWorkflow) {
      // Create a new workflow if no ID is provided
      const newWorkflow = {
        id: uuidv4(),
        name: 'New Workflow',
        description: 'Untitled workflow',
        nodes: [],
        connections: [],
        isActive: false,
        lastRun: null,
        executions: 0
      };
      setCurrentWorkflow(newWorkflow);
    }
  }, [id, workflows, currentWorkflow, setCurrentWorkflow]);

  const handleNavigate = (page) => {
    switch(page) {
      case 'home':
        navigate('/');
        break;
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'login':
        navigate('/login');
        break;
      default:
        navigate('/');
    }
  };

  const handleAddNode = (nodeInstance) => {
    // Create proper node instance using the complete definitions
    const completeInstance = createCompleteNodeInstance(nodeInstance.type, {
      x: 200 + Math.random() * 300,
      y: 150 + Math.random() * 200
    });
    addNode(completeInstance);
  };

  const handleNodeSelect = (nodeId) => {
    setSelectedNode(nodeId);
  };

  const handleNodeUpdate = (nodeId, updates) => {
    updateNode(nodeId, updates);
  };

  const handleNodeDelete = (nodeId) => {
    deleteNode(nodeId);
  };

  const handleAddConnection = (connection) => {
    addConnection(connection);
  };

  const handleExecuteWorkflow = async () => {
    if (!currentWorkflow || isExecuting) return;
    await executeWorkflow();
  };

  const handleStopExecution = () => {
    stopExecution();
  };

  const handleSaveWorkflow = () => {
    // In a real app, this would save to the backend
    console.log('Saving workflow:', currentWorkflow);
    // Show success message
  };

  const handleDuplicateWorkflow = () => {
    if (!currentWorkflow) return;
    
    const duplicatedWorkflow = {
      ...currentWorkflow,
      id: uuidv4(),
      name: `${currentWorkflow.name} (Copy)`,
      nodes: currentWorkflow.nodes.map(node => ({
        ...node,
        id: uuidv4(),
        position: { x: node.position.x + 50, y: node.position.y + 50 }
      })),
      connections: []
    };
    
    setCurrentWorkflow(duplicatedWorkflow);
    navigate(`/workflow/${duplicatedWorkflow.id}`);
  };

  const selectedNodeData = selectedNode 
    ? currentWorkflow?.nodes.find(n => n.id === selectedNode)
    : null;

  return (
    <div className={`h-screen bg-gray-900 flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {!isFullscreen && (
        <Header currentPage={currentPage} onNavigate={handleNavigate} user={user} />
      )}
      
      {/* Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="w-px h-6 bg-gray-600" />
          
          <div>
            <h1 className="text-lg font-semibold text-white">
              {currentWorkflow?.name || 'New Workflow'}
            </h1>
            <p className="text-sm text-gray-400">
              {currentWorkflow?.description || 'Untitled workflow'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Execution Controls */}
          <div className="flex items-center space-x-2 border-r border-gray-600 pr-3">
            <motion.button
              onClick={handleExecuteWorkflow}
              disabled={isExecuting || !currentWorkflow?.nodes.length}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                isExecuting || !currentWorkflow?.nodes.length
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
              whileHover={!isExecuting && currentWorkflow?.nodes.length ? { scale: 1.02 } : {}}
              whileTap={!isExecuting && currentWorkflow?.nodes.length ? { scale: 0.98 } : {}}
            >
              {isExecuting ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  <span>Executing...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Execute</span>
                </>
              )}
            </motion.button>

            {isExecuting && (
              <button
                onClick={handleStopExecution}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors"
              >
                <Square className="w-4 h-4" />
                <span>Stop</span>
              </button>
            )}
          </div>

          {/* Workflow Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSaveWorkflow}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
              title="Save Workflow"
            >
              <Save className="w-4 h-4" />
            </button>

            <button
              onClick={handleDuplicateWorkflow}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
              title="Duplicate Workflow"
            >
              <Copy className="w-4 h-4" />
            </button>

            <div className="relative group">
              <button className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors">
                <Settings className="w-4 h-4" />
              </button>
              
              {/* Dropdown menu */}
              <div className="absolute right-0 top-full mt-1 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 transition-colors flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Export Workflow</span>
                </button>
                <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 transition-colors flex items-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>Import Workflow</span>
                </button>
                <hr className="border-gray-700" />
                <button className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 transition-colors flex items-center space-x-2">
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Workflow</span>
                </button>
              </div>
            </div>
          </div>

          {/* Properties Panel Toggle */}
          <button
            onClick={() => setIsPropertiesPanelOpen(!isPropertiesPanelOpen)}
            className={`px-3 py-2 rounded-md transition-colors ${
              isPropertiesPanelOpen 
                ? 'bg-orange-600 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
            title="Toggle Properties Panel"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Enhanced Sidebar */}
        <EnhancedSidebar
          onAddNode={handleAddNode}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Real Canvas with Working Connections */}
        <RealWorkflowCanvas
          workflow={currentWorkflow}
          selectedNode={selectedNode}
          onSelectNode={handleNodeSelect}
          onUpdateNode={handleNodeUpdate}
          onDeleteNode={handleNodeDelete}
          onAddConnection={handleAddConnection}
          onDeleteConnection={deleteConnection}
          executionStatus={executionStatus}
          canvasZoom={canvasZoom}
          setCanvasZoom={setCanvasZoom}
        />

        {/* Real Properties Panel with Webhook URLs */}
        {isPropertiesPanelOpen && (
          <motion.div
            initial={{ x: 384 }}
            animate={{ x: 0 }}
            exit={{ x: 384 }}
            transition={{ duration: 0.3 }}
          >
            <RealPropertiesPanel
              selectedNode={selectedNodeData}
              onUpdateNode={handleNodeUpdate}
              onDeleteNode={handleNodeDelete}
            />
          </motion.div>
        )}
      </div>

      {/* Execution Logs */}
      <ExecutionLogs
        logs={executionLogs}
        isExecuting={isExecuting}
      />
    </div>
  );
}

export default WorkflowEditor;