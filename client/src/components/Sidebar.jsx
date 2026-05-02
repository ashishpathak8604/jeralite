import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Plus, Loader2 } from 'lucide-react';
import useFetch from '../hooks/useFetch';
import { fetchProjects, createProject } from '../api/projectApi';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const { data: projects, loading, error, refetch } = useFetch(fetchProjects);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setIsCreating(true);
    try {
      await createProject({ title: newTitle });
      setNewTitle('');
      setShowCreate(false);
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px',
    borderRadius: 'var(--radius-sm)',
    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
    backgroundColor: isActive ? 'var(--primary-glow)' : 'transparent',
    fontWeight: isActive ? 600 : 500,
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    position: 'relative',
    overflow: 'hidden'
  });

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      backgroundColor: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px',
      overflowY: 'auto'
    }}>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <NavLink to="/dashboard" style={navLinkStyle}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <div style={{ marginTop: '32px', marginBottom: '12px', paddingLeft: '16px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '1px' }}>
          Your Projects
        </div>

        {loading ? (
          <div style={{ padding: '12px 16px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Loader2 size={16} className="lucide-spin" /> Loading...
          </div>
        ) : error ? (
          <div style={{ padding: '12px 16px', color: 'var(--danger)', fontSize: '12px' }}>Failed to load projects</div>
        ) : projects && projects.length > 0 ? (
          projects.map(project => (
            <NavLink key={project._id} to={`/project/${project._id}`} style={navLinkStyle}>
              <FolderKanban size={20} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {project.title}
              </span>
            </NavLink>
          ))
        ) : (
          <div style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '13px' }}>No projects yet.</div>
        )}

        <AnimatePresence>
          {showCreate ? (
            <motion.form 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleCreateProject} 
              style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 8px' }}
            >
              <input
                type="text"
                autoFocus
                className="input-field"
                placeholder="Project Name"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                disabled={isCreating}
                style={{ fontSize: '13px', padding: '8px 12px' }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '6px', fontSize: '12px' }} disabled={isCreating}>
                  {isCreating ? 'Saving...' : 'Save'}
                </button>
                <button type="button" className="btn btn-secondary" style={{ flex: 1, padding: '6px', fontSize: '12px' }} onClick={() => setShowCreate(false)} disabled={isCreating}>
                  Cancel
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.button 
              whileHover={{ backgroundColor: 'var(--bg-surface-hover)' }}
              onClick={() => setShowCreate(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px',
                border: 'none', background: 'transparent', color: 'var(--text-secondary)',
                cursor: 'pointer', fontWeight: 500, marginTop: '8px', borderRadius: 'var(--radius-sm)',
                transition: 'color 0.2s ease'
              }}
            >
              <Plus size={20} />
              Create Project
            </motion.button>
          )}
        </AnimatePresence>
      </nav>
    </aside>
  );
};

export default Sidebar;
