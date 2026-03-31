import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { CustomButton } from '../../components/CustomButton';
import { CustomTextInput } from '../../components/CustomTextInput';
import { NavigationHeader } from '../../components/NavigationHeader';

export default function SetPasswordScreen() {
  const router = useRouter();

  const handleNext = () => {
    // Navigate to next screen in onboarding flow
    router.push('/(auth)/estate-details');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <NavigationHeader showBack={false} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Secure Your Account</Text>
          <Text style={styles.subtitle}>Set a strong password for your new estate admin account.</Text>
        </View>

        <View style={styles.form}>
          <CustomTextInput
            label="Create Password"
            placeholder="Min. 8 characters"
            isPassword
          />
          <CustomTextInput
            label="Confirm Password"
            placeholder="Re-enter password"
            isPassword
          />
        </View>

        <View style={styles.footer}>
          <CustomButton 
            title="Continue" 
            onPress={handleNext}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  footer: {
    marginTop: 20,
  }
});
