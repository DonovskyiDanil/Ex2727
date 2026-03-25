import axios from 'axios';
import CONSTANTS from '../constants';

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : '/api',
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
      window.localStorage.removeItem(CONSTANTS.ACCESS_TOKEN);
    }
    return Promise.reject(err);
  }
);

export default instance;