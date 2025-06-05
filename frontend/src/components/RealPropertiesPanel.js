// Real Properties Panel with Webhook URLs and Complete Configurations
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ALL_N8N_NODES } from '../CompleteN8NNodes';
import { 
  Settings, Trash2, Copy, Check, ExternalLink, 
  Eye, EyeOff, Info, AlertCircle 
} from 'lucide-react';

export function RealPropertiesPanel({ selectedNode, onUpdateNode, onDeleteNode }) {
  const [activeTab, setActiveTab] = useState('parameters');
  const [nodeConfig, setNodeConfig] = useState({});
  const [webhookUrl, setWebhookUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (selectedNode) {
      setNodeConfig(selectedNode.data.config || {});
      
      // Generate webhook URL for webhook nodes
      if (selectedNode.type === 'webhook') {
        const baseUrl = window.location.origin;
        const path = selectedNode.data.config.path || '/webhook';
        const url = `${baseUrl}/api/webhook/${selectedNode.id}${path}`;
        setWebhookUrl(url);
        
        // Update node with webhook URL
        onUpdateNode(selectedNode.id, {
          webhookUrl: url,
          data: {
            ...selectedNode.data,
            webhookUrl: url
          }
        });
      }
    }
  }, [selectedNode, onUpdateNode]);

  const handleConfigChange = (key, value) => {
    const newConfig = { ...nodeConfig, [key]: value };
    setNodeConfig(newConfig);
    onUpdateNode(selectedNode.id, {
      data: { ...selectedNode.data, config: newConfig }
    });

    // Update webhook URL if path changes
    if (selectedNode.type === 'webhook' && key === 'path') {
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/api/webhook/${selectedNode.id}${value || '/webhook'}`;
      setWebhookUrl(url);
      onUpdateNode(selectedNode.id, {
        webhookUrl: url,
        data: {
          ...selectedNode.data,
          config: newConfig,
          webhookUrl: url
        }
      });
    }
  };

  const handleNameChange = (newName) => {
    onUpdateNode(selectedNode.id, {
      data: { ...selectedNode.data, label: newName }
    });
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (!selectedNode) {
    return (
      <div className="w-96 bg-gray-900 border-l border-gray-700 p-6 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">Node Configuration</p>
          <p className="text-sm">Select a node to configure its properties</p>
        </div>
      </div>
    );
  }

  const definition = ALL_N8N_NODES[selectedNode.type];
  const properties = definition?.properties || {};

  const renderFormField = (key, property) => {
    const value = nodeConfig[key] !== undefined ? nodeConfig[key] : property.default;
    
    switch (property.type) {
      case 'string':
        return (
          <div>
            <input
              type="text"
              value={value || ''}
              onChange={(e) => handleConfigChange(key, e.target.value)}
              className="form-input"
              placeholder={property.placeholder || `Enter ${key}`}
              required={property.required}
            />
            {property.description && (
              <p className="text-gray-500 text-xs mt-1">{property.description}</p>
            )}
          </div>
        );
        
      case 'number':
        return (
          <div>
            <input
              type="number"
              value={value || ''}
              onChange={(e) => handleConfigChange(key, Number(e.target.value))}
              className="form-input"
              placeholder={property.placeholder || `Enter ${key}`}
              required={property.required}
              min={property.min}
              max={property.max}
              step={property.step || 1}
            />
            {property.description && (
              <p className="text-gray-500 text-xs mt-1">{property.description}</p>
            )}
          </div>
        );
        
      case 'text':
      case 'textarea':
        return (
          <div>
            <textarea
              value={value || ''}
              onChange={(e) => handleConfigChange(key, e.target.value)}
              className="form-textarea h-24"
              placeholder={property.placeholder || `Enter ${key}`}
              required={property.required}
            />
            {property.description && (
              <p className="text-gray-500 text-xs mt-1">{property.description}</p>
            )}
          </div>
        );
        
      case 'code':
        return (
          <div>
            <textarea
              value={value || ''}
              onChange={(e) => handleConfigChange(key, e.target.value)}
              className="form-textarea h-32 font-mono text-sm"
              placeholder={property.placeholder || `Enter ${key}`}
              required={property.required}
            />
            {property.description && (
              <p className="text-gray-500 text-xs mt-1">{property.description}</p>
            )}
          </div>
        );
        
      case 'select':
        return (
          <div>
            <select
              value={value || ''}
              onChange={(e) => handleConfigChange(key, e.target.value)}
              className="form-select"
              required={property.required}
            >
              <option value="">Select {key}</option>
              {property.options?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {property.description && (
              <p className="text-gray-500 text-xs mt-1">{property.description}</p>
            )}
          </div>
        );
        
      case 'boolean':
        return (
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={Boolean(value)}
                onChange={(e) => handleConfigChange(key, e.target.checked)}
                className="rounded border-gray-600 bg-gray-700 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-gray-300">
                {property.description || `Enable ${key}`}
              </span>
            </label>
          </div>
        );
        
      case 'json':
        return (
          <div>
            <textarea
              value={typeof value === 'object' ? JSON.stringify(value, null, 2) : value || ''}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  handleConfigChange(key, parsed);
                } catch {
                  handleConfigChange(key, e.target.value);
                }
              }}
              className="form-textarea h-24 font-mono text-sm"
              placeholder={property.placeholder || `Enter ${key} as JSON`}
              required={property.required}
            />
            {property.description && (
              <p className="text-gray-500 text-xs mt-1">{property.description}</p>
            )}
          </div>
        );
        
      case 'keyValue':
        const keyValuePairs = Array.isArray(value) ? value : [];
        return (
          <div>
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
                    className="text-red-400 hover:text-red-300 transition-colors px-2"
                  >
                    ×
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
            {property.description && (
              <p className="text-gray-500 text-xs mt-1">{property.description}</p>
            )}
          </div>
        );

      case 'object':
        const objectValue = value || {};
        return (
          <div>
            <div className="space-y-2">
              {property.properties && Object.entries(property.properties).map(([subKey, subProperty]) => (
                <div key={subKey}>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {subKey.charAt(0).toUpperCase() + subKey.slice(1).replace(/([A-Z])/g, ' $1')}
                  </label>
                  {renderFormField(`${key}.${subKey}`, subProperty)}
                </div>
              ))}
            </div>
            {property.description && (
              <p className="text-gray-500 text-xs mt-1">{property.description}</p>
            )}
          </div>
        );
        
      default:
        return (
          <div>
            <input
              type="text"
              value={value || ''}
              onChange={(e) => handleConfigChange(key, e.target.value)}
              className="form-input"
              placeholder={property.placeholder || `Enter ${key}`}
            />
            {property.description && (
              <p className="text-gray-500 text-xs mt-1">{property.description}</p>
            )}
          </div>
        );
    }
  };

  return (
    <div className="w-96 bg-gray-900 border-l border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Node Configuration</h3>
          <button
            onClick={() => onDeleteNode(selectedNode.id)}
            className="text-red-400 hover:text-red-300 transition-colors"
            title="Delete Node"
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

        {/* Webhook URL Display */}
        {selectedNode.type === 'webhook' && webhookUrl && (
          <div className="mb-4 p-3 bg-gray-800 border border-green-500/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-400 font-medium text-sm">Webhook URL</span>
              <button
                onClick={() => copyToClipboard(webhookUrl)}
                className="text-gray-400 hover:text-green-400 transition-colors"
                title="Copy webhook URL"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="bg-gray-900 p-2 rounded text-green-400 font-mono text-xs break-all border">
              {webhookUrl}
            </div>
            <p className="text-gray-500 text-xs mt-2">
              Use this URL to trigger the workflow from external systems
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
          {['parameters', 'settings', 'advanced'].map((tab) => (
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
              <div className="text-center py-8">
                <Info className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">This node has no configurable parameters.</p>
              </div>
            ) : (
              Object.entries(properties).map(([key, property]) => {
                // Skip object properties in main view, show in advanced
                if (property.type === 'object' && !showAdvanced) return null;
                
                return (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                      {property.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    {renderFormField(key, property)}
                  </div>
                );
              })
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
                Retry on Fail
              </label>
              <input
                type="number"
                className="form-input"
                placeholder="Number of retries"
                min="0"
                max="10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Wait Time (seconds)
              </label>
              <input
                type="number"
                className="form-input"
                placeholder="Wait time between retries"
                min="0"
              />
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

        {activeTab === 'advanced' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Node ID
              </label>
              <div className="bg-gray-800 p-2 rounded font-mono text-sm text-gray-400 border">
                {selectedNode.id}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Node Type
              </label>
              <div className="bg-gray-800 p-2 rounded font-mono text-sm text-gray-400 border">
                {selectedNode.type}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Position
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500">X</label>
                  <input
                    type="number"
                    value={selectedNode.position.x}
                    onChange={(e) => onUpdateNode(selectedNode.id, {
                      position: { ...selectedNode.position, x: Number(e.target.value) }
                    })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Y</label>
                  <input
                    type="number"
                    value={selectedNode.position.y}
                    onChange={(e) => onUpdateNode(selectedNode.id, {
                      position: { ...selectedNode.position, y: Number(e.target.value) }
                    })}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Show object properties here */}
            {Object.entries(properties).map(([key, property]) => {
              if (property.type !== 'object') return null;
              
              return (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  </label>
                  {renderFormField(key, property)}
                </div>
              );
            })}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Raw Configuration
              </label>
              <textarea
                value={JSON.stringify(nodeConfig, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setNodeConfig(parsed);
                    onUpdateNode(selectedNode.id, {
                      data: { ...selectedNode.data, config: parsed }
                    });
                  } catch (err) {
                    // Invalid JSON, don't update
                  }
                }}
                className="form-textarea h-32 font-mono text-xs"
                placeholder="Raw JSON configuration"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}