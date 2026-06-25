// AquaEstate Forgot Password Screen
// 3-step flow: Send OTP → Verify OTP → Reset Password

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
import * as authService from '../services/authService';

type Step = 'email' | 'otp' | 'reset';

interface ForgotPasswordScreenProps {
  navigation: any;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const [step, setStep] = useState<Step>('email');
  const [isLoading, setIsLoading] = useState(false);

  // Step 1
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  // Step 2
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  // Step 3
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const handleSendOtp = async () => {
    setEmailError('');
    if (!email.trim() || !email.includes('@')) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await authService.sendOtp(email.trim().toLowerCase());
      Alert.alert(
        'OTP Sent',
        'A verification code has been sent to your email.',
        [{ text: 'OK', onPress: () => setStep('otp') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setOtpError('');
    if (!otp.trim() || otp.length !== 6) {
      setOtpError('Please enter the 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      await authService.verifyOtp(email.trim().toLowerCase(), otp);
      setStep('reset');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Invalid OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setPasswordError('');
    setConfirmError('');

    let valid = true;
    if (!newPassword || newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    }
    if (newPassword !== confirmPassword) {
      setConfirmError('Passwords do not match');
      valid = false;
    }
    if (!valid) return;

    setIsLoading(true);
    try {
      await authService.resetPassword(
        email.trim().toLowerCase(),
        otp,
        newPassword
      );
      Alert.alert(
        'Password Reset',
        'Your password has been reset successfully. Please log in with your new password.',
        [
          {
            text: 'Go to Login',
            onPress: () =>
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              }),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStepTitle = (): string => {
    switch (step) {
      case 'email':
        return 'Forgot Password';
      case 'otp':
        return 'Verify OTP';
      case 'reset':
        return 'Reset Password';
    }
  };

  const getStepDescription = (): string => {
    switch (step) {
      case 'email':
        return 'Enter your registered email and we\'ll send you a verification code.';
      case 'otp':
        return 'Enter the 6-digit code sent to your email. (Use 123456 for demo)';
      case 'reset':
        return 'Create a new password for your account.';
    }
  };

  const getStepNumber = (): number => {
    switch (step) {
      case 'email':
        return 1;
      case 'otp':
        return 2;
      case 'reset':
        return 3;
    }
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
        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (step === 'otp') setStep('email');
            else if (step === 'reset') setStep('otp');
            else navigation.goBack();
          }}
          disabled={isLoading}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>

        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          {[1, 2, 3].map((num) => (
            <View key={num} style={styles.progressItem}>
              <View
                style={[
                  styles.progressCircle,
                  num <= getStepNumber()
                    ? styles.progressActive
                    : styles.progressInactive,
                ]}
              >
                {num < getStepNumber() ? (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                ) : (
                  <Text
                    style={[
                      styles.progressNumber,
                      num <= getStepNumber() && styles.progressNumberActive,
                    ]}
                  >
                    {num}
                  </Text>
                )}
              </View>
              {num < 3 && (
                <View
                  style={[
                    styles.progressLine,
                    num < getStepNumber()
                      ? styles.progressLineActive
                      : styles.progressLineInactive,
                  ]}
                />
              )}
            </View>
          ))}
        </View>

        {/* Header */}
        <Text style={styles.title}>{getStepTitle()}</Text>
        <Text style={styles.description}>{getStepDescription()}</Text>

        {/* Step 1: Email */}
        {step === 'email' && (
          <View style={styles.formSection}>
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
                editable={!isLoading}
              />
            </View>
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}

            <TouchableOpacity
              style={[styles.actionButton, isLoading && styles.actionButtonDisabled]}
              onPress={handleSendOtp}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.actionButtonText}>Send OTP</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Step 2: OTP */}
        {step === 'otp' && (
          <View style={styles.formSection}>
            <Text style={styles.inputLabel}>Verification Code</Text>
            <View
              style={[
                styles.inputWrapper,
                otpError ? styles.inputWrapperError : null,
              ]}
            >
              <Ionicons
                name="keypad-outline"
                size={20}
                color={COLORS.textTertiary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter 6-digit OTP"
                placeholderTextColor={COLORS.textTertiary}
                value={otp}
                onChangeText={(text) => {
                  setOtp(text.replace(/[^0-9]/g, '').slice(0, 6));
                  if (otpError) setOtpError('');
                }}
                keyboardType="number-pad"
                maxLength={6}
                editable={!isLoading}
              />
            </View>
            {otpError ? (
              <Text style={styles.errorText}>{otpError}</Text>
            ) : null}

            <TouchableOpacity
              style={[styles.actionButton, isLoading && styles.actionButtonDisabled]}
              onPress={handleVerifyOtp}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.actionButtonText}>Verify</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleSendOtp}
              disabled={isLoading}
            >
              <Text style={styles.resendText}>Resend Code</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 3: Reset Password */}
        {step === 'reset' && (
          <View style={styles.formSection}>
            <Text style={styles.inputLabel}>New Password</Text>
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
                placeholder="Enter new password"
                placeholderTextColor={COLORS.textTertiary}
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  if (passwordError) setPasswordError('');
                }}
                secureTextEntry
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}

            <View style={styles.inputSpacer} />

            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View
              style={[
                styles.inputWrapper,
                confirmError ? styles.inputWrapperError : null,
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
                placeholder="Confirm new password"
                placeholderTextColor={COLORS.textTertiary}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (confirmError) setConfirmError('');
                }}
                secureTextEntry
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
            {confirmError ? (
              <Text style={styles.errorText}>{confirmError}</Text>
            ) : null}

            <TouchableOpacity
              style={[styles.actionButton, isLoading && styles.actionButtonDisabled]}
              onPress={handleResetPassword}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.actionButtonText}>Reset Password</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
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
    paddingTop: 60,
    paddingBottom: SPACING.xxxl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xxl,
    ...SHADOWS.small,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xxxl,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressActive: {
    backgroundColor: COLORS.primary,
  },
  progressInactive: {
    backgroundColor: COLORS.border,
  },
  progressNumber: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
  },
  progressNumberActive: {
    color: '#FFFFFF',
  },
  progressLine: {
    width: 40,
    height: 2,
    marginHorizontal: SPACING.xs,
  },
  progressLineActive: {
    backgroundColor: COLORS.primary,
  },
  progressLineInactive: {
    backgroundColor: COLORS.border,
  },
  title: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xxxl,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  description: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.xxxl,
  },
  formSection: {
    marginTop: SPACING.sm,
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
  errorText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.xs,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
  inputSpacer: {
    height: SPACING.lg,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xxl,
    ...SHADOWS.medium,
  },
  actionButtonDisabled: {
    opacity: 0.7,
  },
  actionButtonText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: '#FFFFFF',
  },
  resendButton: {
    alignSelf: 'center',
    marginTop: SPACING.lg,
    padding: SPACING.sm,
  },
  resendText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
  },
});

export default ForgotPasswordScreen;
