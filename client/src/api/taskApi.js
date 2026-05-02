import axiosInstance from './axiosInstance';

export const createTask = async (taskData) => {
  const res = await axiosInstance.post('/tasks', taskData);
  return res.data;
};

export const fetchTasksByProject = async (projectId) => {
  const res = await axiosInstance.get(`/tasks/project/${projectId}`);
  return res.data;
};

export const fetchMyTasks = async () => {
  const res = await axiosInstance.get('/tasks/my-tasks');
  return res.data;
};

export const updateTaskStatus = async (taskId, status) => {
  const res = await axiosInstance.patch(`/tasks/${taskId}/status`, { status });
  return res.data;
};

export const deleteTask = async (taskId) => {
  const res = await axiosInstance.delete(`/tasks/${taskId}`);
  return res.data;
};
