import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-visual-side">
        <div className="auth-gradient"></div>
        <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(100px)', backgroundColor: 'var(--glass-bg)', zIndex: 1 }}></div>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 style={{ fontSize: '48px', fontWeight: 700, marginBottom: '24px', lineHeight: 1.1 }}>Manage tasks<br/>like a pro.</h1>
            <p style={{ fontSize: '20px', color: 'var(--text-secondary)', maxWidth: '400px' }}>Join thousand of teams already using Jeralite to deliver award-winning projects on time.</p>
          </motion.div>
        </div>
      </div>

      <div className="auth-form-side">
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ width: '100%', maxWidth: '380px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 'bold', fontSize: '24px', color: 'var(--primary)', marginBottom: '40px' }}>
            <CheckCircle size={32} />
            Jeralite
          </div>

          <h2 style={{ fontSize: '32px', marginBottom: '8px', fontWeight: 700 }}>Welcome back</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Please enter your details to sign in.</p>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '12px', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', marginBottom: '24px', fontSize: '14px' }}>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>Email</label>
              <input 
                type="email" 
                className="input-field"
                placeholder="Enter your email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>Password</label>
              <input 
                type="password" 
                className="input-field"
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '12px', marginTop: '8px', width: '100%' }}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p style={{ marginTop: '32px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
            Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
