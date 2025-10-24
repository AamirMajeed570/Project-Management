import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Auth
export const register = (data: any) => API.post('/auth/register', data);
export const login = (data: any) => API.post('/auth/login', data);
export const getProfile = (token: string) =>
  API.get('/auth/profile', { headers: { Authorization: `Bearer ${token}` } });
export const getUserProjects = (token: string, params?: { status?: string; search?: string; sort?: string; page?: number; limit?: number }) => {
  const config: any = { headers: { Authorization: `Bearer ${token}` } };
  if (params) config.params = params;
  return API.get('/project', config);
};

export const getProjectById = (id: string, token: string) =>
  API.get(`/projects/${id}`, { headers: { Authorization: `Bearer ${token}` } });

export const getTasksByProject = (projectId: string, token: string) =>
  API.get(`/task/project/${projectId}`, { headers: { Authorization: `Bearer ${token}` } });
// Users
export const getUsers = () => API.get('/users');

// Projects
export const getProjects = (token:any) => 
    API.get('/project',{headers: { Authorization: `Bearer ${token}` }});

export const createProject = (data: any) => API.post('/projects', data);

// Tasks
export const getTasks = () => API.get('/tasks');
export const createTask = (data: any) => API.post('/tasks', data);
