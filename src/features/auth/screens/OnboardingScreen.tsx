// AquaEstate Onboarding Screen
// 3-slide horizontal paging onboarding flow

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  FONT_FAMILY,
  FONT_SIZE,
} from '../../../shared/constants/theme';
import { CONFIG } from '../../../config/config';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  bgColor: string;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    icon: 'water',
    title: 'Conserve Every Drop',
    description: 'Track and conserve water for a sustainable future.',
    bgColor: COLORS.primary,
  },
  {
    id: '2',
    icon: 'business',
    title: 'Manage Smart Communities',
    description:
      'Manage residents, maintenance, and water usage efficiently.',
    bgColor: COLORS.ocean,
  },
  {
    id: '3',
    icon: 'leaf',
    title: 'Build Sustainable Futures',
    description: 'Small actions create big environmental change.',
    bgColor: COLORS.mint,
  },
];

interface OnboardingScreenProps {
  navigation: any;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setActiveIndex(index);
  };

  const goToSlide = (index: number) => {
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
    setActiveIndex(index);
  };

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      goToSlide(activeIndex + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(
        CONFIG.STORAGE_KEYS.ONBOARDING_COMPLETE,
        'true'
      );
    } catch (error) {
      console.warn('Failed to save onboarding state:', error);
    }
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const isLastSlide = activeIndex === SLIDES.length - 1;

  return (
    <View style={styles.container}>
      {/* Skip button */}
      {!isLastSlide && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        bounces={false}
      >
        {SLIDES.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            <View
              style={[styles.iconContainer, { backgroundColor: slide.bgColor + '15' }]}
            >
              <Ionicons name={slide.icon} size={80} color={slide.bgColor} />
            </View>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Bottom section */}
      <View style={styles.bottomSection}>
        {/* Dot indicators */}
        <View style={styles.dotsContainer}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                activeIndex === index ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Action button */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.actionButtonText}>
            {isLastSlide ? 'Get Started' : 'Next'}
          </Text>
          <Ionicons
            name={isLastSlide ? 'checkmark' : 'arrow-forward'}
            size={20}
            color="#FFFFFF"
            style={styles.actionIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  skipButton: {
    position: 'absolute',
    top: 56,
    right: SPACING.xl,
    zIndex: 10,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  skipText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.textTertiary,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xxxl,
    paddingTop: height * 0.15,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.huge,
  },
  title: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xxxl,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  description: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: SPACING.lg,
  },
  bottomSection: {
    paddingHorizontal: SPACING.xxl,
    paddingBottom: SPACING.massive,
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.xxl,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    width: 28,
    backgroundColor: COLORS.primary,
  },
  dotInactive: {
    width: 8,
    backgroundColor: COLORS.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxxl,
    borderRadius: BORDER_RADIUS.xl,
    width: '100%',
  },
  actionButtonText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: '#FFFFFF',
  },
  actionIcon: {
    marginLeft: SPACING.sm,
  },
});

export default OnboardingScreen;
