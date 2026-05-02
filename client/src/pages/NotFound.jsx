import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '20px' }}>
      <h1 style={{ fontSize: '72px', color: 'var(--primary-color)', margin: 0 }}>404</h1>
      <h2 style={{ fontSize: '24px', margin: 0 }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)' }}>The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '10px' }}>
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
