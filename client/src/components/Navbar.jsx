import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, CheckCircle } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { ThemeContext } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { dbUser, logout } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <header style={{
      height: 'var(--header-height)',
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      color: 'var(--text-primary)',
      zIndex: 10,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 'bold', fontSize: '20px', color: 'var(--primary)' }}>
        <CheckCircle size={24} />
        Jeralite
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme} 
          style={{ background: 'var(--bg-surface-hover)', border: '1px solid var(--border-subtle)', borderRadius: '50%', padding: '8px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </motion.button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingLeft: '20px', borderLeft: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>
              {dbUser?.name || 'Loading...'}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
              {dbUser?.email || ''}
            </span>
          </div>
          
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', fontSize: '14px',
            boxShadow: '0 2px 8px var(--primary-glow)'
          }}>
            {dbUser?.name ? dbUser.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <motion.button 
            whileHover={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger)' }}
            onClick={handleLogout}
            style={{ 
              background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)',
              padding: '8px', borderRadius: '50%', display: 'flex', marginLeft: '4px'
            }}
            title="Log out"
          >
            <LogOut size={18} />
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
