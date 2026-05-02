import React, { useState } from 'react';
import { Loader2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import useFetch from '../hooks/useFetch';
import { fetchMyTasks, deleteTask } from '../api/taskApi';
import useAuth from '../hooks/useAuth';
import TaskCard from '../components/TaskCard';
import TaskDetailsModal from '../components/TaskDetailsModal';
import ConfirmModal from '../components/ConfirmModal';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { dbUser } = useAuth();
  const { data: tasks, loading, error, refetch } = useFetch(fetchMyTasks);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><Loader2 className="lucide-spin" size={40} color="var(--primary)" /></div>;
  }

  if (error) {
    return <div style={{ color: 'var(--danger)', padding: '20px', background: 'var(--danger-bg)', borderRadius: 'var(--radius-md)' }}>Error: {error}</div>;
  }

  const pending = tasks?.filter(t => t.status === 'Pending') || [];
  const inProgress = tasks?.filter(t => t.status === 'In Progress') || [];
  const completed = tasks?.filter(t => t.status === 'Completed') || [];

  const summaryCards = [
    { label: 'Pending', count: pending.length, icon: <AlertCircle size={24} />, color: 'var(--warning)', bg: 'var(--warning-bg)' },
    { label: 'In Progress', count: inProgress.length, icon: <Clock size={24} />, color: 'var(--primary)', bg: 'var(--primary-glow)' },
    { label: 'Completed', count: completed.length, icon: <CheckCircle size={24} />, color: 'var(--success)', bg: 'var(--success-bg)' },
  ];

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTask(taskToDelete);
      setTaskToDelete(null);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <h1 style={{ marginBottom: '32px', fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px' }}>My Dashboard</h1>

      {/* Summary Cards */}
      <motion.div 
        variants={container} 
        initial="hidden" 
        animate="show"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '48px' }}
      >
        {summaryCards.map((card) => (
          <motion.div key={card.label} variants={item} style={{
            backgroundColor: 'var(--bg-surface)',
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            cursor: 'default'
          }}
          whileHover={{ y: -4, boxShadow: 'var(--shadow-md)' }}
          >
            <div style={{ backgroundColor: card.bg, color: card.color, padding: '16px', borderRadius: '16px' }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{card.count}</div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 500 }}>{card.label} Tasks</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Assigned to Me</h2>
      </div>
      
      {(!tasks || tasks.filter(t => t.assignedTo?._id === dbUser?._id).length === 0) ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-strong)', marginBottom: '40px' }}>
          <CheckCircle size={48} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
          <p style={{ fontSize: '16px', fontWeight: 500 }}>You're all caught up!</p>
          <p style={{ fontSize: '14px', marginTop: '4px' }}>You don't have any tasks assigned to you right now.</p>
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          {tasks.filter(t => t.assignedTo?._id === dbUser?._id).map(task => (
            <motion.div key={task._id} variants={item}>
              <TaskCard 
                task={task} 
                onStatusUpdate={refetch} 
                onDelete={(id) => setTaskToDelete(id)} 
                onClick={setSelectedTask} 
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Admin Managed Tasks Section */}
      {tasks && tasks.filter(t => t.assignedTo?._id !== dbUser?._id).length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-subtle)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Projects You Manage (Admin)</h2>
          </div>
          
          <motion.div variants={container} initial="hidden" animate="show" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {tasks.filter(t => t.assignedTo?._id !== dbUser?._id).map(task => (
              <motion.div key={task._id} variants={item}>
                <TaskCard 
                  task={task} 
                  onStatusUpdate={refetch} 
                  onDelete={(id) => setTaskToDelete(id)} 
                  onClick={setSelectedTask} 
                />
              </motion.div>
            ))}
          </motion.div>
        </>
      )}

      <ConfirmModal
        isOpen={!!taskToDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        isDanger={true}
        onConfirm={handleDeleteTask}
        onCancel={() => setTaskToDelete(null)}
      />

      <TaskDetailsModal 
        task={selectedTask} 
        onClose={() => setSelectedTask(null)} 
      />
    </motion.div>
  );
};

export default Dashboard;
