// API Service Layer for Quantamworkforce Frontend
import axios from 'axios';

// Get backend URL from environment
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('quantamworkforce_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('quantamworkforce_token');
      localStorage.removeItem('quantamworkforce_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// =============================================================================
// AUTHENTICATION API
// =============================================================================

export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateUser: async (userData) => {
    const response = await api.put('/auth/me', userData);
    return response.data;
  }
};

// =============================================================================
// WORKFLOWS API
// =============================================================================

export const workflowsAPI = {
  create: async (workflowData) => {
    const response = await api.post('/workflows', workflowData);
    return response.data;
  },

  getAll: async (params = {}) => {
    const response = await api.get('/workflows', { params });
    return response.data;
  },

  getById: async (workflowId) => {
    const response = await api.get(`/workflows/${workflowId}`);
    return response.data;
  },

  update: async (workflowId, updateData) => {
    const response = await api.put(`/workflows/${workflowId}`, updateData);
    return response.data;
  },

  delete: async (workflowId) => {
    const response = await api.delete(`/workflows/${workflowId}`);
    return response.data;
  },

  execute: async (workflowId, inputData = null) => {
    const response = await api.post(`/workflows/${workflowId}/execute`, inputData);
    return response.data;
  },

  getExecutions: async (workflowId, params = {}) => {
    const response = await api.get(`/workflows/${workflowId}/executions`, { params });
    return response.data;
  }
};

// =============================================================================
// EXECUTIONS API
// =============================================================================

export const executionsAPI = {
  getById: async (executionId) => {
    const response = await api.get(`/executions/${executionId}`);
    return response.data;
  }
};

// =============================================================================
// NODES API
// =============================================================================

export const nodesAPI = {
  getAll: async () => {
    const response = await api.get('/nodes');
    return response.data;
  },

  getByType: async (nodeType) => {
    const response = await api.get(`/nodes/${nodeType}`);
    return response.data;
  }
};

// =============================================================================
// HEALTH API
// =============================================================================

export const healthAPI = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  ping: async () => {
    const response = await api.get('/');
    return response.data;
  }
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('quantamworkforce_token', token);
  } else {
    localStorage.removeItem('quantamworkforce_token');
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('quantamworkforce_token');
};

export const clearAuth = () => {
  localStorage.removeItem('quantamworkforce_token');
  localStorage.removeItem('quantamworkforce_user');
};

export default api;