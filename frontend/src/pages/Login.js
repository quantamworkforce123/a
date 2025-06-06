import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '../components.js';
import { useAuth } from '../AuthContext';
import { 
  Zap, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Github, 
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

function Login() {
  const navigate = useNavigate();
  const { login, register, error, isLoading, clearError } = useAuth();
  const [currentPage, setCurrentPage] = useState('login');
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    switch(page) {
      case 'home':
        navigate('/');
        break;
      case 'dashboard':
        navigate('/dashboard');
        break;
      default:
        navigate('/');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
    
    // Clear global error
    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!isLogin) {
      if (!formData.name) {
        errors.name = 'Name is required';
      }
      
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Authentication error:', error);
      // Error is already handled by the auth context
    }
  };

  const handleModeSwitch = () => {
    setIsLogin(!isLogin);
    setFormErrors({});
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    });
    if (error) {
      clearError();
    }
  };

  const features = [
    'Visual workflow builder with drag & drop',
    '500+ integrations with popular services',
    'Self-hosted option for data security',
    'Custom code execution when needed',
    'Real-time execution monitoring',
    'Team collaboration features'
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      
      <div className="flex min-h-screen pt-16">
        {/* Left Side - Features */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-800 to-gray-900 p-12 flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">n8n</h1>
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-6">
              Automate your workflows with
              <span className="text-orange-400"> technical precision</span>
            </h2>
            
            <p className="text-gray-300 text-lg mb-8">
              Join thousands of teams using n8n to build powerful automation workflows
              that scale with their business needs.
            </p>
            
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <CheckCircle className="w-5 h-5 text-orange-400 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {isLogin ? 'Sign in to n8n' : 'Create your account'}
                </h2>
                <p className="text-gray-400">
                  {isLogin 
                    ? 'Welcome back! Please sign in to continue.' 
                    : 'Start automating your workflows today.'
                  }
                </p>
              </div>

              {/* OAuth Buttons */}
              <div className="space-y-3 mb-6">
                <button className="w-full bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                  <Github className="w-5 h-5" />
                  <span>Continue with GitHub</span>
                </button>
                
                <button className="w-full bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>Continue with Google</span>
                </button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-800 text-gray-400">Or continue with email</span>
                </div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter your full name"
                      required={!isLogin}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="form-input pr-10"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Confirm your password"
                      required={!isLogin}
                    />
                  </div>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-600 bg-gray-700 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <button
                        type="button"
                        className="font-medium text-orange-400 hover:text-orange-300 transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                  </div>
                )}

                <motion.button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </form>

              <div className="mt-6 text-center">
                <span className="text-gray-400">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                </span>
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-medium text-orange-400 hover:text-orange-300 transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </div>

              <div className="mt-6 text-center text-xs text-gray-500">
                By continuing, you agree to our{' '}
                <button className="text-orange-400 hover:text-orange-300 transition-colors">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button className="text-orange-400 hover:text-orange-300 transition-colors">
                  Privacy Policy
                </button>
              </div>
            </div>

            {/* Mobile Features */}
            <div className="lg:hidden mt-8">
              <h3 className="text-lg font-semibold text-white mb-4">Why choose n8n?</h3>
              <div className="grid grid-cols-1 gap-3">
                {features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Login;