import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: 'https://skin-diagnostic-back-end-production-2b21.up.railway.app/api/',
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
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
