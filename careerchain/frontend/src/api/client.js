import axios from 'axios';

let rawUrl = import.meta.env.VITE_API_BASE_URL;

if (!rawUrl || rawUrl === 'careerchain-backend' || rawUrl.includes('careerchain-backend/')) {
  if (typeof window !== 'undefined' && window.location.hostname.includes('onrender.com')) {
    rawUrl = 'https://careerchain-backend.onrender.com/api/v1';
  } else {
    rawUrl = 'http://localhost:8000/api/v1';
  }
}

if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
  rawUrl = `https://${rawUrl}`;
}
const API_BASE_URL = rawUrl.endsWith('/api/v1') ? rawUrl : `${rawUrl.replace(/\/+$/, '')}/api/v1`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: Attach JWT Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('careerchain_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Global error handler
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
        localStorage.removeItem('careerchain_token');
        localStorage.removeItem('careerchain_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
