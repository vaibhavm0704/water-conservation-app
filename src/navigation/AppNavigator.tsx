// AquaEstate App Navigator (Root)
// Routes to AuthNavigator or role-based navigator based on auth state

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { COLORS } from '../shared/constants/theme';

import AuthNavigator from './AuthNavigator';
import EstateAdminNavigator from './EstateAdminNavigator';
import FacilityAdminNavigator from './FacilityAdminNavigator';
import ResidentNavigator from './ResidentNavigator';

const AppNavigator: React.FC = () => {
  const { isAuthenticated, role, isLoading } = useAuth();

  // Show loader while auth state is being restored
  if (isLoading && !isAuthenticated) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const getAuthenticatedNavigator = () => {
    switch (role) {
      case 'estate_admin':
        return <EstateAdminNavigator />;
      case 'facility_admin':
        return <FacilityAdminNavigator />;
      case 'resident':
        return <ResidentNavigator />;
      default:
        return <AuthNavigator />;
    }
  };

  return (
    <NavigationContainer>
      {isAuthenticated ? getAuthenticatedNavigator() : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
});

export default AppNavigator;
