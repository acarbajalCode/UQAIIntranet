import axios from 'axios';
import Cookies from 'js-cookie';

//const API_URL = 'http://localhost:8080/api';
 const API_URL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : "http://localhost:8080/api";


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor: Extrae de forma automática la cookie unificada del examen
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token'); // <--- CORREGIDO: Ahora coincide exactamente con tu guía
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;