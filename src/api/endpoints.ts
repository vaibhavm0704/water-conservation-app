// AquaEstate API Endpoints
// TODO: Update endpoints to match FastAPI router paths

export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_OTP: '/auth/verify-otp',
    REFRESH_TOKEN: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },

  // Estate Admin
  ESTATE: {
    DASHBOARD: '/estate/dashboard',
    RESIDENTS: '/estate/residents',
    RESIDENT_DETAIL: (id: string) => `/estate/residents/${id}`,
    BLOCKS: '/estate/blocks',
    FLATS: '/estate/flats',
    REPORTS: '/estate/reports',
    NOTICES: '/estate/notices',
    SETTINGS: '/estate/settings',
    ANALYTICS: '/estate/analytics',
  },

  // Facility Admin
  FACILITY: {
    DASHBOARD: '/facility/dashboard',
    COMPLAINTS: '/facility/complaints',
    COMPLAINT_DETAIL: (id: string) => `/facility/complaints/${id}`,
    NOTICES: '/facility/notices',
    STAFF: '/facility/staff',
    MAINTENANCE: '/facility/maintenance',
  },

  // Resident
  RESIDENT: {
    HOME: '/resident/home',
    USAGE: '/resident/usage',
    USAGE_DAILY: '/resident/usage/daily',
    USAGE_WEEKLY: '/resident/usage/weekly',
    USAGE_MONTHLY: '/resident/usage/monthly',
    COMPLAINTS: '/resident/complaints',
    COMPLAINT_DETAIL: (id: string) => `/resident/complaints/${id}`,
    BILLS: '/resident/bills',
    BILL_DOWNLOAD: (id: string) => `/resident/bills/${id}/download`,
    PROFILE: '/resident/profile',
    TIPS: '/resident/tips',
  },

  // Common
  NOTIFICATIONS: '/notifications',
  UPLOAD: '/upload',
};
