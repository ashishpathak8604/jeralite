import React, { useState } from 'react';
import { Calendar, User, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatDate, isOverdue } from '../utils/formatDate';
import { updateTaskStatus } from '../api/taskApi';

// Note: If provided is null (e.g. used in Dashboard), it renders a standard div.
const TaskCard = ({ task, onStatusUpdate, provided, snapshot, onDelete, onClick }) => {
  const overdue = isOverdue(task.dueDate) && task.status !== 'Completed';
  const [updating, setUpdating] = useState(false);
  
  // Safe extraction of assignee details since the backend might send an ID string or an object
  const assigneeName = typeof task.assignedTo === 'object' && task.assignedTo !== null 
    ? task.assignedTo.name 
    : null;

  const handleStatusChange = async (e) => {
    e.stopPropagation();
    const newStatus = e.target.value;
    setUpdating(true);
    try {
      await updateTaskStatus(task._id, newStatus);
      if (onStatusUpdate) onStatusUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const cardContent = (
    <div 
      className={`task-card ${snapshot?.isDragging ? 'is-dragging' : ''}`}
      style={{
        position: 'relative',
        display: 'flex',
        cursor: 'pointer',
        flexDirection: 'column',
        gap: '12px',
        borderLeft: overdue ? '4px solid var(--danger)' : '1px solid var(--border-subtle)',
        ...provided?.draggableProps.style
      }}
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      onClick={() => onClick && onClick(task)}
    >
      {overdue && (
        <span style={{ position: 'absolute', top: '-10px', right: '10px', backgroundColor: 'var(--danger)', color: 'white', fontSize: '10px', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(239, 68, 68, 0.4)' }}>
          OVERDUE
        </span>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4, cursor: provided ? 'grab' : 'default' }}>
          {task.title}
        </h4>
        {onDelete && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(task._id); }} 
            style={{ color: 'var(--danger)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', margin: '-4px -4px 0 0', borderRadius: '4px', display: 'flex' }}
            title="Delete task"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
      
      {task.description && (
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {task.description}
        </p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '10px', fontWeight: 'bold' }}>
            {assigneeName ? assigneeName.charAt(0).toUpperCase() : <User size={10} />}
          </div>
          <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {assigneeName ? assigneeName : 'Unassigned'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: overdue ? 'var(--danger)' : 'inherit', fontWeight: overdue ? 600 : 400 }}>
          <Calendar size={14} />
          {formatDate(task.dueDate)}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
        <StatusBadge status={task.status} />
        
        {/* Only show select if not inside a drag context, otherwise the column infers status */}
        {!provided && (
          <select 
            value={task.status} 
            onChange={handleStatusChange} 
            onClick={(e) => e.stopPropagation()}
            disabled={updating}
            style={{
              padding: '4px 8px', fontSize: '12px', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-strong)', backgroundColor: 'var(--bg-app)',
              color: 'var(--text-primary)', cursor: 'pointer', outline: 'none'
            }}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        )}
      </div>
    </div>
  );

  return cardContent;
};

export default TaskCard;
