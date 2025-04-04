import axios from 'axios';
const baseURL = 'https://skin-diagnostic-back-end-production-2b21.up.railway.app/api/';
console.log("base : ",baseURL)
const api = axios.create({
  baseURL: baseURL,
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
