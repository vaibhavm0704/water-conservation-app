import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../../constants/Colors';
import { CustomButton } from '../../components/CustomButton';
import { CustomTextInput } from '../../components/CustomTextInput';
import { NavigationHeader } from '../../components/NavigationHeader';

export default function AddResidentsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'individual' | 'bulk'>('individual');

  const handleFinish = () => {
    // End of onboarding! Navigate to the main dashboard
    router.replace('/(main)/dashboard');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <NavigationHeader />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Your Residents</Text>
          <Text style={styles.subtitle}>Onboard residents so they can start tracking their water usage.</Text>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'individual' && styles.activeTab]}
            onPress={() => setActiveTab('individual')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'individual' && styles.activeTabText]}>Individual</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'bulk' && styles.activeTab]}
            onPress={() => setActiveTab('bulk')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'bulk' && styles.activeTabText]}>Bulk Import</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          {activeTab === 'individual' ? (
            <>
              <CustomTextInput
                label="Full Name"
                placeholder="Jane Doe"
              />
              <CustomTextInput
                label="Email Address"
                placeholder="jane@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <CustomTextInput
                label="Unit Number"
                placeholder="e.g. 104A"
              />
              <CustomButton 
                title="Add Another Resident" 
                onPress={() => {}}
                type="outline"
                style={styles.addMoreBtn}
              />
            </>
          ) : (
            <View style={styles.uploadContainer}>
              <View style={styles.uploadCircle}>
                <Ionicons name="cloud-upload-outline" size={40} color={Colors.primary} />
              </View>
              <Text style={styles.uploadTitle}>Import from CSV</Text>
              <Text style={styles.uploadSubtitle}>Upload a file containing resident details</Text>
              <CustomButton 
                title="Browse Files" 
                onPress={() => {}}
                type="secondary"
                style={styles.browseBtn}
              />
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <CustomButton 
            title="Complete Setup" 
            onPress={handleFinish}
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
    marginBottom: 20,
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
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#EEF2F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 30,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.text,
  },
  form: {
    flex: 1,
  },
  addMoreBtn: {
    marginTop: 10,
    borderStyle: 'dashed',
  },
  uploadContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  uploadCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  browseBtn: {
    paddingHorizontal: 30,
    minHeight: 46,
  },
  footer: {
    marginTop: 20,
  }
});
