import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/Colors';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  style?: object;
  textStyle?: object;
  disabled?: boolean;
  loading?: boolean;
  type?: 'primary' | 'secondary' | 'outline';
}

export function CustomButton({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  disabled, 
  loading,
  type = 'primary'
}: CustomButtonProps) {

  const getBackgroundColor = () => {
    if (disabled) return Colors.border;
    if (type === 'primary') return Colors.primary;
    if (type === 'secondary') return Colors.primaryLight;
    return 'transparent';
  };

  const getTextColor = () => {
    if (disabled) return Colors.textSecondary;
    if (type === 'primary') return '#FFFFFF';
    if (type === 'secondary') return Colors.primary;
    return Colors.primary;
  };

  const hasBorder = type === 'outline';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        hasBorder && styles.outlineButton,
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[
          styles.text, 
          { color: getTextColor() },
          textStyle
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  disabledButton: {
    elevation: 0,
    shadowOpacity: 0,
  }
});
