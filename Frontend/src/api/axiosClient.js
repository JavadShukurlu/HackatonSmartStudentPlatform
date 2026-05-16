import axios from 'axios';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * Centralized Axios instance.
 *
 * Backend developer notes:
 * - Set VITE_API_BASE_URL in `.env` to point to your API root.
 * - The request interceptor automatically attaches the JWT (if any) from
 *   localStorage under STORAGE_KEYS.TOKEN.
 * - The response interceptor unwraps `response.data` for convenience and
 *   normalizes errors so UI code can simply `try/catch` and read `err.message`.
 * - When you switch from mock to real APIs, set VITE_USE_MOCK=false.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
export const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') !== 'false';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (res) => res.data,
  (err) => {
    // Auto-logout on expired/invalid token
    if (err.response?.status === 401 && !USE_MOCK) {
      const onLoginPage = window.location.pathname === '/login';
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      if (!onLoginPage) {
        window.location.replace('/login');
      }
    }
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      'Network error';
    return Promise.reject(new Error(message));
  }
);

// Helper for mock services to simulate latency.
export const mockDelay = (data, ms = 350) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

export default axiosClient;
