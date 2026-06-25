// AquaEstate Theme Constants
// Water-inspired design system

export const COLORS = {
  // Primary palette
  primary: '#2563EB',
  primaryLight: '#3B82F6',
  primaryDark: '#1D4ED8',
  
  // Ocean palette
  ocean: '#0EA5E9',
  oceanLight: '#38BDF8',
  oceanDark: '#0284C7',
  
  // Deep water
  deepWater: '#1E3A8A',
  deepWaterLight: '#1E40AF',
  
  // Aqua
  lightAqua: '#DBEAFE',
  aquaMist: '#E0F2FE',
  
  // Accent
  mint: '#22C55E',
  mintLight: '#4ADE80',
  cyan: '#06B6D4',
  cyanLight: '#22D3EE',
  
  // Backgrounds
  background: '#F8FAFC',
  card: '#FFFFFF',
  cardAlt: '#F1F5F9',
  surface: '#F1F5F9',
  
  // Text
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  textWhite: '#FFFFFF',
  textLink: '#2563EB',
  
  // Status
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#0EA5E9',
  infoLight: '#E0F2FE',
  
  // Borders
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  
  // Shadows
  shadow: '#0F172A',
  
  // Overlay
  overlay: 'rgba(15, 23, 42, 0.5)',
  
  // Gradients
  gradientStart: '#2563EB',
  gradientEnd: '#0EA5E9',
  gradientWaterStart: '#0EA5E9',
  gradientWaterEnd: '#06B6D4',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 999,
};

export const SHADOWS = {
  small: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const FONT_FAMILY = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semiBold: 'Poppins_600SemiBold',
};

export const FONT_SIZE = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  title: 32,
  hero: 40,
};

export const TYPOGRAPHY = {
  hero: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.hero,
    color: COLORS.textPrimary,
  },
  title: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.title,
    color: COLORS.textPrimary,
  },
  h1: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xxxl,
    color: COLORS.textPrimary,
  },
  h2: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xxl,
    color: COLORS.textPrimary,
  },
  h3: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xl,
    color: COLORS.textPrimary,
  },
  body: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  bodyMedium: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
  },
  caption: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
  },
  label: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  button: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textWhite,
  },
  small: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
  },
};
