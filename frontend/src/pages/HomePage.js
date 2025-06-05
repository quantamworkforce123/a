import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '../components';
import { 
  Play, 
  ArrowRight, 
  CheckCircle, 
  Zap, 
  Users, 
  Globe,
  Github,
  Slack,
  Mail,
  Database,
  Cloud,
  Code,
  Star,
  TrendingUp
} from 'lucide-react';

function HomePage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigate = (page) => {
    setCurrentPage(page);
    switch(page) {
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

  const integrations = [
    { name: 'Slack', icon: Slack, color: 'bg-purple-500' },
    { name: 'Gmail', icon: Mail, color: 'bg-red-500' },
    { name: 'GitHub', icon: Github, color: 'bg-gray-700' },
    { name: 'Database', icon: Database, color: 'bg-blue-500' },
    { name: 'AWS', icon: Cloud, color: 'bg-orange-500' },
    { name: 'Code', icon: Code, color: 'bg-green-500' },
    { name: 'HTTP', icon: Globe, color: 'bg-indigo-500' },
    { name: 'Webhook', icon: Zap, color: 'bg-yellow-500' }
  ];

  const stats = [
    { label: 'GitHub Stars', value: '80K+', icon: Star },
    { label: 'Active Users', value: '200K+', icon: Users },
    { label: 'Integrations', value: '500+', icon: Globe },
    { label: 'Growth', value: '400%', icon: TrendingUp }
  ];

  const features = [
    {
      title: 'Visual Workflow Builder',
      description: 'Build complex workflows with an intuitive drag-and-drop interface',
      icon: Zap
    },
    {
      title: '500+ Integrations',
      description: 'Connect with your favorite tools and services seamlessly',
      icon: Globe
    },
    {
      title: 'Self-Hosted Option',
      description: 'Keep your data secure with on-premise deployment',
      icon: Cloud
    },
    {
      title: 'Code When Needed',
      description: 'Add custom logic with JavaScript, Python, or other languages',
      icon: Code
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-orange-900/20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1644325349124-d1756b79dd42')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-white mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Flexible AI workflow automation
              <br />
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                for technical teams
              </span>
            </motion.h1>
            
            <motion.p
              className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Build with the precision of code or the speed of drag-n-drop. Hard
              fork flexibility vs speed convenience. You choose how
              you create custom business workflows.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => navigate('/workflow')}
                className="border border-gray-600 hover:border-gray-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Try Demo</span>
              </button>
            </motion.div>
          </div>

          {/* Workflow Visualization */}
          <motion.div
            className="mt-20 max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'IT Ops', desc: 'Save time, write maintainable and automate accounts', icon: Zap },
                  { label: 'Sec Ops', desc: 'A single source of truth that enables risk and compliance API calls', icon: CheckCircle },
                  { label: 'Dev Ops', desc: 'A secure design language that allows API calls', icon: Code },
                  { label: 'Sales', desc: 'Improve customer insights from grouped workers', icon: TrendingUp }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  >
                    <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-8 h-8 text-orange-400" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">{item.label}</h3>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Visual Workflow */}
              <div className="mt-12 relative">
                <svg viewBox="0 0 800 300" className="w-full h-64">
                  {/* Nodes */}
                  <g>
                    {/* Trigger Node */}
                    <rect x="50" y="120" width="120" height="60" rx="8" fill="#3B82F6" />
                    <text x="110" y="140" textAnchor="middle" fill="white" fontSize="12">
                      On new lead
                    </text>
                    <text x="110" y="155" textAnchor="middle" fill="white" fontSize="10">
                      from HubSpot
                    </text>

                    {/* Action Node 1 */}
                    <rect x="220" y="120" width="120" height="60" rx="8" fill="#10B981" />
                    <text x="280" y="140" textAnchor="middle" fill="white" fontSize="12">
                      Send Slack
                    </text>
                    <text x="280" y="155" textAnchor="middle" fill="white" fontSize="10">
                      message
                    </text>

                    {/* Action Node 2 */}
                    <rect x="390" y="50" width="120" height="60" rx="8" fill="#F59E0B" />
                    <text x="450" y="70" textAnchor="middle" fill="white" fontSize="12">
                      Add to internal
                    </text>
                    <text x="450" y="85" textAnchor="middle" fill="white" fontSize="10">
                      CRM database
                    </text>

                    {/* Action Node 3 */}
                    <rect x="390" y="190" width="120" height="60" rx="8" fill="#EF4444" />
                    <text x="450" y="210" textAnchor="middle" fill="white" fontSize="12">
                      Update project
                    </text>
                    <text x="450" y="225" textAnchor="middle" fill="white" fontSize="10">
                      group insights
                    </text>

                    {/* Final Node */}
                    <rect x="560" y="120" width="120" height="60" rx="8" fill="#8B5CF6" />
                    <text x="620" y="140" textAnchor="middle" fill="white" fontSize="12">
                      Update group
                    </text>
                    <text x="620" y="155" textAnchor="middle" fill="white" fontSize="10">
                      in Slack workspace
                    </text>
                  </g>

                  {/* Connections */}
                  <g stroke="#6B7280" strokeWidth="2" fill="none">
                    <path d="M 170 150 Q 195 150 220 150" markerEnd="url(#arrowhead)" />
                    <path d="M 340 140 Q 365 115 390 80" markerEnd="url(#arrowhead)" />
                    <path d="M 340 160 Q 365 185 390 220" markerEnd="url(#arrowhead)" />
                    <path d="M 510 80 Q 535 100 560 150" markerEnd="url(#arrowhead)" />
                    <path d="M 510 220 Q 535 200 560 150" markerEnd="url(#arrowhead)" />
                  </g>

                  {/* Arrow markers */}
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                            refX="10" refY="3.5" orient="auto" fill="#6B7280">
                      <polygon points="0 0, 10 3.5, 0 7" />
                    </marker>
                  </defs>
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The world's most popular workflow automation platform for technical teams
            </h2>
            <p className="text-gray-400 text-lg">Trusted by companies of all sizes</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-orange-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Plug AI into your own data &
              <br />
              <span className="text-orange-400">over 500 integrations</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-6 mb-16">
            {[...integrations, ...integrations].map((integration, index) => (
              <motion.div
                key={index}
                className="w-16 h-16 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center hover:border-orange-500 transition-colors"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1 }}
              >
                <integration.icon className="w-8 h-8 text-gray-400" />
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Explore All Integrations
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The fast way to actually
              <br />
              <span className="text-orange-400">get AI working in your business</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-orange-500 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to automate your workflows?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of teams already automating their processes with n8n
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                Start Building Workflows
              </button>
              <button
                onClick={() => navigate('/login')}
                className="border border-gray-600 hover:border-gray-500 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                Book a Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">n8n</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 n8n. Build powerful automation workflows.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;