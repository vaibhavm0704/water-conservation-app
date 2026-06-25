// AquaEstate Auth Service
// TODO: Replace all mock implementations with FastAPI backend calls

import { CONFIG } from '../../../config/config';
import type { User, LoginResponse, UserRole } from '../types/authTypes';

const MOCK_USER_DATA: Record<string, User> = {
  [CONFIG.MOCK_USERS.ESTATE_ADMIN.email]: {
    id: 'usr_ea_001',
    name: 'Rajesh Sharma',
    email: CONFIG.MOCK_USERS.ESTATE_ADMIN.email,
    phone: '+91 98765 43210',
    role: 'estate_admin',
    estateName: 'Greenville Heights',
    flatNumber: 'A-101',
    avatar: '',
  },
  [CONFIG.MOCK_USERS.FACILITY_ADMIN.email]: {
    id: 'usr_fa_001',
    name: 'Priya Patel',
    email: CONFIG.MOCK_USERS.FACILITY_ADMIN.email,
    phone: '+91 98765 43211',
    role: 'facility_admin',
    estateName: 'Greenville Heights',
    flatNumber: 'B-201',
    avatar: '',
  },
  [CONFIG.MOCK_USERS.RESIDENT.email]: {
    id: 'usr_res_001',
    name: 'Ankit Verma',
    email: CONFIG.MOCK_USERS.RESIDENT.email,
    phone: '+91 98765 43212',
    role: 'resident',
    estateName: 'Greenville Heights',
    flatNumber: 'C-304',
    avatar: '',
  },
};

/**
 * Simulate network delay
 */
const delay = (ms: number = 800): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Login user with email and password
 * TODO: POST /api/v1/auth/login
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  await delay(800);

  const normalizedEmail = email.toLowerCase().trim();

  // Check against mock users
  const mockUsers = CONFIG.MOCK_USERS;
  let matchedRole: UserRole | null = null;

  if (
    normalizedEmail === mockUsers.ESTATE_ADMIN.email &&
    password === mockUsers.ESTATE_ADMIN.password
  ) {
    matchedRole = 'estate_admin';
  } else if (
    normalizedEmail === mockUsers.FACILITY_ADMIN.email &&
    password === mockUsers.FACILITY_ADMIN.password
  ) {
    matchedRole = 'facility_admin';
  } else if (
    normalizedEmail === mockUsers.RESIDENT.email &&
    password === mockUsers.RESIDENT.password
  ) {
    matchedRole = 'resident';
  }

  if (matchedRole && MOCK_USER_DATA[normalizedEmail]) {
    return {
      success: true,
      user: MOCK_USER_DATA[normalizedEmail],
      token: `mock_jwt_${matchedRole}_${Date.now()}`,
    };
  }

  throw new Error('Invalid email or password. Please try again.');
};

/**
 * Send OTP to user's email for password reset
 * TODO: POST /api/v1/auth/forgot-password
 */
export const sendOtp = async (email: string): Promise<boolean> => {
  await delay(800);

  const normalizedEmail = email.toLowerCase().trim();
  const validEmails = Object.values(CONFIG.MOCK_USERS).map((u) => u.email);

  if (!validEmails.includes(normalizedEmail)) {
    throw new Error('No account found with this email address.');
  }

  // Mock: OTP sent successfully
  return true;
};

/**
 * Verify OTP code
 * TODO: POST /api/v1/auth/verify-otp
 */
export const verifyOtp = async (
  email: string,
  otp: string
): Promise<boolean> => {
  await delay(600);

  // Mock: accept '123456' as valid OTP
  if (otp === '123456') {
    return true;
  }

  throw new Error('Invalid OTP. Please try again.');
};

/**
 * Reset password with verified OTP
 * TODO: POST /api/v1/auth/reset-password
 */
export const resetPassword = async (
  _email: string,
  _otp: string,
  _newPassword: string
): Promise<boolean> => {
  await delay(800);

  // Mock: password reset successful
  return true;
};
