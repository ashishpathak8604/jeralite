import React, { useState } from 'react';
import { X, UserX, Loader2 } from 'lucide-react';
import { addMemberToProject, removeMemberFromProject } from '../api/projectApi';

const MemberList = ({ project, isAdmin, onClose, onUpdate }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError('');
    try {
      await addMemberToProject(project._id, email);
      setEmail('');
      onUpdate();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    try {
      await removeMemberFromProject(project._id, userId);
      onUpdate();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove member');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', margin: 0 }}>Project Members</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={24} />
          </button>
        </div>

        {isAdmin && (
          <form onSubmit={handleAddMember} style={{ marginBottom: '24px', display: 'flex', gap: '8px' }}>
            <input 
              type="email" 
              className="input-field" 
              placeholder="User Email Address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ whiteSpace: 'nowrap' }}>
              {loading ? <Loader2 size={16} className="lucide-spin" /> : 'Add Member'}
            </button>
          </form>
        )}

        {error && <div style={{ color: 'var(--danger-color)', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
          {project.members.map((m) => (
            <div key={m.user._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '6px' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{m.user.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{m.user.email}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold', padding: '2px 8px', borderRadius: '12px', backgroundColor: m.role === 'admin' ? 'var(--primary-color)' : 'var(--bg-secondary)', color: m.role === 'admin' ? 'white' : 'var(--text-primary)' }}>
                  {m.role}
                </span>
                
                {isAdmin && m.user._id !== project.owner._id && (
                  <button 
                    onClick={() => handleRemoveMember(m.user._id)}
                    style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', display: 'flex' }}
                    title="Remove member"
                  >
                    <UserX size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberList;
