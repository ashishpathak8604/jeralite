import axiosInstance from './axiosInstance';

export const createProject = async (projectData) => {
  const res = await axiosInstance.post('/projects', projectData);
  return res.data;
};

export const fetchProjects = async () => {
  const res = await axiosInstance.get('/projects');
  return res.data;
};

export const fetchProjectById = async (id) => {
  const res = await axiosInstance.get(`/projects/${id}`);
  return res.data;
};

export const addMemberToProject = async (projectId, email) => {
  const res = await axiosInstance.post(`/projects/${projectId}/members`, { email });
  return res.data;
};

export const removeMemberFromProject = async (projectId, userId) => {
  const res = await axiosInstance.delete(`/projects/${projectId}/members/${userId}`);
  return res.data;
};
