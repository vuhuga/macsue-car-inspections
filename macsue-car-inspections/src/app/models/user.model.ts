export interface User {
  id?: number;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  password?: string;
  isAdmin?: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  fullName: string;
  phone: string;
}