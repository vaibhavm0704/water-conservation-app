import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  FONT_FAMILY,
  FONT_SIZE,
} from '../constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  style,
}) => {
  const isDisabled = disabled || loading;

  const variantStyles: Record<ButtonVariant, { container: ViewStyle; text: TextStyle; loaderColor: string }> = {
    primary: {
      container: {
        backgroundColor: COLORS.primary,
        ...SHADOWS.medium,
      },
      text: { color: COLORS.textWhite },
      loaderColor: COLORS.textWhite,
    },
    secondary: {
      container: {
        backgroundColor: COLORS.lightAqua,
      },
      text: { color: COLORS.primary },
      loaderColor: COLORS.primary,
    },
    outline: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: COLORS.primary,
      },
      text: { color: COLORS.primary },
      loaderColor: COLORS.primary,
    },
    danger: {
      container: {
        backgroundColor: COLORS.error,
        ...SHADOWS.medium,
      },
      text: { color: COLORS.textWhite },
      loaderColor: COLORS.textWhite,
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <TouchableOpacity
      style={[
        styles.container,
        currentVariant.container,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator size="small" color={currentVariant.loaderColor} />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={18}
              color={currentVariant.text.color as string}
              style={styles.icon}
            />
          )}
          <Text style={[styles.text, currentVariant.text]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    borderRadius: BORDER_RADIUS.xl,
    minHeight: 50,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    letterSpacing: 0.3,
  },
  icon: {
    marginRight: SPACING.sm,
  },
});

export default AppButton;
