import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8080' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Los endpoints protegidos responden 403 con token faltante o inválido
    if (error.response?.status === 403 && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export function errorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.detail ?? 'Error de conexión con el servidor';
  }
  return 'Error inesperado';
}

export default api;