// AquaEstate Login Screen
// Email/password login with mock credentials hint

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  FONT_FAMILY,
  FONT_SIZE,
} from '../../../shared/constants/theme';
import { CONFIG } from '../../../config/config';
import { useAuth } from '../../../context/AuthContext';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validate = (): boolean => {
    let valid = true;
    setEmailError('');
    setPasswordError('');

    if (!email.trim()) {
      setEmailError('Email is required');
      valid = false;
    } else if (!email.includes('@')) {
      setEmailError('Please enter a valid email');
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 5) {
      setPasswordError('Password must be at least 5 characters');
      valid = false;
    }

    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      await login(email.trim().toLowerCase(), password);
      // Navigation is handled by AppNavigator based on auth state
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Something went wrong.');
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Water drop icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="water" size={56} color={COLORS.primary} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        {/* Email input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <View
            style={[
              styles.inputWrapper,
              emailError ? styles.inputWrapperError : null,
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={20}
              color={COLORS.textTertiary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={COLORS.textTertiary}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
        </View>

        {/* Password input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Password</Text>
          <View
            style={[
              styles.inputWrapper,
              passwordError ? styles.inputWrapperError : null,
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={COLORS.textTertiary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={COLORS.textTertiary}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError('');
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!isLoading}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={COLORS.textTertiary}
              />
            </TouchableOpacity>
          </View>
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
        </View>

        {/* Forgot password */}
        <TouchableOpacity
          style={styles.forgotButton}
          onPress={handleForgotPassword}
          disabled={isLoading}
        >
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Sign In button */}
        <TouchableOpacity
          style={[styles.signInButton, isLoading && styles.signInButtonDisabled]}
          onPress={handleLogin}
          activeOpacity={0.85}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.signInButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Contact admin */}
        <View style={styles.contactContainer}>
          <Text style={styles.contactText}>Having trouble? </Text>
          <TouchableOpacity>
            <Text style={styles.contactLink}>Contact Estate Administrator</Text>
          </TouchableOpacity>
        </View>

        {/* Mock credentials hint */}
        <View style={styles.hintCard}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={COLORS.info}
            style={styles.hintIcon}
          />
          <View style={styles.hintContent}>
            <Text style={styles.hintTitle}>Demo Credentials</Text>
            <Text style={styles.hintText}>
              Admin: {CONFIG.MOCK_USERS.ESTATE_ADMIN.email} / {CONFIG.MOCK_USERS.ESTATE_ADMIN.password}
            </Text>
            <Text style={styles.hintText}>
              Facility: {CONFIG.MOCK_USERS.FACILITY_ADMIN.email} / {CONFIG.MOCK_USERS.FACILITY_ADMIN.password}
            </Text>
            <Text style={styles.hintText}>
              Resident: {CONFIG.MOCK_USERS.RESIDENT.email} / {CONFIG.MOCK_USERS.RESIDENT.password}
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xxl,
    paddingTop: 80,
    paddingBottom: SPACING.xxxl,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  title: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xxxl,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.xxxl,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
    ...SHADOWS.small,
  },
  inputWrapperError: {
    borderColor: COLORS.error,
  },
  inputIcon: {
    marginRight: SPACING.md,
  },
  input: {
    flex: 1,
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.lg,
  },
  eyeButton: {
    padding: SPACING.sm,
  },
  errorText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.xs,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.xxl,
  },
  forgotText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
  },
  signInButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xxl,
    ...SHADOWS.medium,
  },
  signInButtonDisabled: {
    opacity: 0.7,
  },
  signInButtonText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: '#FFFFFF',
  },
  contactContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.xxxl,
  },
  contactText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
  },
  contactLink: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
  },
  hintCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.infoLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.info + '30',
  },
  hintIcon: {
    marginRight: SPACING.md,
    marginTop: 2,
  },
  hintContent: {
    flex: 1,
  },
  hintTitle: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.info,
    marginBottom: SPACING.xs,
  },
  hintText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});

export default LoginScreen;
