import React from 'react';

const StatusBadge = ({ status }) => {
  let bgColor, color;

  switch (status) {
    case 'Pending':
      bgColor = 'var(--warning-color)';
      color = '#fff';
      break;
    case 'In Progress':
      bgColor = 'var(--primary-color)';
      color = '#fff';
      break;
    case 'Completed':
      bgColor = 'var(--success-color)';
      color = '#fff';
      break;
    default:
      bgColor = 'var(--bg-tertiary)';
      color = 'var(--text-secondary)';
  }

  return (
    <span style={{
      backgroundColor: bgColor,
      color: color,
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      display: 'inline-block'
    }}>
      {status}
    </span>
  );
};

export default StatusBadge;
