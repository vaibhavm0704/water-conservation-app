// AquaEstate Auth Types

export type UserRole = 'estate_admin' | 'facility_admin' | 'resident';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  estateName: string;
  flatNumber: string;
  avatar: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user: User;
  token: string;
  message?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface OtpVerifyRequest {
  email: string;
  otp: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: UserRole | null;
}
