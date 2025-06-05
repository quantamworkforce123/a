import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './AuthContext';
import { EnhancedWorkflowProvider } from './EnhancedWorkflowContext';
import HomePage from './pages/HomePage';
import WorkflowEditor from './pages/WorkflowEditor';
import Dashboard from './pages/Dashboard';
import QuantamLogin from './pages/QuantamLogin';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<QuantamLogin />} />
            <Route path="/dashboard" element={
              <ProtectedRoute fallback={<Navigate to="/login" state={{ from: { pathname: '/dashboard' } }} replace />}>
                <EnhancedWorkflowProvider>
                  <Dashboard />
                </EnhancedWorkflowProvider>
              </ProtectedRoute>
            } />
            <Route path="/workflow/:id?" element={
              <ProtectedRoute fallback={<Navigate to="/login" state={{ from: { pathname: '/workflow' } }} replace />}>
                <EnhancedWorkflowProvider>
                  <WorkflowEditor />
                </EnhancedWorkflowProvider>
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;