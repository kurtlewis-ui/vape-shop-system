// Shared types describing the backend API responses.

export interface Role {
  id: string;
  name: string;
}

// Returned by GET /users/roles (used to populate the "add staff" role select).
export interface RoleOption {
  id: string;
  name: string;
  description?: string | null;
}

// A short branch summary embedded on the auth user / user list rows.
export interface BranchRef {
  id: string;
  name: string;
}

// The full branch object returned by GET /branches and /branches/:id.
export interface Branch {
  id: string;
  name: string;
  address: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  staffCount: number;
}

// The user object returned by POST /auth/login.
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  branch?: BranchRef | null;
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
  branchId: string | null;
  branch: BranchRef | null;
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
