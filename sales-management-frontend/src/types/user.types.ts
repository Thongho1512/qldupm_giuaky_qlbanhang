// User Request (for admin create/update)
export interface UserRequest {
  username: string;
  password?: string; // Optional for updates
  email: string;
  fullName?: string;
  phone?: string;
  role?: string; // "CUSTOMER" | "ADMIN"
  status?: string; // "ACTIVE" | "INACTIVE" | "BANNED"
}

// User State (for admin management)
export interface UserManagementState {
  users: import('./auth.types').User[];
  selectedUser: import('./auth.types').User | null;
  totalPages: number;
  totalElements: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
}