import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = () => {
  const { isAuthenticated, authLoading } = useAuth();

  // Firebase hasn't finished initializing yet — show a loading screen
  // instead of immediately redirecting to login.
  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg-primary, #0a0a0f)',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid rgba(139, 92, 246, 0.2)',
          borderTop: '4px solid #8b5cf6',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: 0 }}>
          Initializing...
        </p>
      </div>
    );
  }

  // Auth resolved — redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
