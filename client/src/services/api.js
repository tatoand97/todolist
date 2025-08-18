import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (username, password) => 
    api.post('/usuarios', { username, password }),
  
  login: (username, password) => 
    api.post('/usuarios/iniciar-sesion', { username, password }),
  
  logout: () => 
    api.post('/usuarios/cerrar-sesion'),
  
  updateProfile: (data) => 
    api.put('/usuarios/perfil', data),
};

export const categoriesAPI = {
  getAll: () => api.get('/categorias'),
  create: (data) => api.post('/categorias', data),
  update: (id, data) => api.put(`/categorias/${id}`, data),
  delete: (id) => api.delete(`/categorias/${id}`),
};

export const tasksAPI = {
  getByUser: (params = {}) => api.get('/tareas/usuario', { params }),
  create: (data) => api.post('/tareas', data),
  update: (id, data) => api.put(`/tareas/${id}`, data),
  delete: (id) => api.delete(`/tareas/${id}`),
};

export default api;