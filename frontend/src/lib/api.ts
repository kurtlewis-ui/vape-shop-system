import axios from 'axios';
import { useAuthStore } from './store';

/**
 * Pre-configured axios instance pointed at the NestJS backend.
 * - baseURL comes from NEXT_PUBLIC_API_URL (falls back to localhost:4000).
 * - withCredentials lets the browser send/receive the refresh-token cookie.
 */
/**
 * Resolve the API base URL. Accepts either a full base that already includes
 * the `/api/v1` prefix, or just the server origin (e.g. http://localhost:4000)
 * in which case we append the prefix. This keeps it working regardless of how
 * NEXT_PUBLIC_API_URL is set.
 */
function resolveBaseUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/+$/, '');
  return /\/api\/v\d+$/.test(raw) ? raw : `${raw}/api/v1`;
}

export const api = axios.create({
  baseURL: resolveBaseUrl(),
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
    const data: any = error.response?.data;
    // Surface the specific validation detail(s) instead of a generic message.
    const details = data?.error?.details;
    if (Array.isArray(details) && details.length) {
      const msg = details
        .map((d: any) => d?.message)
        .filter(Boolean)
        .join('; ');
      if (msg) return msg;
    }
    return (
      data?.error?.message ||
      data?.message ||
      error.message ||
      fallback
    );
  }
  return fallback;
}
