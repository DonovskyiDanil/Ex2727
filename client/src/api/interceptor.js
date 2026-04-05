import axios from 'axios';
import CONSTANTS from '../constants';

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : '/api',
  timeout: 10000, // Add timeout to prevent hanging requests
});

instance.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem(CONSTANTS.ACCESS_TOKEN);
    
    // Добавляем токен только если он реально существует и не является строкой "null"
    if (token && token !== 'null' && token !== 'undefined') {
      config.headers.Authorization = token;
    }
    
    return config;
  },
  (err) => Promise.reject(err)
);

instance.interceptors.response.use(
  (response) => response,
  (err) => {
    // Если сервер ответил 401, значит токен протух — удаляем его
    if (err.response && err.response.status === 401) {
      // Удаляем токен только если он есть в localStorage
      const existingToken = window.localStorage.getItem(CONSTANTS.ACCESS_TOKEN);
      if (existingToken && existingToken !== 'null' && existingToken !== 'undefined') {
        window.localStorage.removeItem(CONSTANTS.ACCESS_TOKEN);
        // Optional: redirect to login page or show a message
        console.warn('[API] Token expired, user will need to re-authenticate');
      }
    }
    
    // Handle network errors
    if (!err.response && err.code === 'ECONNREFUSED') {
      console.error('[API] Server connection refused. Make sure the backend is running on port 5001.');
    } else if (!err.response && err.code === 'ERR_NETWORK') {
      console.error('[API] Network error. Check your connection to the server.');
    }
    
    return Promise.reject(err);
  }
);

export default instance;
