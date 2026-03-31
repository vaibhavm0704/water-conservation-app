import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { Colors } from '../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

interface CustomTextInputProps extends TextInputProps {
  label: string;
  error?: string;
  isPassword?: boolean;
}

export function CustomTextInput({
  label,
  error,
  isPassword,
  style,
  ...rest
}: CustomTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputFocused,
        error ? styles.inputError : null,
      ]}>
        <TextInput
          style={[styles.input, style]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={Colors.textSecondary}
          secureTextEntry={isPassword && !showPassword}
          {...rest}
        />
        {isPassword && (
          <Ionicons 
            name={showPassword ? 'eye-off' : 'eye'} 
            size={20} 
            color={Colors.textSecondary} 
            onPress={() => setShowPassword(!showPassword)}
            style={styles.icon}
          />
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    minHeight: 52,
  },
  inputFocused: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  inputError: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
  },
  icon: {
    padding: 12,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 6,
  }
});
