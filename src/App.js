import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StatisticsPage from './components/StatisticsPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const { backgroundImage } = useAuth();
  
  const appStyle = {
    minHeight: '100vh',
    position: 'relative',
    background: backgroundImage 
      ? `url(${backgroundImage}) center center/cover no-repeat fixed, linear-gradient(135deg, #4a90a4 0%, #5f9ea0 50%, #708090 100%)`
      : `url('/background.jpg') center center/cover no-repeat fixed, linear-gradient(135deg, #4a90a4 0%, #5f9ea0 50%, #708090 100%)`
  };

  return (
    <div className="App" style={appStyle}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/statistics" element={<ProtectedRoute><StatisticsPage onBack={() => window.history.back()} /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

export default App;