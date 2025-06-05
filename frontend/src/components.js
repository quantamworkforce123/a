import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Eye,
  EyeOff,
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
  Lock,
  User,
  Home,
  BarChart3,
  FileText,
  LogOut,
  X,
  Check,
  Clock,
  AlertCircle,
  Info
} from 'lucide-react';

// Header Component
export function Header({ currentPage, onNavigate, user = null }) {
  return (
    <header className="bg-gray-900 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Quantamworkforce</span>
          </div>
          
          <nav className="flex space-x-6">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'dashboard', label: 'Workflows', icon: BarChart3 },
              { id: 'templates', label: 'Templates', icon: FileText }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  currentPage === id
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-300" />
              </div>
              <span className="text-gray-300">{user.name}</span>
              <button className="text-gray-400 hover:text-white transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onNavigate('login')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

// Sidebar Component for Workflow Editor
export function Sidebar({ nodes, onAddNode, searchTerm, setSearchTerm }) {
  const [expandedCategories, setExpandedCategories] = useState(['triggers', 'actions']);

  const toggleCategory = (category) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const nodeCategories = {
    triggers: {
      label: 'Triggers',
      nodes: [
        { type: 'webhook', label: 'Webhook', icon: Zap, color: 'bg-blue-500' },
        { type: 'schedule', label: 'Schedule', icon: Calendar, color: 'bg-green-500' },
        { type: 'email-trigger', label: 'Email Trigger', icon: Mail, color: 'bg-purple-500' },
        { type: 'manual', label: 'Manual Trigger', icon: Play, color: 'bg-gray-500' }
      ]
    },
    actions: {
      label: 'Regular Nodes',
      nodes: [
        { type: 'email', label: 'Email', icon: Mail, color: 'bg-red-500' },
        { type: 'database', label: 'Database', icon: Database, color: 'bg-blue-600' },
        { type: 'http', label: 'HTTP Request', icon: Zap, color: 'bg-green-600' },
        { type: 'cloud-storage', label: 'Cloud Storage', icon: Cloud, color: 'bg-purple-600' },
        { type: 'code', label: 'Code', icon: Code, color: 'bg-yellow-600' },
        { type: 'if', label: 'IF Condition', icon: GitBranch, color: 'bg-orange-600' }
      ]
    }
  };

  const filteredCategories = Object.entries(nodeCategories).reduce((acc, [key, category]) => {
    const filteredNodes = category.nodes.filter(node =>
      node.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filteredNodes.length > 0) {
      acc[key] = { ...category, nodes: filteredNodes };
    }
    return acc;
  }, {});

  return (
    <div className="w-80 bg-gray-900 border-r border-gray-700 flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Nodes</h3>
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
      </div>

      <div className="flex-1 overflow-y-auto">
        {Object.entries(filteredCategories).map(([categoryKey, category]) => (
          <div key={categoryKey} className="border-b border-gray-700">
            <button
              onClick={() => toggleCategory(categoryKey)}
              className="w-full px-4 py-3 flex items-center justify-between text-gray-300 hover:bg-gray-800 transition-colors"
            >
              <span className="font-medium">{category.label}</span>
              {expandedCategories.includes(categoryKey) ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            
            <AnimatePresence>
              {expandedCategories.includes(categoryKey) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  {category.nodes.map((node) => (
                    <motion.div
                      key={node.type}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-800 transition-colors border-l-4 border-transparent hover:border-orange-500"
                      onClick={() => onAddNode(node)}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.1 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 ${node.color} rounded-md flex items-center justify-center`}>
                          <node.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-300">{node.label}</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

// Properties Panel Component
export function PropertiesPanel({ selectedNode, onUpdateNode, onDeleteNode }) {
  const [config, setConfig] = useState(selectedNode?.data?.config || {});

  const handleConfigChange = (key, value) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onUpdateNode(selectedNode.id, {
      data: { ...selectedNode.data, config: newConfig }
    });
  };

  if (!selectedNode) {
    return (
      <div className="w-80 bg-gray-900 border-l border-gray-700 p-6 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select a node to configure its properties</p>
        </div>
      </div>
    );
  }

  const renderConfigField = (key, value, type = 'text') => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handleConfigChange(key, e.target.value)}
            className="form-textarea h-24"
            placeholder={`Enter ${key}`}
          />
        );
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleConfigChange(key, e.target.value)}
            className="form-select"
          >
            <option value="">Select an option</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </select>
        );
      default:
        return (
          <input
            type={type}
            value={value || ''}
            onChange={(e) => handleConfigChange(key, e.target.value)}
            className="form-input"
            placeholder={`Enter ${key}`}
          />
        );
    }
  };

  const getConfigFields = (nodeType) => {
    const baseFields = {
      webhook: { url: 'text', method: 'select' },
      schedule: { cron: 'text', timezone: 'select' },
      email: { to: 'text', subject: 'text', body: 'textarea' },
      database: { query: 'textarea', connection: 'select' },
      http: { url: 'text', method: 'select', headers: 'textarea' },
      'cloud-storage': { bucket: 'text', path: 'text', region: 'select' },
      code: { code: 'textarea', language: 'select' },
      if: { condition: 'textarea', operator: 'select' }
    };
    return baseFields[nodeType] || {};
  };

  const configFields = getConfigFields(selectedNode.type);

  return (
    <div className="w-80 bg-gray-900 border-l border-gray-700 flex flex-col h-full">
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
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
            <input
              type="text"
              value={selectedNode.data.label}
              onChange={(e) => onUpdateNode(selectedNode.id, {
                data: { ...selectedNode.data, label: e.target.value }
              })}
              className="form-input"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {Object.entries(configFields).map(([key, type]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-300 mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              {renderConfigField(key, config[key], type)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Workflow Canvas Component
export function WorkflowCanvas({ 
  workflow, 
  selectedNode, 
  onSelectNode, 
  onUpdateNode, 
  onAddConnection, 
  onDeleteConnection,
  executionStatus 
}) {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragNode, setDragNode] = useState(null);
  const [connections, setConnections] = useState(workflow?.connections || []);

  const handleNodeClick = (node) => {
    onSelectNode(node.id === selectedNode ? null : node.id);
  };

  const handleNodeDrag = (nodeId, position) => {
    onUpdateNode(nodeId, { position });
  };

  const getNodeIcon = (type) => {
    const icons = {
      webhook: Zap,
      schedule: Calendar,
      email: Mail,
      database: Database,
      http: Zap,
      'cloud-storage': Cloud,
      code: Code,
      if: GitBranch,
      manual: Play
    };
    return icons[type] || Zap;
  };

  const getNodeColor = (type) => {
    const colors = {
      webhook: 'bg-blue-500',
      schedule: 'bg-green-500',
      email: 'bg-red-500',
      database: 'bg-blue-600',
      http: 'bg-green-600',
      'cloud-storage': 'bg-purple-600',
      code: 'bg-yellow-600',
      if: 'bg-orange-600',
      manual: 'bg-gray-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'executing':
        return <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />;
      case 'success':
        return <Check className="w-3 h-3 text-green-400" />;
      case 'error':
        return <X className="w-3 h-3 text-red-400" />;
      default:
        return null;
    }
  };

  if (!workflow) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-800">
        <div className="text-center text-gray-400">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl mb-2">No workflow selected</p>
          <p>Create a new workflow or select an existing one to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative overflow-hidden bg-gray-800 workflow-canvas" ref={canvasRef}>
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {workflow.connections.map((connection) => {
          const sourceNode = workflow.nodes.find(n => n.id === connection.source);
          const targetNode = workflow.nodes.find(n => n.id === connection.target);
          
          if (!sourceNode || !targetNode) return null;

          const sourceX = sourceNode.position.x + 100; // Node width / 2
          const sourceY = sourceNode.position.y + 40; // Node height / 2
          const targetX = targetNode.position.x;
          const targetY = targetNode.position.y + 40;

          const isExecuting = executionStatus[sourceNode.id] === 'executing';

          return (
            <path
              key={connection.id}
              d={`M ${sourceX} ${sourceY} Q ${sourceX + 50} ${sourceY} ${targetX} ${targetY}`}
              className={`workflow-connection ${isExecuting ? 'executing' : ''}`}
              strokeDasharray={isExecuting ? "5,5" : "none"}
            />
          );
        })}
      </svg>

      {workflow.nodes.map((node) => {
        const Icon = getNodeIcon(node.type);
        const nodeStatus = executionStatus[node.id];
        
        return (
          <motion.div
            key={node.id}
            className={`workflow-node absolute w-48 bg-gray-700 border border-gray-600 rounded-lg p-3 cursor-pointer ${
              selectedNode === node.id ? 'selected' : ''
            } ${nodeStatus ? nodeStatus : ''}`}
            style={{ 
              left: node.position.x, 
              top: node.position.y,
              zIndex: selectedNode === node.id ? 10 : 1
            }}
            onClick={() => handleNodeClick(node)}
            drag
            onDrag={(event, info) => {
              handleNodeDrag(node.id, {
                x: node.position.x + info.delta.x,
                y: node.position.y + info.delta.y
              });
            }}
            whileHover={{ scale: 1.02 }}
            whileDrag={{ scale: 1.05 }}
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className={`w-8 h-8 ${getNodeColor(node.type)} rounded-md flex items-center justify-center`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium text-sm truncate">{node.data.label}</h4>
                <p className="text-gray-400 text-xs capitalize">{node.type}</p>
              </div>
              <div className="flex items-center justify-center w-5 h-5">
                {getStatusIcon(nodeStatus)}
              </div>
            </div>
            
            {/* Connection points */}
            <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gray-600 border-2 border-gray-400 rounded-full" />
            <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gray-600 border-2 border-gray-400 rounded-full" />
          </motion.div>
        );
      })}
    </div>
  );
}

// Execution Logs Component
export function ExecutionLogs({ logs, isExecuting }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getLogIcon = (type) => {
    switch (type) {
      case 'success':
        return <Check className="w-4 h-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="bg-gray-900 border-t border-gray-700">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-gray-300 hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <span className="font-medium">Execution Logs</span>
          {isExecuting && <div className="loading-dots text-orange-400">Executing</div>}
        </div>
        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 200, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-gray-700"
          >
            <div className="h-48 overflow-y-auto p-4 space-y-2">
              {logs.length === 0 ? (
                <p className="text-gray-400 text-sm">No execution logs yet</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="flex items-start space-x-2 text-sm">
                    {getLogIcon(log.type)}
                    <div className="flex-1">
                      <span className="text-gray-300">{log.message}</span>
                      <span className="text-gray-500 ml-2">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Workflow Card Component
export function WorkflowCard({ workflow, onSelect, onDelete, onToggleActive }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors cursor-pointer relative"
      onClick={() => onSelect(workflow)}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">{workflow.name}</h3>
          <p className="text-gray-400 text-sm mb-4">{workflow.description}</p>
        </div>
        
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-6 bg-gray-700 border border-gray-600 rounded-md shadow-lg z-10 min-w-32">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleActive(workflow.id);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-600 transition-colors"
              >
                {workflow.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(workflow.id);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-600 transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>{workflow.nodes.length} nodes</span>
          <span>{workflow.executions} executions</span>
          {workflow.lastRun && (
            <span>Last run: {new Date(workflow.lastRun).toLocaleDateString()}</span>
          )}
        </div>
        
        <div className={`px-2 py-1 rounded-full text-xs ${
          workflow.isActive ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-400'
        }`}>
          {workflow.isActive ? 'Active' : 'Inactive'}
        </div>
      </div>
    </motion.div>
  );
}

// Create Workflow Modal
export function CreateWorkflowModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate({ name: name.trim(), description: description.trim() });
      setName('');
      setDescription('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-md mx-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Create New Workflow</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Workflow Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              placeholder="Enter workflow name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea h-24"
              placeholder="Enter workflow description"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
            >
              Create Workflow
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}