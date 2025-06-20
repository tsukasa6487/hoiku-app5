// Authentication type definitions for the childcare worker support app

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  assigned_class?: string;
  role?: UserRole;
  email_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AuthSession {
  user: AuthUser;
  access_token: string;
  refresh_token?: string;
  expires_at: Date;
  session_id: string;
}

export interface LoginForm {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirm_password: string;
  name: string;
  assigned_class?: string;
}

export interface ResetPasswordForm {
  email: string;
}

export interface ChangePasswordForm {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export type UserRole = 'teacher' | 'admin' | 'supervisor';

export interface AuthError {
  message: string;
  code?: string;
  field?: string;
}

export interface AuthResponse<T = unknown> {
  data?: T;
  error?: AuthError;
  success: boolean;
}