import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Header, WorkflowCard, CreateWorkflowModal } from '../components';
import { useWorkflow } from '../WorkflowContext';
import { 
  Plus, 
  Search, 
  Filter, 
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();
  const { 
    workflows, 
    createWorkflow, 
    deleteWorkflow, 
    updateWorkflow, 
    setCurrentWorkflow 
  } = useWorkflow();
  
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleNavigate = (page) => {
    setCurrentPage(page);
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

  const handleSelectWorkflow = (workflow) => {
    setCurrentWorkflow(workflow);
    navigate(`/workflow/${workflow.id}`);
  };

  const handleCreateWorkflow = (workflowData) => {
    createWorkflow(workflowData);
  };

  const handleDeleteWorkflow = (workflowId) => {
    deleteWorkflow(workflowId);
  };

  const handleToggleActive = (workflowId) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (workflow) {
      updateWorkflow(workflowId, { isActive: !workflow.isActive });
    }
  };

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterActive === 'all' || 
                         (filterActive === 'active' && workflow.isActive) ||
                         (filterActive === 'inactive' && !workflow.isActive);
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalWorkflows: workflows.length,
    activeWorkflows: workflows.filter(w => w.isActive).length,
    totalExecutions: workflows.reduce((sum, w) => sum + w.executions, 0),
    successRate: 94 // Mock success rate
  };

  const recentExecutions = [
    { id: 1, workflow: 'Email Marketing Campaign', status: 'success', time: '2 minutes ago' },
    { id: 2, workflow: 'Data Backup Process', status: 'success', time: '15 minutes ago' },
    { id: 3, workflow: 'Slack Notifications', status: 'error', time: '1 hour ago' },
    { id: 4, workflow: 'User Onboarding', status: 'success', time: '2 hours ago' },
    { id: 5, workflow: 'Invoice Generation', status: 'success', time: '3 hours ago' }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Header currentPage={currentPage} onNavigate={handleNavigate} user={{ name: 'John Doe' }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Workflows</h1>
            <p className="text-gray-400">Manage and monitor your automation workflows</p>
          </div>
          
          <motion.button
            onClick={() => setShowCreateModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5" />
            <span>New Workflow</span>
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Workflows', value: stats.totalWorkflows, icon: BarChart3, color: 'text-blue-400' },
            { label: 'Active Workflows', value: stats.activeWorkflows, icon: CheckCircle, color: 'text-green-400' },
            { label: 'Total Executions', value: stats.totalExecutions, icon: TrendingUp, color: 'text-orange-400' },
            { label: 'Success Rate', value: `${stats.successRate}%`, icon: Zap, color: 'text-purple-400' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search workflows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterActive}
                  onChange={(e) => setFilterActive(e.target.value)}
                  className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Workflows</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>
            </div>

            {/* Workflows Grid */}
            <div className="space-y-6">
              <AnimatePresence>
                {filteredWorkflows.length === 0 ? (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">
                      {searchTerm ? 'No workflows found' : 'No workflows yet'}
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {searchTerm 
                        ? 'Try adjusting your search terms or filters'
                        : 'Create your first workflow to get started with automation'
                      }
                    </p>
                    {!searchTerm && (
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                      >
                        Create Your First Workflow
                      </button>
                    )}
                  </motion.div>
                ) : (
                  filteredWorkflows.map((workflow, index) => (
                    <motion.div
                      key={workflow.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <WorkflowCard
                        workflow={workflow}
                        onSelect={handleSelectWorkflow}
                        onDelete={handleDeleteWorkflow}
                        onToggleActive={handleToggleActive}
                      />
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Executions */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Recent Executions</span>
              </h3>
              
              <div className="space-y-3">
                {recentExecutions.map((execution) => (
                  <div key={execution.id} className="flex items-center justify-between py-2">
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium truncate">
                        {execution.workflow}
                      </p>
                      <p className="text-gray-400 text-xs">{execution.time}</p>
                    </div>
                    <div className="ml-3">
                      {execution.status === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors">
                View All Executions
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition-colors text-sm font-medium"
                >
                  Create New Workflow
                </button>
                
                <button
                  onClick={() => navigate('/workflow')}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors text-sm font-medium"
                >
                  Try Sample Workflow
                </button>
                
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors text-sm font-medium">
                  Browse Templates
                </button>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Usage This Month</span>
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Executions</span>
                    <span className="text-white">847 / 1000</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '84.7%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Data Transfer</span>
                    <span className="text-white">2.3 GB / 5 GB</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '46%' }}></div>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-4 text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors">
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Workflow Modal */}
      <CreateWorkflowModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateWorkflow}
      />
    </div>
  );
}

export default Dashboard;