import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, Plus, Users, Layout } from 'lucide-react';
import useFetch from '../hooks/useFetch';
import { fetchProjectById } from '../api/projectApi';
import { fetchTasksByProject, updateTaskStatus, deleteTask } from '../api/taskApi';
import useAuth from '../hooks/useAuth';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import MemberList from '../components/MemberList';
import TaskDetailsModal from '../components/TaskDetailsModal';
import ConfirmModal from '../components/ConfirmModal';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';

const ProjectView = () => {
  const { id } = useParams();
  const { dbUser } = useAuth();
  
  const { data: project, loading: projectLoading, error: projectError, refetch: refetchProject } = useFetch(() => fetchProjectById(id), [id]);
  const { data: serverTasks, loading: tasksLoading, refetch: refetchTasks } = useFetch(() => fetchTasksByProject(id), [id]);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  
  // Local state for optimistic UI updates during drag and drop
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (serverTasks) {
      setTasks(serverTasks);
    }
  }, [serverTasks]);

  if (projectLoading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><Loader2 className="lucide-spin" size={40} color="var(--primary)" /></div>;
  if (projectError) return <div style={{ color: 'var(--danger)', padding: '20px', background: 'var(--danger-bg)' }}>Error: {projectError}</div>;
  if (!project) return <div>Project not found</div>;

  const isAdmin = project.members.some(m => m.user._id === dbUser?._id && m.role === 'admin');

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // Dropped outside a valid droppable area
    if (!destination) return;

    // Dropped in the same place
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId; // We use status as droppableId
    const oldStatus = source.droppableId;

    // Optimistic UI Update
    const draggedTask = tasks.find(t => t._id === draggableId);
    if (!draggedTask) return;

    const newTasks = tasks.map(t => {
      if (t._id === draggableId) {
        return { ...t, status: newStatus };
      }
      return t;
    });
    setTasks(newTasks);

    // Call API in background
    try {
      if (newStatus !== oldStatus) {
        await updateTaskStatus(draggableId, newStatus);
      }
    } catch (err) {
      console.error("Failed to update task status", err);
      // Revert on failure
      setTasks(serverTasks);
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTask(taskToDelete);
      refetchTasks();
      // Optimistically remove from local state
      setTasks(prev => prev.filter(t => t._id !== taskToDelete));
      setTaskToDelete(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const columns = ['Pending', 'In Progress', 'Completed'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ background: 'var(--primary-glow)', color: 'var(--primary)', padding: '8px', borderRadius: '8px' }}>
              <Layout size={24} />
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>{project.title}</h1>
          </div>
          {project.description && <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '15px' }}>{project.description}</p>}
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={() => setShowMembers(true)} style={{ display: 'flex', gap: '8px' }}>
            <Users size={18} />
            Team ({project.members.length})
          </button>
          {isAdmin && (
            <button className="btn btn-primary" onClick={() => setShowTaskModal(true)} style={{ display: 'flex', gap: '8px' }}>
              <Plus size={18} />
              Create Task
            </button>
          )}
        </div>
      </div>

      {showMembers && (
        <MemberList 
          project={project} 
          isAdmin={isAdmin} 
          onClose={() => setShowMembers(false)} 
          onUpdate={refetchProject} 
        />
      )}

      {showTaskModal && (
        <TaskModal 
          projectId={project._id} 
          members={project.members}
          onClose={() => setShowTaskModal(false)}
          onSuccess={refetchTasks}
        />
      )}

      {/* Kanban Board */}
      {tasksLoading && !serverTasks ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><Loader2 className="lucide-spin" size={40} color="var(--primary)" /></div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '16px', flex: 1, alignItems: 'flex-start' }}>
            {columns.map(status => {
              const columnTasks = tasks.filter(t => t.status === status);
              
              return (
                <div key={status} style={{
                  backgroundColor: 'var(--bg-board)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px',
                  minWidth: '340px',
                  width: '340px',
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: 'calc(100vh - 220px)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '0 4px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {status === 'Pending' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--warning)' }}></div>}
                      {status === 'In Progress' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>}
                      {status === 'Completed' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }}></div>}
                      {status}
                    </div>
                    <span style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
                      {columnTasks.length}
                    </span>
                  </div>
                  
                  <Droppable droppableId={status}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`column-drop-zone ${snapshot.isDraggingOver ? 'is-dragging-over' : ''}`}
                        style={{ overflowY: 'auto', padding: '4px', margin: '-4px', display: 'flex', flexDirection: 'column', gap: '12px' }}
                      >
                        {columnTasks.map((task, index) => (
                          <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(provided, snapshot) => (
                              <TaskCard 
                                task={task} 
                                provided={provided} 
                                snapshot={snapshot} 
                                onStatusUpdate={refetchTasks}
                                onDelete={isAdmin ? () => setTaskToDelete(task._id) : null}
                                onClick={setSelectedTask}
                              />
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        
                        {columnTasks.length === 0 && !snapshot.isDraggingOver && (
                          <div style={{ padding: '30px 20px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '13px', border: '2px dashed var(--border-subtle)', borderRadius: 'var(--radius-md)', marginTop: '8px' }}>
                            Drop tasks here
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
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

export default ProjectView;
