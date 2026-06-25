// AquaEstate Configuration
// TODO: Replace with actual FastAPI backend URL

export const CONFIG = {
  // TODO: Replace with FastAPI backend URL
  API_BASE_URL: 'http://localhost:8000/api/v1',
  API_TIMEOUT: 10000,

  // App metadata
  APP_NAME: 'AquaEstate',
  APP_TAGLINE: 'Save Water, Build Sustainable Communities',
  APP_VERSION: '1.0.0',

  // Feature flags
  FEATURES: {
    ENABLE_NOTIFICATIONS: true,
    ENABLE_IMAGE_UPLOAD: true,
    ENABLE_CHARTS: true,
    ENABLE_EXPORT: false, // TODO: Enable when backend supports PDF/Excel export
  },

  // Storage keys
  STORAGE_KEYS: {
    AUTH_TOKEN: '@aquaestate_auth_token',
    USER_DATA: '@aquaestate_user_data',
    ONBOARDING_COMPLETE: '@aquaestate_onboarding_complete',
    THEME_PREFERENCE: '@aquaestate_theme_preference',
    NOTIFICATION_PREFS: '@aquaestate_notification_prefs',
  },

  // Mock auth credentials
  MOCK_USERS: {
    ESTATE_ADMIN: {
      email: 'admin@greenville.com',
      password: 'admin123',
      role: 'estate_admin' as const,
    },
    FACILITY_ADMIN: {
      email: 'facility@greenville.com',
      password: 'facility123',
      role: 'facility_admin' as const,
    },
    RESIDENT: {
      email: 'resident@greenville.com',
      password: 'resident123',
      role: 'resident' as const,
    },
  },
};
