import React from 'react';
import { X, Calendar, User, Clock, CheckCircle, AlignLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import StatusBadge from './StatusBadge';
import { formatDate } from '../utils/formatDate';

const TaskDetailsModal = ({ task, onClose }) => {
  if (!task) return null;

  const assigneeName = typeof task.assignedTo === 'object' && task.assignedTo !== null 
    ? task.assignedTo.name 
    : 'Unassigned';

  const creatorName = typeof task.createdBy === 'object' && task.createdBy !== null 
    ? task.createdBy.name 
    : 'Unknown';

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1500 }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="modal-content" 
        style={{ maxWidth: '600px', padding: 0, overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {task.title}
            </h2>
            <StatusBadge status={task.status} />
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Description Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '12px' }}>
              <AlignLeft size={18} />
              Description
            </div>
            {task.description ? (
              <div style={{ backgroundColor: 'var(--bg-app)', padding: '16px', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {task.description}
              </div>
            ) : (
              <p style={{ color: 'var(--text-tertiary)', fontSize: '14px', fontStyle: 'italic', margin: 0 }}>No description provided.</p>
            )}
          </div>

          {/* Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', backgroundColor: 'var(--bg-app)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ color: 'var(--text-tertiary)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Assignee</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                  {assigneeName !== 'Unassigned' ? assigneeName.charAt(0).toUpperCase() : <User size={14} />}
                </div>
                {assigneeName}
              </div>
            </div>

            <div>
              <div style={{ color: 'var(--text-tertiary)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Due Date</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>
                <Calendar size={16} color="var(--text-secondary)" />
                {task.dueDate ? formatDate(task.dueDate) : 'None set'}
              </div>
            </div>

            <div>
              <div style={{ color: 'var(--text-tertiary)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Created By</div>
              <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                {creatorName}
              </div>
            </div>

            <div>
              <div style={{ color: 'var(--text-tertiary)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Created On</div>
              <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                {formatDate(task.createdAt)}
              </div>
            </div>
          </div>
          
        </div>
      </motion.div>
    </div>
  );
};

export default TaskDetailsModal;
