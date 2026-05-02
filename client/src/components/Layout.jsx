import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="app-layout" style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <main className="main-content" style={{ flex: 1, backgroundColor: 'var(--bg-primary)', overflowY: 'auto' }}>
          <div className="page-content" style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
