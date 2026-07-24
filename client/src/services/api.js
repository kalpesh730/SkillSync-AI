import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
});

// Avoid circular dependency by injecting store or using dynamic import if necessary, 
// but typically with Zustand we can just import the store directly if we use it inside the function callback.
import { useAuthStore } from '../store/authStore.js';

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/login' && originalRequest.url !== '/auth/refresh-token') {
      originalRequest._retry = true;
      
      try {
        await useAuthStore.getState().refreshSession();
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout(true); // logout on fail
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
