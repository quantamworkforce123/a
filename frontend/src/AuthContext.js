import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';

const AuthContext = createContext();

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  token: null,
  error: null
};

// Action types
const ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  LOAD_USER: 'LOAD_USER',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
function authReducer(state, action) {
  switch (action.type) {
    case ACTIONS.LOGIN_START:
    case ACTIONS.REGISTER_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case ACTIONS.LOGIN_SUCCESS:
    case ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        error: null
      };

    case ACTIONS.LOGIN_FAILURE:
    case ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
        error: action.payload
      };

    case ACTIONS.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
        error: null
      };

    case ACTIONS.LOAD_USER:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false
      };

    case ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
}

// Mock authentication functions (replace with real API calls)
const mockApiCall = (endpoint, data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (endpoint === 'login') {
        if (data.email && data.password) {
          resolve({
            user: {
              id: '1',
              name: data.name || 'John Doe',
              email: data.email,
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'John Doe')}&background=ff7f4d&color=ffffff`,
              role: 'admin',
              createdAt: new Date().toISOString()
            },
            token: 'mock_jwt_token_' + Date.now()
          });
        } else {
          reject(new Error('Invalid credentials'));
        }
      } else if (endpoint === 'register') {
        if (data.email && data.password && data.name) {
          resolve({
            user: {
              id: Date.now().toString(),
              name: data.name,
              email: data.email,
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=ff7f4d&color=ffffff`,
              role: 'user',
              createdAt: new Date().toISOString()
            },
            token: 'mock_jwt_token_' + Date.now()
          });
        } else {
          reject(new Error('All fields are required'));
        }
      }
    }, 1000); // Simulate network delay
  });
};

// Provider component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from localStorage on app start
  useEffect(() => {
    const token = localStorage.getItem('quantamworkforce_token');
    const userData = localStorage.getItem('quantamworkforce_user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        dispatch({
          type: ACTIONS.LOAD_USER,
          payload: { user, token }
        });
      } catch (error) {
        localStorage.removeItem('quantamworkforce_token');
        localStorage.removeItem('quantamworkforce_user');
        dispatch({ type: ACTIONS.LOGOUT });
      }
    } else {
      dispatch({ type: ACTIONS.LOGOUT });
    }
  }, []);

  const login = useCallback(async (credentials) => {
    dispatch({ type: ACTIONS.LOGIN_START });
    
    try {
      const response = await mockApiCall('login', credentials);
      
      // Store in localStorage
      localStorage.setItem('quantamworkforce_token', response.token);
      localStorage.setItem('quantamworkforce_user', JSON.stringify(response.user));
      
      dispatch({
        type: ACTIONS.LOGIN_SUCCESS,
        payload: response
      });
      
      return response;
    } catch (error) {
      dispatch({
        type: ACTIONS.LOGIN_FAILURE,
        payload: error.message
      });
      throw error;
    }
  }, []);

  const register = useCallback(async (userData) => {
    dispatch({ type: ACTIONS.REGISTER_START });
    
    try {
      const response = await mockApiCall('register', userData);
      
      // Store in localStorage
      localStorage.setItem('quantamworkforce_token', response.token);
      localStorage.setItem('quantamworkforce_user', JSON.stringify(response.user));
      
      dispatch({
        type: ACTIONS.REGISTER_SUCCESS,
        payload: response
      });
      
      return response;
    } catch (error) {
      dispatch({
        type: ACTIONS.REGISTER_FAILURE,
        payload: error.message
      });
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('quantamworkforce_token');
    localStorage.removeItem('quantamworkforce_user');
    dispatch({ type: ACTIONS.LOGOUT });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_ERROR });
  }, []);

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Protected Route component
export function ProtectedRoute({ children, fallback = null }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return fallback;
  }
  
  return children;
}