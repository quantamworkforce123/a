import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { authAPI, setAuthToken, clearAuth } from './services/api';

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
        token: action.payload.access_token,
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
        setAuthToken(token);
        dispatch({
          type: ACTIONS.LOAD_USER,
          payload: { user, token }
        });
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        clearAuth();
        dispatch({ type: ACTIONS.LOGOUT });
      }
    } else {
      dispatch({ type: ACTIONS.LOGOUT });
    }
  }, []);

  const login = useCallback(async (credentials) => {
    dispatch({ type: ACTIONS.LOGIN_START });
    
    try {
      const response = await authAPI.login(credentials);
      
      // Store in localStorage
      setAuthToken(response.access_token);
      localStorage.setItem('quantamworkforce_user', JSON.stringify(response.user));
      
      dispatch({
        type: ACTIONS.LOGIN_SUCCESS,
        payload: response
      });
      
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message || 'Login failed';
      dispatch({
        type: ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      });
      throw new Error(errorMessage);
    }
  }, []);

  const register = useCallback(async (userData) => {
    dispatch({ type: ACTIONS.REGISTER_START });
    
    try {
      const response = await authAPI.register(userData);
      
      // Store in localStorage
      setAuthToken(response.access_token);
      localStorage.setItem('quantamworkforce_user', JSON.stringify(response.user));
      
      dispatch({
        type: ACTIONS.REGISTER_SUCCESS,
        payload: response
      });
      
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message || 'Registration failed';
      dispatch({
        type: ACTIONS.REGISTER_FAILURE,
        payload: errorMessage
      });
      throw new Error(errorMessage);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuth();
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