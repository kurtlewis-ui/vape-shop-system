import axios from 'axios';
import { useAuthStore } from './store';

/**
 * Pre-configured axios instance pointed at the NestJS backend.
 * - baseURL comes from NEXT_PUBLIC_API_URL (falls back to localhost:4000).
 * - withCredentials lets the browser send/receive the refresh-token cookie.
 */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  withCredentials: true,
});

// Attach the bearer token (if logged in) to every request.
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is rejected, clear it so the UI can send the user back to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

// Pull a human-friendly message out of an axios error.
export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message ||
      fallback
    );
  }
  return fallback;
}
