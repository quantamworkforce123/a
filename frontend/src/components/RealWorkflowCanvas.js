// Enhanced Canvas with Real Connection System - Onion Pink/Blue Theme
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { COMPLETE_2000_N8N_NODES } from '../Complete2000N8NNodes';
import { ADDITIONAL_1500_NODES } from '../Additional1500N8NNodes';
import { 
  X, Check, AlertCircle, ZoomIn, ZoomOut, RotateCcw, Move
} from 'lucide-react';

// Combine all node definitions
const ALL_NODES = { ...COMPLETE_2000_N8N_NODES, ...ADDITIONAL_1500_NODES };

export function RealWorkflowCanvas({ 
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
  const svgRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragNode, setDragNode] = useState(null);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  
  // Connection system state
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);
  const [tempConnectionEnd, setTempConnectionEnd] = useState(null);
  const [draggedConnection, setDraggedConnection] = useState(null);

  const handleNodeDrag = useCallback((nodeId, delta) => {
    if (!isDragging) return;
    
    const node = workflow?.nodes.find(n => n.id === nodeId);
    if (node) {
      onUpdateNode(nodeId, {
        position: {
          x: Math.max(0, node.position.x + delta.x),
          y: Math.max(0, node.position.y + delta.y)
        }
      });
    }
  }, [workflow, onUpdateNode, isDragging]);

  const handleMouseDown = (e, nodeId) => {
    e.stopPropagation();
    if (e.button === 0) { // Left click only
      setIsDragging(true);
      setDragNode(nodeId);
      onSelectNode(nodeId);
    }
  };

  const handleCanvasMouseDown = (e) => {
    if (e.target === canvasRef.current || e.target === svgRef.current) {
      if (e.button === 1 || e.ctrlKey) { // Middle click or Ctrl+click for panning
        setIsPanning(true);
        setLastPanPoint({ x: e.clientX, y: e.clientY });
      } else {
        onSelectNode(null);
      }
      
      // Cancel any ongoing connection
      if (isConnecting) {
        setIsConnecting(false);
        setConnectionStart(null);
        setTempConnectionEnd(null);
      }
    }
  };

  const handleMouseMove = useCallback((e) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      setPanOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }

    // Update temp connection end point
    if (isConnecting && connectionStart) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - panOffset.x) / canvasZoom;
      const y = (e.clientY - rect.top - panOffset.y) / canvasZoom;
      setTempConnectionEnd({ x, y });
    }
  }, [isPanning, lastPanPoint, isConnecting, connectionStart, panOffset, canvasZoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragNode(null);
    setIsPanning(false);
  }, []);

  // Connection handlers
  const handleConnectionStart = (nodeId, outputIndex = 0, event) => {
    event.stopPropagation();
    if (isConnecting && connectionStart?.nodeId === nodeId) {
      // Cancel connection if clicking same node
      setIsConnecting(false);
      setConnectionStart(null);
      setTempConnectionEnd(null);
      return;
    }
    
    setIsConnecting(true);
    setConnectionStart({ nodeId, outputIndex });
    setTempConnectionEnd(null);
  };

  const handleConnectionEnd = (nodeId, inputIndex = 0, event) => {
    event.stopPropagation();
    if (isConnecting && connectionStart && connectionStart.nodeId !== nodeId) {
      // Create connection
      const newConnection = {
        id: `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        source: connectionStart.nodeId,
        target: nodeId,
        sourceOutput: connectionStart.outputIndex,
        targetInput: inputIndex
      };
      
      // Check if connection already exists
      const existingConnection = workflow.connections.find(
        conn => conn.source === newConnection.source && 
                conn.target === newConnection.target &&
                conn.sourceOutput === newConnection.sourceOutput &&
                conn.targetInput === newConnection.targetInput
      );
      
      if (!existingConnection) {
        onAddConnection(newConnection);
      }
    }
    
    // Reset connection state
    setIsConnecting(false);
    setConnectionStart(null);
    setTempConnectionEnd(null);
  };

  const handleConnectionDelete = (connectionId, event) => {
    event.stopPropagation();
    onDeleteConnection(connectionId);
  };

  const getNodeIcon = (nodeType) => {
    const definition = ALL_NODES[nodeType];
    return definition?.icon || '⚡';
  };

  const getNodeColor = (nodeType) => {
    const definition = ALL_NODES[nodeType];
    return definition?.color || '#666666';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'executing':
        return <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />;
      case 'success':
        return <Check className="w-3 h-3 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-400" />;
      default:
        return null;
    }
  };

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setCanvasZoom(prev => Math.max(0.1, Math.min(3, prev * delta)));
  }, [setCanvasZoom]);

  // Event listeners
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
  }, [handleMouseMove, handleMouseUp, handleWheel]);

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

  const calculateConnectionPath = (sourceNode, targetNode, sourceOutput = 0, targetInput = 0) => {
    const sourceX = sourceNode.position.x + 200; // Node width
    const sourceY = sourceNode.position.y + 40 + (sourceOutput * 20); // Node height / 2 + output offset
    const targetX = targetNode.position.x;
    const targetY = targetNode.position.y + 40 + (targetInput * 20); // Node height / 2 + input offset

    const controlPointDistance = Math.abs(targetX - sourceX) * 0.3;
    const sourceControlX = sourceX + controlPointDistance;
    const targetControlX = targetX - controlPointDistance;

    return `M ${sourceX} ${sourceY} C ${sourceControlX} ${sourceY} ${targetControlX} ${targetY} ${targetX} ${targetY}`;
  };

  return (
    <div 
      className="flex-1 relative overflow-hidden bg-gray-800 workflow-canvas cursor-grab"
      ref={canvasRef}
      style={{
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: `${20 * canvasZoom}px ${20 * canvasZoom}px`,
        backgroundPosition: `${panOffset.x}px ${panOffset.y}px`
      }}
    >
      {/* SVG for connections */}
      <svg 
        ref={svgRef}
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
          <marker
            id="arrowhead-active"
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto"
            fill="#ee6447"
          >
            <polygon points="0 0, 10 3.5, 0 7" />
          </marker>
          <marker
            id="arrowhead-executing"
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto"
            fill="#626eff"
          >
            <polygon points="0 0, 10 3.5, 0 7" />
          </marker>
        </defs>
        
        {/* Existing connections */}
        {workflow.connections.map((connection) => {
          const sourceNode = workflow.nodes.find(n => n.id === connection.source);
          const targetNode = workflow.nodes.find(n => n.id === connection.target);
          
          if (!sourceNode || !targetNode) return null;

          const isExecuting = executionStatus[sourceNode.id] === 'executing';
          const isSuccess = executionStatus[sourceNode.id] === 'success';
          const isSelected = selectedNode === connection.source || selectedNode === connection.target;

          const pathData = calculateConnectionPath(
            sourceNode, 
            targetNode, 
            connection.sourceOutput || 0, 
            connection.targetInput || 0
          );

          return (
            <g key={connection.id}>
              <path
                d={pathData}
                stroke={isExecuting ? '#626eff' : isSelected ? '#ee6447' : '#6B7280'}
                strokeWidth={isExecuting ? 3 : isSelected ? 2.5 : 2}
                fill="none"
                markerEnd={`url(#arrowhead${isExecuting ? '-executing' : isSelected ? '-active' : ''})`}
                strokeDasharray={isExecuting ? "5,5" : "none"}
                className={`transition-all duration-200 ${isExecuting ? 'connection-animated' : ''}`}
                style={{ pointerEvents: 'stroke', strokeWidth: '12px', stroke: 'transparent' }}
              />
              <path
                d={pathData}
                stroke={isExecuting ? '#626eff' : isSelected ? '#ee6447' : '#6B7280'}
                strokeWidth={isExecuting ? 3 : isSelected ? 2.5 : 2}
                fill="none"
                markerEnd={`url(#arrowhead${isExecuting ? '-executing' : isSelected ? '-active' : ''})`}
                strokeDasharray={isExecuting ? "5,5" : "none"}
                className={`transition-all duration-200 ${isExecuting ? 'connection-animated' : ''} cursor-pointer hover:stroke-red-400`}
                onClick={(e) => handleConnectionDelete(connection.id, e)}
                style={{ pointerEvents: 'stroke' }}
              />
            </g>
          );
        })}

        {/* Temporary connection while dragging */}
        {isConnecting && connectionStart && tempConnectionEnd && (
          <path
            d={`M ${workflow.nodes.find(n => n.id === connectionStart.nodeId)?.position.x + 200} ${workflow.nodes.find(n => n.id === connectionStart.nodeId)?.position.y + 40} L ${tempConnectionEnd.x} ${tempConnectionEnd.y}`}
            stroke="#ee6447"
            strokeWidth="2"
            strokeDasharray="5,5"
            fill="none"
            className="opacity-70 connection-animated"
          />
        )}
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
          const definition = ALL_NODES[node.type];
          const isSelected = selectedNode === node.id;
          
          return (
            <motion.div
              key={node.id}
              className={`absolute w-48 glass-card bg-gray-800/50 backdrop-blur-lg border-2 rounded-lg p-3 cursor-pointer select-none group transition-all duration-300 btn-3d ${
                isSelected ? 'border-primary-500 shadow-glass-primary shadow-lg' : 'border-gray-600 hover:border-primary-400'
              } ${nodeStatus === 'executing' ? 'animate-pulse pulse-glow' : ''}`}
              style={{ 
                left: node.position.x, 
                top: node.position.y,
                borderColor: nodeStatus === 'success' ? '#10B981' : 
                           nodeStatus === 'error' ? '#EF4444' : 
                           isSelected ? '#ee6447' : '#4B5563'
              }}
              onMouseDown={(e) => handleMouseDown(e, node.id)}
              drag
              onDrag={(e, info) => handleNodeDrag(node.id, info.delta)}
              dragMomentum={false}
              whileHover={{ scale: 1.02 }}
              whileDrag={{ scale: 1.05 }}
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

              {/* Input Connectors */}
              {definition?.inputs > 0 && (
                <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 space-y-1">
                  {Array.from({ length: definition.inputs }).map((_, index) => (
                    <div 
                      key={`input-${index}`}
                      className="w-6 h-6 glass-card bg-gray-600/50 backdrop-blur border-2 border-secondary-400 rounded-full cursor-pointer hover:bg-primary-500 hover:border-primary-400 transition-all duration-300 flex items-center justify-center micro-bounce"
                      onClick={(e) => handleConnectionEnd(node.id, index, e)}
                      title={`Input ${index + 1}`}
                    >
                      <div className="w-2 h-2 bg-secondary-300 rounded-full"></div>
                    </div>
                  ))}
                </div>
              )}

              {/* Output Connectors */}
              {definition?.outputs > 0 && (
                <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 space-y-1">
                  {Array.from({ length: definition.outputs }).map((_, index) => (
                    <div 
                      key={`output-${index}`}
                      className={`w-6 h-6 glass-card bg-gray-600/50 backdrop-blur border-2 border-primary-400 rounded-full cursor-pointer hover:bg-primary-500 hover:border-primary-400 transition-all duration-300 flex items-center justify-center micro-bounce ${
                        isConnecting && connectionStart?.nodeId === node.id && connectionStart?.outputIndex === index ? 'bg-primary-500 border-primary-400 pulse-glow' : ''
                      }`}
                      onClick={(e) => handleConnectionStart(node.id, index, e)}
                      title={`Output ${index + 1}`}
                    >
                      <div className="w-2 h-2 bg-primary-300 rounded-full"></div>
                    </div>
                  ))}
                </div>
              )}

              {/* Node content preview */}
              {Object.keys(node.data.config || {}).length > 0 && (
                <div className="mt-2 text-xs text-gray-400 border-t border-gray-600 pt-2">
                  {Object.entries(node.data.config).slice(0, 2).map(([key, value]) => (
                    <div key={key} className="truncate">
                      <span className="text-gray-500">{key}:</span> {String(value).substring(0, 20)}...
                    </div>
                  ))}
                </div>
              )}

              {/* Webhook URL for webhook nodes */}
              {node.type === 'webhook' && node.webhookUrl && (
                <div className="mt-2 text-xs border-t border-gray-600 pt-2">
                  <div className="text-gray-400 mb-1">Webhook URL:</div>
                  <div className="bg-gray-800 p-2 rounded text-green-400 font-mono text-xs break-all">
                    {node.webhookUrl}
                  </div>
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
          className="w-10 h-10 glass-card bg-gray-800/70 backdrop-blur border border-secondary-600 rounded-lg flex items-center justify-center text-secondary-400 hover:text-white hover:border-secondary-500 transition-all duration-300 btn-3d"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </motion.button>
        
        <motion.button
          onClick={() => setCanvasZoom(prev => Math.max(prev / 1.2, 0.1))}
          className="w-10 h-10 glass-card bg-gray-800/70 backdrop-blur border border-secondary-600 rounded-lg flex items-center justify-center text-secondary-400 hover:text-white hover:border-secondary-500 transition-all duration-300 btn-3d"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </motion.button>
        
        <motion.button
          onClick={() => {
            setCanvasZoom(1);
            setPanOffset({ x: 0, y: 0 });
          }}
          className="w-10 h-10 glass-card bg-gray-800/70 backdrop-blur border border-secondary-600 rounded-lg flex items-center justify-center text-secondary-400 hover:text-white hover:border-secondary-500 transition-all duration-300 btn-3d"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Connection Instructions */}
      {isConnecting && (
        <div className="glass-card bg-gray-800/80 backdrop-blur border border-primary-500 rounded-lg p-3 z-20">
          <p className="text-primary-400 text-sm font-medium">
            Click on an input connector to create connection
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Click anywhere to cancel
          </p>
        </div>
      )}

      {/* Zoom indicator */}
      <div className="glass-card bg-gray-800/70 backdrop-blur border border-secondary-600 rounded-lg px-3 py-1 text-sm text-secondary-300">
        {Math.round(canvasZoom * 100)}%
      </div>
    </div>
  );
}