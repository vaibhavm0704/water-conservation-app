import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { CustomButton } from '../../components/CustomButton';
import { CustomTextInput } from '../../components/CustomTextInput';
import { NavigationHeader } from '../../components/NavigationHeader';

export default function AddAddressScreen() {
  const router = useRouter();

  const handleNext = () => {
    router.push('/(auth)/search-location');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <NavigationHeader />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Locate Your Estate</Text>
          <Text style={styles.subtitle}>Where is your property managed from?</Text>
        </View>

        <View style={styles.form}>
          <CustomTextInput
            label="Street Address"
            placeholder="123 Utility Lane"
          />
          <View style={styles.row}>
            <View style={styles.flexHalf}>
              <CustomTextInput
                label="City"
                placeholder="Metropolis"
              />
            </View>
            <View style={{ width: 16 }} />
            <View style={styles.flexHalf}>
              <CustomTextInput
                label="State / Province"
                placeholder="NY"
              />
            </View>
          </View>
          <CustomTextInput
            label="Postal Code"
            placeholder="10001"
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.footer}>
          <CustomButton 
            title="Next Step" 
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
    marginTop: 10,
    marginBottom: 30,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flexHalf: {
    flex: 1,
  },
  footer: {
    marginTop: 20,
  }
});
