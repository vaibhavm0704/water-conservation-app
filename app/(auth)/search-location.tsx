import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { CustomButton } from '../../components/CustomButton';
import { CustomTextInput } from '../../components/CustomTextInput';
import { NavigationHeader } from '../../components/NavigationHeader';
import MapViewComponent from '../../components/MapViewComponent';

export default function SearchLocationScreen() {
  const router = useRouter();

  const handleNext = () => {
    router.push('/(auth)/add-residents');
  };

  return (
    <View style={styles.container}>
      <NavigationHeader />
      
      <View style={styles.header}>
        <Text style={styles.title}>Pin Your Location</Text>
        <Text style={styles.subtitle}>Drag the map to accurately place your estate pin for meter readings.</Text>
      </View>

      <View style={styles.searchContainer}>
        <CustomTextInput 
          label="" 
          placeholder="Search location..." 
          style={styles.searchInput}
        />
      </View>

      <View style={styles.mapContainer}>
        <MapViewComponent />
      </View>

      <View style={styles.footer}>
        <CustomButton 
          title="Confirm Location" 
          onPress={handleNext}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 24,
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
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: -10, // Adjust overlap slightly
    zIndex: 10,
    position: 'relative',
  },
  searchInput: {
    paddingVertical: 10,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 10,
  }
});
