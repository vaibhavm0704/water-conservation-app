import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function MapViewComponent() {
  return (
    <View style={styles.container}>
      <Ionicons name="map-outline" size={48} color={Colors.primary} style={styles.icon} />
      <Text style={styles.title}>Map Not Available on Web</Text>
      <Text style={styles.subtitle}>
        Please run the app on an iOS or Android device using Expo Go to view the interactive map.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF2F6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  icon: {
    marginBottom: 16,
    opacity: 0.8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  }
});
