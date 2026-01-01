import axios from 'axios';
import { ADMIN_LOGIN_PATH } from '../constants/adminRoutes';

const BASE_URL =  import.meta.env.VITE_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000, 
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage (stored separately)
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access - clear auth and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on login page
      if (window.location.pathname !== ADMIN_LOGIN_PATH && window.location.pathname !== '/login') {
        window.location.href = ADMIN_LOGIN_PATH;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;