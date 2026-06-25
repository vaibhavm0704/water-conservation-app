import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import {
  COLORS,
  SPACING,
  FONT_FAMILY,
  FONT_SIZE,
} from '../constants/theme';

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.ocean} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.massive,
  },
  message: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.textTertiary,
    marginTop: SPACING.lg,
    textAlign: 'center',
  },
});

export default LoadingState;
