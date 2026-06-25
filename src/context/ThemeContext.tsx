// AquaEstate Theme Context
// Provides theme constants throughout the app

import React, { createContext, useContext, type ReactNode } from 'react';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  FONT_FAMILY,
  FONT_SIZE,
  TYPOGRAPHY,
} from '../shared/constants/theme';

interface ThemeContextType {
  colors: typeof COLORS;
  spacing: typeof SPACING;
  borderRadius: typeof BORDER_RADIUS;
  shadows: typeof SHADOWS;
  fontFamily: typeof FONT_FAMILY;
  fontSize: typeof FONT_SIZE;
  typography: typeof TYPOGRAPHY;
}

const themeValue: ThemeContextType = {
  colors: COLORS,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  fontFamily: FONT_FAMILY,
  fontSize: FONT_SIZE,
  typography: TYPOGRAPHY,
};

const ThemeContext = createContext<ThemeContextType>(themeValue);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
  );
};

/**
 * Hook to access the app's theme constants
 */
export const useTheme = (): ThemeContextType => {
  return useContext(ThemeContext);
};
