import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { CustomButton } from '../../components/CustomButton';
import { CustomTextInput } from '../../components/CustomTextInput';
import { NavigationHeader } from '../../components/NavigationHeader';

const ESTATE_TYPES = ['Apartment Complex', 'Gated Community', 'Subdivision', 'Other'];

export default function EstateDetailsScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string>('Apartment Complex');

  const handleNext = () => {
    router.push('/(auth)/add-address');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <NavigationHeader />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Estate Details</Text>
          <Text style={styles.subtitle}>Help us understand your property to configure the best metrics.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionLabel}>Estate Type</Text>
          <View style={styles.pillsContainer}>
            {ESTATE_TYPES.map((type) => {
              const isActive = selectedType === type;
              return (
                <TouchableOpacity
                  key={type}
                  style={[styles.pill, isActive && styles.pillActive]}
                  onPress={() => setSelectedType(type)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <CustomTextInput
            label="Estate Name"
            placeholder="e.g. Green Valley Residences"
          />
          
          <CustomTextInput
            label="Number of Units / Homes"
            placeholder="e.g. 150"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.footer}>
          <CustomButton 
            title="Continue to Address" 
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
  sectionLabel: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 12,
    fontWeight: '600',
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  pillText: {
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  pillTextActive: {
    color: Colors.primaryDark,
    fontWeight: '600',
  },
  form: {
    flex: 1,
  },
  footer: {
    marginTop: 20,
  }
});
