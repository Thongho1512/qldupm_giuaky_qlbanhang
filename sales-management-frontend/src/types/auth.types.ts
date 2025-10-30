// User Role
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
}

// User Status
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED',
}

// User
export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  role: string; // "CUSTOMER" | "ADMIN"
  status: string; // "ACTIVE" | "INACTIVE" | "BANNED"
  createdAt: string;
  updatedAt: string;
}

// Login Request
export interface LoginRequest {
  username: string;
  password: string;
}

// Register Request
export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  fullName: string;
  phone: string;
}

// Login Response
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: User;
}

// Refresh Token Request
export interface RefreshTokenRequest {
  refreshToken: string;
}

// Auth State
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}