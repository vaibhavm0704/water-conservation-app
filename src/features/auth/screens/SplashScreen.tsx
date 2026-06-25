// AquaEstate Splash Screen
// Animated water ripple intro with auto-navigation

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FONT_FAMILY, FONT_SIZE, SPACING } from '../../../shared/constants/theme';
import { CONFIG } from '../../../config/config';
import { useAuth } from '../../../context/AuthContext';

const { width } = Dimensions.get('window');

interface SplashScreenProps {
  navigation: any;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const { isAuthenticated, role } = useAuth();

  // Ripple animations
  const ripple1Scale = useRef(new Animated.Value(0)).current;
  const ripple1Opacity = useRef(new Animated.Value(0.6)).current;
  const ripple2Scale = useRef(new Animated.Value(0)).current;
  const ripple2Opacity = useRef(new Animated.Value(0.6)).current;
  const ripple3Scale = useRef(new Animated.Value(0)).current;
  const ripple3Opacity = useRef(new Animated.Value(0.6)).current;

  // Logo animation
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(30)).current;

  // Tagline animation
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start ripple animations
    const createRipple = (
      scale: Animated.Value,
      opacity: Animated.Value,
      delay: number
    ) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(scale, {
              toValue: 4,
              duration: 2500,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 2500,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scale, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.6,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    };

    const rippleAnim1 = createRipple(ripple1Scale, ripple1Opacity, 0);
    const rippleAnim2 = createRipple(ripple2Scale, ripple2Opacity, 800);
    const rippleAnim3 = createRipple(ripple3Scale, ripple3Opacity, 1600);

    rippleAnim1.start();
    rippleAnim2.start();
    rippleAnim3.start();

    // Logo fade in
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(logoTranslateY, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Tagline fade in
    Animated.sequence([
      Animated.delay(800),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-navigate after 2.5s
    const timer = setTimeout(async () => {
      rippleAnim1.stop();
      rippleAnim2.stop();
      rippleAnim3.stop();

      if (isAuthenticated && role) {
        // Already logged in — go to dashboard
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
        return;
      }

      try {
        const onboardingDone = await AsyncStorage.getItem(
          CONFIG.STORAGE_KEYS.ONBOARDING_COMPLETE
        );

        if (onboardingDone === 'true') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Onboarding' }],
          });
        }
      } catch {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Onboarding' }],
        });
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [
    isAuthenticated,
    role,
    navigation,
    ripple1Scale,
    ripple1Opacity,
    ripple2Scale,
    ripple2Opacity,
    ripple3Scale,
    ripple3Opacity,
    logoOpacity,
    logoTranslateY,
    taglineOpacity,
  ]);

  const renderRipple = (
    scale: Animated.Value,
    opacity: Animated.Value
  ) => (
    <Animated.View
      style={[
        styles.ripple,
        {
          transform: [{ scale }],
          opacity,
        },
      ]}
    />
  );

  return (
    <LinearGradient
      colors={['#1E3A8A', '#2563EB', '#0EA5E9']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Water ripples */}
      <View style={styles.rippleContainer}>
        {renderRipple(ripple1Scale, ripple1Opacity)}
        {renderRipple(ripple2Scale, ripple2Opacity)}
        {renderRipple(ripple3Scale, ripple3Opacity)}
      </View>

      {/* Logo & text */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: logoOpacity,
            transform: [{ translateY: logoTranslateY }],
          },
        ]}
      >
        <Text style={styles.dropIcon}>💧</Text>
        <Text style={styles.appName}>{CONFIG.APP_NAME}</Text>
      </Animated.View>

      <Animated.View style={{ opacity: taglineOpacity }}>
        <Text style={styles.tagline}>{CONFIG.APP_TAGLINE}</Text>
      </Animated.View>

      {/* Loader */}
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color="rgba(255,255,255,0.8)" />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rippleContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ripple: {
    position: 'absolute',
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.125,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  content: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  dropIcon: {
    fontSize: 56,
    marginBottom: SPACING.lg,
  },
  appName: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.hero,
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  tagline: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    paddingHorizontal: SPACING.xxxl,
    marginTop: SPACING.sm,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 80,
  },
});

export default SplashScreen;
