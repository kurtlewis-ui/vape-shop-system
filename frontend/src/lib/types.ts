// Shared types describing the backend API responses.

export interface Role {
  id: string;
  name: string;
}

// The user object returned by POST /auth/login.
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  mustChangePassword?: boolean;
}

// A user row returned by GET /users.
export interface UserListItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  isActive: boolean;
  isLocked: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  role: Role;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Every backend response is wrapped in this envelope by the TransformInterceptor.
export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  pagination?: Pagination;
  meta?: {
    timestamp: string;
    requestId: string;
  };
  error?: {
    code: string;
    message: string;
  };
}
