import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  NODE_DEFINITIONS, 
  NODE_CATEGORIES, 
  getAllTriggerNodes, 
  getAllRegularNodes,
  createNodeInstance 
} from '../NodeDefinitions';
import { WorkflowEngine } from '../WorkflowEngine';
import { 
  Play, 
  Pause, 
  Square, 
  Plus, 
  Settings, 
  Download, 
  Upload, 
  Trash2, 
  Copy,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Zap,
  Mail,
  Database,
  Cloud,
  Code,
  GitBranch,
  Calendar,
  Webhook,
  X,
  Check,
  Clock,
  AlertCircle,
  Info,
  Move,
  MousePointer2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2
} from 'lucide-react';

// Enhanced Node Library Sidebar
export function EnhancedSidebar({ onAddNode, searchTerm, setSearchTerm, isCollapsed, onToggleCollapse }) {
  const [expandedCategories, setExpandedCategories] = useState([
    NODE_CATEGORIES.TRIGGERS,
    NODE_CATEGORIES.CORE,
    NODE_CATEGORIES.COMMUNICATION
  ]);

  const toggleCategory = (category) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const categorizedNodes = Object.entries(NODE_DEFINITIONS).reduce((acc, [nodeType, definition]) => {
    if (!acc[definition.category]) {
      acc[definition.category] = [];
    }
    acc[definition.category].push({ type: nodeType, ...definition });
    return acc;
  }, {});

  const filteredCategories = Object.entries(categorizedNodes).reduce((acc, [category, nodes]) => {
    const filteredNodes = nodes.filter(node =>
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filteredNodes.length > 0) {
      acc[category] = filteredNodes;
    }
    return acc;
  }, {});

  const handleNodeClick = (node) => {
    const nodeInstance = createNodeInstance(node.type);
    onAddNode(nodeInstance);
  };

  return (
    <motion.div
      className={`bg-gray-900 border-r border-gray-700 flex flex-col h-full transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-80'
      }`}
      initial={false}
      animate={{ width: isCollapsed ? 64 : 320 }}
    >
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold text-white transition-opacity ${
            isCollapsed ? 'opacity-0' : 'opacity-100'
          }`}>
            Nodes
          </h3>
          <button
            onClick={onToggleCollapse}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
        
        {!isCollapsed && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {Object.entries(filteredCategories).map(([category, nodes]) => (
          <div key={category} className="border-b border-gray-700">
            <button
              onClick={() => !isCollapsed && toggleCategory(category)}
              className="w-full px-4 py-3 flex items-center justify-between text-gray-300 hover:bg-gray-800 transition-colors"
            >
              <span className={`font-medium ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                {category}
              </span>
              {!isCollapsed && (
                expandedCategories.includes(category) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )
              )}
            </button>
            
            <AnimatePresence>
              {(!isCollapsed && expandedCategories.includes(category)) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  {nodes.map((node) => (
                    <motion.div
                      key={node.type}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-800 transition-colors border-l-4 border-transparent hover:border-orange-500"
                      onClick={() => handleNodeClick(node)}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.1 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-md flex items-center justify-center text-white text-sm"
                          style={{ backgroundColor: node.color }}
                        >
                          {node.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-gray-300 font-medium truncate">{node.name}</div>
                          <div className="text-gray-500 text-xs truncate">{node.description}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Enhanced Workflow Canvas with Real Drag & Drop
export function EnhancedWorkflowCanvas({ 
  workflow, 
  selectedNode, 
  onSelectNode, 
  onUpdateNode, 
  onDeleteNode,
  onAddConnection, 
  onDeleteConnection,
  executionStatus,
  canvasZoom,
  setCanvasZoom 
}) {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragNode, setDragNode] = useState(null);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [connectionStart, setConnectionStart] = useState(null);
  const [tempConnection, setTempConnection] = useState(null);

  const handleNodeDrag = useCallback((nodeId, delta) => {
    if (!isDragging) return;
    
    const node = workflow?.nodes.find(n => n.id === nodeId);
    if (node) {
      onUpdateNode(nodeId, {
        position: {
          x: node.position.x + delta.x,
          y: node.position.y + delta.y
        }
      });
    }
  }, [workflow, onUpdateNode, isDragging]);

  const handleMouseDown = (e, nodeId) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragNode(nodeId);
    onSelectNode(nodeId);
  };

  const handleCanvasMouseDown = (e) => {
    if (e.target === canvasRef.current) {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      onSelectNode(null);
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      setPanOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragNode(null);
    setIsPanning(false);
    setConnectionStart(null);
    setTempConnection(null);
  };

  const handleConnectionStart = (nodeId, outputIndex = 0) => {
    setConnectionStart({ nodeId, outputIndex });
  };

  const handleConnectionEnd = (nodeId, inputIndex = 0) => {
    if (connectionStart && connectionStart.nodeId !== nodeId) {
      onAddConnection({
        id: `conn_${Date.now()}`,
        source: connectionStart.nodeId,
        target: nodeId,
        sourceOutput: connectionStart.outputIndex,
        targetInput: inputIndex
      });
    }
    setConnectionStart(null);
    setTempConnection(null);
  };

  const getNodeIcon = (nodeType) => {
    const definition = NODE_DEFINITIONS[nodeType];
    return definition?.icon || '⚡';
  };

  const getNodeColor = (nodeType) => {
    const definition = NODE_DEFINITIONS[nodeType];
    return definition?.color || '#666666';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'executing':
        return <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />;
      case 'success':
        return <Check className="w-3 h-3 text-green-400" />;
      case 'error':
        return <X className="w-3 h-3 text-red-400" />;
      default:
        return null;
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setCanvasZoom(prev => Math.max(0.2, Math.min(3, prev * delta)));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousedown', handleCanvasMouseDown);
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('wheel', handleWheel, { passive: false });

      return () => {
        canvas.removeEventListener('mousedown', handleCanvasMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('wheel', handleWheel);
      };
    }
  }, [isPanning, lastPanPoint]);

  if (!workflow) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-800">
        <div className="text-center text-gray-400">
          <div className="w-16 h-16 mx-auto mb-4 opacity-50 text-4xl">⚡</div>
          <p className="text-xl mb-2">No workflow selected</p>
          <p>Create a new workflow or select an existing one to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex-1 relative overflow-hidden bg-gray-800 workflow-canvas cursor-move"
      ref={canvasRef}
      style={{
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: `${20 * canvasZoom}px ${20 * canvasZoom}px`,
        backgroundPosition: `${panOffset.x}px ${panOffset.y}px`
      }}
    >
      {/* SVG for connections */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        style={{ transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${canvasZoom})` }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto"
            fill="#6B7280"
          >
            <polygon points="0 0, 10 3.5, 0 7" />
          </marker>
        </defs>
        
        {workflow.connections.map((connection) => {
          const sourceNode = workflow.nodes.find(n => n.id === connection.source);
          const targetNode = workflow.nodes.find(n => n.id === connection.target);
          
          if (!sourceNode || !targetNode) return null;

          const sourceX = sourceNode.position.x + 200; // Node width
          const sourceY = sourceNode.position.y + 40;  // Node height / 2
          const targetX = targetNode.position.x;
          const targetY = targetNode.position.y + 40;

          const isExecuting = executionStatus[sourceNode.id] === 'executing';
          const isSuccess = executionStatus[sourceNode.id] === 'success';

          return (
            <path
              key={connection.id}
              d={`M ${sourceX} ${sourceY} C ${sourceX + 100} ${sourceY} ${targetX - 100} ${targetY} ${targetX} ${targetY}`}
              stroke={isExecuting ? '#3B82F6' : isSuccess ? '#10B981' : '#6B7280'}
              strokeWidth={isExecuting ? 3 : 2}
              fill="none"
              markerEnd="url(#arrowhead)"
              strokeDasharray={isExecuting ? "5,5" : "none"}
              className={isExecuting ? 'animate-pulse' : ''}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      <div 
        className="absolute inset-0"
        style={{ 
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${canvasZoom})`,
          transformOrigin: '0 0'
        }}
      >
        {workflow.nodes.map((node) => {
          const nodeStatus = executionStatus[node.id];
          const definition = NODE_DEFINITIONS[node.type];
          
          return (
            <motion.div
              key={node.id}
              className={`absolute w-48 bg-gray-700 border-2 rounded-lg p-3 cursor-pointer select-none ${
                selectedNode === node.id ? 'border-orange-500 shadow-lg shadow-orange-500/20' : 'border-gray-600'
              } ${nodeStatus === 'executing' ? 'animate-pulse' : ''}`}
              style={{ 
                left: node.position.x, 
                top: node.position.y,
                borderColor: nodeStatus === 'success' ? '#10B981' : 
                           nodeStatus === 'error' ? '#EF4444' : 
                           selectedNode === node.id ? '#FF7F4D' : '#4B5563'
              }}
              onMouseDown={(e) => handleMouseDown(e, node.id)}
              whileHover={{ scale: 1.02 }}
              drag
              onDrag={(e, info) => handleNodeDrag(node.id, info.delta)}
              dragMomentum={false}
            >
              {/* Node Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <div 
                    className="w-8 h-8 rounded-md flex items-center justify-center text-white text-sm flex-shrink-0"
                    style={{ backgroundColor: definition?.color }}
                  >
                    {getNodeIcon(node.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-white font-medium text-sm truncate">{node.data.label}</h4>
                    <p className="text-gray-400 text-xs truncate">{definition?.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 flex-shrink-0">
                  {getStatusIcon(nodeStatus)}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNode(node.id);
                    }}
                    className="text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Input/Output Connectors */}
              {definition?.inputs > 0 && (
                <div className="absolute -left-3 top-1/2 transform -translate-y-1/2">
                  <div 
                    className="w-6 h-6 bg-gray-600 border-2 border-gray-400 rounded-full cursor-pointer hover:bg-gray-500 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConnectionEnd(node.id);
                    }}
                  />
                </div>
              )}

              {definition?.outputs > 0 && (
                <div className="absolute -right-3 top-1/2 transform -translate-y-1/2">
                  <div 
                    className="w-6 h-6 bg-gray-600 border-2 border-gray-400 rounded-full cursor-pointer hover:bg-gray-500 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConnectionStart(node.id);
                    }}
                  />
                </div>
              )}

              {/* Node content preview */}
              {Object.keys(node.data.config || {}).length > 0 && (
                <div className="mt-2 text-xs text-gray-400 border-t border-gray-600 pt-2">
                  {Object.entries(node.data.config).slice(0, 2).map(([key, value]) => (
                    <div key={key} className="truncate">
                      <span className="text-gray-500">{key}:</span> {String(value).substring(0, 20)}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Canvas Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-20">
        <motion.button
          onClick={() => setCanvasZoom(prev => Math.min(prev * 1.2, 3))}
          className="w-10 h-10 bg-gray-800 border border-gray-600 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ZoomIn className="w-4 h-4" />
        </motion.button>
        
        <motion.button
          onClick={() => setCanvasZoom(prev => Math.max(prev / 1.2, 0.2))}
          className="w-10 h-10 bg-gray-800 border border-gray-600 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ZoomOut className="w-4 h-4" />
        </motion.button>
        
        <motion.button
          onClick={() => {
            setCanvasZoom(1);
            setPanOffset({ x: 0, y: 0 });
          }}
          className="w-10 h-10 bg-gray-800 border border-gray-600 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 bg-gray-800 border border-gray-600 rounded-lg px-3 py-1 text-sm text-gray-300">
        {Math.round(canvasZoom * 100)}%
      </div>
    </div>
  );
}

// Enhanced Properties Panel with Real Form Fields
export function EnhancedPropertiesPanel({ selectedNode, onUpdateNode, onDeleteNode }) {
  const [activeTab, setActiveTab] = useState('parameters');
  const [nodeConfig, setNodeConfig] = useState({});

  useEffect(() => {
    if (selectedNode) {
      setNodeConfig(selectedNode.data.config || {});
    }
  }, [selectedNode]);

  const handleConfigChange = (key, value) => {
    const newConfig = { ...nodeConfig, [key]: value };
    setNodeConfig(newConfig);
    onUpdateNode(selectedNode.id, {
      data: { ...selectedNode.data, config: newConfig }
    });
  };

  const handleNameChange = (newName) => {
    onUpdateNode(selectedNode.id, {
      data: { ...selectedNode.data, label: newName }
    });
  };

  if (!selectedNode) {
    return (
      <div className="w-96 bg-gray-900 border-l border-gray-700 p-6 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select a node to configure its properties</p>
        </div>
      </div>
    );
  }

  const definition = NODE_DEFINITIONS[selectedNode.type];
  const properties = definition?.properties || {};

  const renderFormField = (key, property) => {
    const value = nodeConfig[key] || property.default || '';
    
    switch (property.type) {
      case 'string':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleConfigChange(key, e.target.value)}
            className="form-input"
            placeholder={`Enter ${key}`}
            required={property.required}
          />
        );
        
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleConfigChange(key, Number(e.target.value))}
            className="form-input"
            placeholder={`Enter ${key}`}
            required={property.required}
          />
        );
        
      case 'text':
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleConfigChange(key, e.target.value)}
            className="form-textarea h-24"
            placeholder={`Enter ${key}`}
            required={property.required}
          />
        );
        
      case 'code':
        return (
          <textarea
            value={value}
            onChange={(e) => handleConfigChange(key, e.target.value)}
            className="form-textarea h-32 font-mono text-sm"
            placeholder={`Enter ${key}`}
            required={property.required}
          />
        );
        
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleConfigChange(key, e.target.value)}
            className="form-select"
            required={property.required}
          >
            <option value="">Select {key}</option>
            {property.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
        
      case 'boolean':
        return (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => handleConfigChange(key, e.target.checked)}
              className="rounded border-gray-600 bg-gray-700 text-orange-500 focus:ring-orange-500"
            />
            <span className="text-gray-300">Enable {key}</span>
          </label>
        );
        
      case 'json':
        return (
          <textarea
            value={typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleConfigChange(key, parsed);
              } catch {
                handleConfigChange(key, e.target.value);
              }
            }}
            className="form-textarea h-24 font-mono text-sm"
            placeholder={`Enter ${key} as JSON`}
            required={property.required}
          />
        );
        
      case 'keyValue':
        const keyValuePairs = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            {keyValuePairs.map((pair, index) => (
              <div key={index} className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Key"
                  value={pair.key || ''}
                  onChange={(e) => {
                    const newPairs = [...keyValuePairs];
                    newPairs[index] = { ...pair, key: e.target.value };
                    handleConfigChange(key, newPairs);
                  }}
                  className="form-input flex-1"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={pair.value || ''}
                  onChange={(e) => {
                    const newPairs = [...keyValuePairs];
                    newPairs[index] = { ...pair, value: e.target.value };
                    handleConfigChange(key, newPairs);
                  }}
                  className="form-input flex-1"
                />
                <button
                  onClick={() => {
                    const newPairs = keyValuePairs.filter((_, i) => i !== index);
                    handleConfigChange(key, newPairs);
                  }}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                handleConfigChange(key, [...keyValuePairs, { key: '', value: '' }]);
              }}
              className="text-orange-400 hover:text-orange-300 transition-colors text-sm"
            >
              + Add {key}
            </button>
          </div>
        );
        
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleConfigChange(key, e.target.value)}
            className="form-input"
            placeholder={`Enter ${key}`}
          />
        );
    }
  };

  return (
    <div className="w-96 bg-gray-900 border-l border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Node Settings</h3>
          <button
            onClick={() => onDeleteNode(selectedNode.id)}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        
        {/* Node Info */}
        <div className="flex items-center space-x-3 mb-4">
          <div 
            className="w-10 h-10 rounded-md flex items-center justify-center text-white"
            style={{ backgroundColor: definition?.color }}
          >
            {definition?.icon}
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={selectedNode.data.label}
              onChange={(e) => handleNameChange(e.target.value)}
              className="form-input font-medium"
              placeholder="Node name"
            />
            <p className="text-gray-400 text-sm mt-1">{definition?.description}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
          {['parameters', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'parameters' && (
          <div className="space-y-4">
            {Object.keys(properties).length === 0 ? (
              <p className="text-gray-400 text-sm">This node has no configurable parameters.</p>
            ) : (
              Object.entries(properties).map(([key, property]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    {property.required && <span className="text-red-400 ml-1">*</span>}
                  </label>
                  {renderFormField(key, property)}
                  {property.description && (
                    <p className="text-gray-500 text-xs mt-1">{property.description}</p>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Execute Once
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-600 bg-gray-700 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-gray-300">Execute this node only once</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Continue on Fail
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-600 bg-gray-700 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-gray-300">Continue workflow even if this node fails</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                className="form-textarea h-24"
                placeholder="Add notes about this node..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}