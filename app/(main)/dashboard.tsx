import React, { useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { CustomButton } from '../../components/CustomButton';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Helper: extract a readable name from email
function extractNameFromEmail(email?: string): string {
  if (!email) return 'Admin';
  const localPart = email.split('@')[0];
  return localPart
    .replace(/[._-]/g, ' ')
    .replace(/[0-9]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ') || 'Admin';
}

// ============= Water Wave Component =============
function WaterWave() {
  const wave1 = useRef(new Animated.Value(0)).current;
  const wave2 = useRef(new Animated.Value(0)).current;
  const wave3 = useRef(new Animated.Value(0)).current;
  const droplet1Scale = useRef(new Animated.Value(0.8)).current;
  const droplet2Scale = useRef(new Animated.Value(0.6)).current;
  const droplet1Y = useRef(new Animated.Value(0)).current;
  const droplet2Y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Wave animations
    const animateWave = (anim: Animated.Value, duration: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      );

    animateWave(wave1, 3000).start();
    animateWave(wave2, 3500).start();
    animateWave(wave3, 4000).start();

    // Droplet floating animation
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(droplet1Scale, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(droplet1Y, { toValue: -8, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(droplet1Scale, { toValue: 0.8, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(droplet1Y, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(droplet2Scale, { toValue: 0.85, duration: 2500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(droplet2Y, { toValue: -6, duration: 2500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(droplet2Scale, { toValue: 0.6, duration: 2500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(droplet2Y, { toValue: 0, duration: 2500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <View style={waveStyles.container}>
      {/* Wave layers */}
      <Animated.View
        style={[
          waveStyles.wave,
          waveStyles.wave1,
          {
            transform: [
              { translateX: wave1.interpolate({ inputRange: [0, 1], outputRange: [-20, 20] }) },
              { translateY: wave1.interpolate({ inputRange: [0, 1], outputRange: [0, 6] }) },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          waveStyles.wave,
          waveStyles.wave2,
          {
            transform: [
              { translateX: wave2.interpolate({ inputRange: [0, 1], outputRange: [15, -15] }) },
              { translateY: wave2.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }) },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          waveStyles.wave,
          waveStyles.wave3,
          {
            transform: [
              { translateX: wave3.interpolate({ inputRange: [0, 1], outputRange: [-10, 10] }) },
              { translateY: wave3.interpolate({ inputRange: [0, 1], outputRange: [3, -3] }) },
            ],
          },
        ]}
      />

      {/* Animated water droplets */}
      <Animated.View
        style={[
          waveStyles.droplet,
          waveStyles.dropletLarge,
          {
            transform: [
              { scale: droplet1Scale },
              { translateY: droplet1Y },
            ],
          },
        ]}
      >
        <Ionicons name="water" size={28} color="rgba(59, 130, 246, 0.4)" />
      </Animated.View>
      <Animated.View
        style={[
          waveStyles.droplet,
          waveStyles.dropletSmall,
          {
            transform: [
              { scale: droplet2Scale },
              { translateY: droplet2Y },
            ],
          },
        ]}
      >
        <Ionicons name="water" size={18} color="rgba(59, 130, 246, 0.3)" />
      </Animated.View>

      {/* Bubble effects */}
      <View style={[waveStyles.bubble, { top: 60, right: 15, width: 6, height: 6 }]} />
      <View style={[waveStyles.bubble, { top: 30, right: 45, width: 4, height: 4 }]} />
      <View style={[waveStyles.bubble, { top: 50, right: 60, width: 5, height: 5 }]} />
    </View>
  );
}

const waveStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 140,
    overflow: 'hidden',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  wave: {
    position: 'absolute',
    bottom: -20,
    borderRadius: 100,
  },
  wave1: {
    right: -30,
    width: 160,
    height: 90,
    backgroundColor: 'rgba(147, 197, 253, 0.25)',
  },
  wave2: {
    right: -20,
    width: 140,
    height: 80,
    backgroundColor: 'rgba(96, 165, 250, 0.18)',
    bottom: -10,
  },
  wave3: {
    right: -40,
    width: 180,
    height: 70,
    backgroundColor: 'rgba(191, 219, 254, 0.3)',
    bottom: 0,
  },
  droplet: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropletLarge: {
    top: 10,
    right: 20,
  },
  dropletSmall: {
    top: 45,
    right: 55,
  },
  bubble: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'rgba(147, 197, 253, 0.4)',
  },
});

// ============= Bar Chart Component =============
function BarChart({ data, maxValue }: { data: { label: string; value: number; color: string }[]; maxValue: number }) {
  return (
    <View style={chartStyles.container}>
      <View style={chartStyles.barsRow}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * 120;
          return (
            <View key={index} style={chartStyles.barWrapper}>
              <Text style={chartStyles.barValue}>{item.value}</Text>
              <View style={[chartStyles.bar, { height: barHeight, backgroundColor: item.color }]} />
              <Text style={chartStyles.barLabel}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const chartStyles = StyleSheet.create({
  container: { paddingVertical: 10 },
  barsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 160,
    paddingBottom: 24,
  },
  barWrapper: { alignItems: 'center', flex: 1 },
  barValue: { fontSize: 12, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  bar: { width: 28, borderRadius: 6, minHeight: 8 },
  barLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 6, fontWeight: '500' },
});

const analyticsData = {
  weeklyUsage: [
    { label: 'Mon', value: 42, color: '#60A5FA' },
    { label: 'Tue', value: 38, color: '#60A5FA' },
    { label: 'Wed', value: 55, color: '#3B82F6' },
    { label: 'Thu', value: 31, color: '#60A5FA' },
    { label: 'Fri', value: 47, color: '#60A5FA' },
    { label: 'Sat', value: 62, color: '#2563EB' },
    { label: 'Sun', value: 29, color: '#93C5FD' },
  ],
};

// ============= Main Dashboard =============
export default function DashboardScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const userName = useMemo(() => extractNameFromEmail(email), [email]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(25)).current;
  const cardFade1 = useRef(new Animated.Value(0)).current;
  const cardFade2 = useRef(new Animated.Value(0)).current;
  const cardFade3 = useRef(new Animated.Value(0)).current;
  const cardFade4 = useRef(new Animated.Value(0)).current;
  const cardSlide1 = useRef(new Animated.Value(20)).current;
  const cardSlide2 = useRef(new Animated.Value(20)).current;
  const cardSlide3 = useRef(new Animated.Value(20)).current;
  const cardSlide4 = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.stagger(120, [
        Animated.parallel([
          Animated.timing(cardFade1, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(cardSlide1, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(cardFade2, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(cardSlide2, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(cardFade3, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(cardSlide3, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(cardFade4, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(cardSlide4, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]),
      ]),
    ]).start();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Greeting Header */}
      <Animated.View style={[styles.headerSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.greetingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greetingLight}>{getGreeting()},</Text>
            <Text style={styles.greetingName}>{userName}</Text>
          </View>
          <View style={styles.headerIcons}>
            <View style={styles.iconBubble}>
              <Ionicons name="notifications-outline" size={22} color={Colors.primary} />
            </View>
            <View style={[styles.iconBubble, styles.avatarBubble]}>
              <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* ====== WELCOME CARD WITH WATER WAVE ====== */}
      <Animated.View style={[styles.welcomeCard, { opacity: cardFade1, transform: [{ translateY: cardSlide1 }] }]}>
        {/* Water wave background */}
        <WaterWave />

        <View style={styles.welcomeContent}>
          <Text style={styles.welcomeTitle}>Welcome to your Estate Dashboard</Text>
          <Text style={styles.welcomeSubtitle}>
            Let's complete setup to start monitoring water usage
          </Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressPill}>
              <Text style={styles.progressText}>0/3</Text>
            </View>
            <Text style={styles.setupText}>Setup Progress</Text>
          </View>
        </View>
      </Animated.View>

      {/* ====== ANALYTICS SECTION ====== */}

      {/* Stat Cards Row */}
      <Animated.View style={[styles.statsRow, { opacity: cardFade2, transform: [{ translateY: cardSlide2 }] }]}>
        <View style={styles.statCard}>
          <View style={[styles.statIconBg, { backgroundColor: '#EFF6FF' }]}>
            <Ionicons name="water" size={20} color="#3B82F6" />
          </View>
          <Text style={styles.statValue}>304 L</Text>
          <Text style={styles.statLabel}>Today's Usage</Text>
          <View style={styles.statTrend}>
            <Ionicons name="trending-down" size={14} color={Colors.success} />
            <Text style={[styles.statTrendText, { color: Colors.success }]}>12%</Text>
          </View>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconBg, { backgroundColor: '#F0FDF4' }]}>
            <Ionicons name="leaf" size={20} color="#22C55E" />
          </View>
          <Text style={styles.statValue}>1,842 L</Text>
          <Text style={styles.statLabel}>Saved This Month</Text>
          <View style={styles.statTrend}>
            <Ionicons name="trending-up" size={14} color={Colors.success} />
            <Text style={[styles.statTrendText, { color: Colors.success }]}>8%</Text>
          </View>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconBg, { backgroundColor: '#FFF7ED' }]}>
            <Ionicons name="alert-circle" size={20} color="#F97316" />
          </View>
          <Text style={styles.statValue}>2</Text>
          <Text style={styles.statLabel}>Active Alerts</Text>
          <View style={styles.statTrend}>
            <Ionicons name="arrow-forward" size={14} color={Colors.warning} />
            <Text style={[styles.statTrendText, { color: Colors.warning }]}>View</Text>
          </View>
        </View>
      </Animated.View>

      {/* Weekly Usage Chart */}
      <Animated.View style={[styles.chartCard, { opacity: cardFade2, transform: [{ translateY: cardSlide2 }] }]}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Weekly Water Consumption</Text>
          <View style={styles.chartBadge}>
            <Text style={styles.chartBadgeText}>This Week</Text>
          </View>
        </View>
        <Text style={styles.chartSubtitle}>Average: 43.4 L/day</Text>
        <BarChart data={analyticsData.weeklyUsage} maxValue={70} />
        <View style={styles.chartFooter}>
          <View style={styles.chartLegendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#2563EB' }]} />
            <Text style={styles.legendText}>High usage</Text>
          </View>
          <View style={styles.chartLegendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#60A5FA' }]} />
            <Text style={styles.legendText}>Normal</Text>
          </View>
          <View style={styles.chartLegendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#93C5FD' }]} />
            <Text style={styles.legendText}>Low usage</Text>
          </View>
        </View>
      </Animated.View>

      {/* Usage Breakdown */}
      <Animated.View style={[styles.breakdownCard, { opacity: cardFade3, transform: [{ translateY: cardSlide3 }] }]}>
        <Text style={styles.breakdownTitle}>Usage Breakdown</Text>
        {[
          { name: 'Kitchen', pct: '38%', value: '115 L', icon: 'home' as const, iconColor: '#3B82F6', bgColor: '#EFF6FF', barColor: '#3B82F6' },
          { name: 'Bathroom', pct: '32%', value: '97 L', icon: 'water' as const, iconColor: '#22C55E', bgColor: '#F0FDF4', barColor: '#22C55E' },
          { name: 'Garden', pct: '20%', value: '61 L', icon: 'flower' as const, iconColor: '#F59E0B', bgColor: '#FEF3C7', barColor: '#F59E0B' },
          { name: 'Other', pct: '10%', value: '31 L', icon: 'construct' as const, iconColor: '#EF4444', bgColor: '#FEE2E2', barColor: '#EF4444' },
        ].map((item, idx, arr) => (
          <View key={idx} style={[styles.breakdownItem, idx === arr.length - 1 && { borderBottomWidth: 0 }]}>
            <View style={styles.breakdownLeft}>
              <View style={[styles.breakdownIcon, { backgroundColor: item.bgColor }]}>
                <Ionicons name={item.icon} size={18} color={item.iconColor} />
              </View>
              <View>
                <Text style={styles.breakdownName}>{item.name}</Text>
                <Text style={styles.breakdownSubtext}>{item.pct} of total</Text>
              </View>
            </View>
            <View style={styles.breakdownRight}>
              <Text style={styles.breakdownValue}>{item.value}</Text>
              <View style={styles.breakdownBarBg}>
                <View style={[styles.breakdownBarFill, { width: item.pct, backgroundColor: item.barColor }]} />
              </View>
            </View>
          </View>
        ))}
      </Animated.View>

      {/* ====== ACTION CARDS ====== */}

      {/* Invite Estate Admin — CLICKABLE */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.push('/(main)/invite-admin')}
      >
        <Animated.View style={[styles.actionCard, { opacity: cardFade3, transform: [{ translateY: cardSlide3 }] }]}>
          <View style={styles.actionRow}>
            <View style={styles.actionIcon}>
              <Ionicons name="people-outline" size={24} color={Colors.primary} />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Invite Estate Admin</Text>
              <Text style={styles.actionSubtitle}>Admins must be added before monitoring begins.</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
          </View>
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={[styles.actionCard, { opacity: cardFade3, transform: [{ translateY: cardSlide3 }] }]}>
        <View style={styles.actionRow}>
          <View style={styles.actionIcon}>
            <Ionicons name="wallet-outline" size={24} color={Colors.primary} />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Set Up Estate Wallet</Text>
            <Text style={styles.actionSubtitle}>Enable payments and prepaid water credits.</Text>
          </View>
        </View>
      </Animated.View>

      {/* Go to Dashboard Button */}
      <CustomButton
        title="Go to Dashboard"
        onPress={() => {}}
        type="primary"
        style={styles.dashboardButton}
      />

      {/* Water Conservation Tips */}
      <Animated.View style={[styles.tipsCard, { opacity: cardFade4, transform: [{ translateY: cardSlide4 }] }]}>
        <Text style={styles.tipsTitle}>Water Conservation Tips</Text>
        {[
          'Fix leaks promptly - a dripping tap can waste 15 liters per day.',
          'Install water-efficient fixtures to reduce consumption by up to 30%.',
          'Encourage residents to use water during off-peak hours.',
        ].map((tip, idx) => (
          <View key={idx} style={styles.tipItem}>
            <View style={styles.tipDot} />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
        <CustomButton title="Learn more" onPress={() => {}} type="outline" style={styles.learnMoreButton} />
      </Animated.View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FA' },
  headerSection: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 16 : 12, paddingBottom: 16 },
  greetingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  greetingLight: { fontSize: 16, color: Colors.textSecondary, fontStyle: 'italic' },
  greetingName: { fontSize: 24, fontWeight: '800', color: Colors.text, marginTop: 2 },
  headerIcons: { flexDirection: 'row', gap: 10 },
  iconBubble: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E8F0FE', justifyContent: 'center', alignItems: 'center' },
  avatarBubble: { backgroundColor: Colors.primary },
  avatarText: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },

  // Welcome card with water wave
  welcomeCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    minHeight: 120,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(147, 197, 253, 0.2)',
  },
  welcomeContent: { flex: 1, zIndex: 2, maxWidth: '65%' },
  welcomeTitle: { fontSize: 17, fontWeight: '700', color: Colors.text, marginBottom: 6 },
  welcomeSubtitle: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18, marginBottom: 14 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  progressPill: { backgroundColor: '#E8F5E9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  progressText: { fontSize: 13, fontWeight: '700', color: '#2E7D32' },
  setupText: { fontSize: 14, fontWeight: '600', color: Colors.text },

  // Stats
  statsRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  statIconBg: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statValue: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 2 },
  statLabel: { fontSize: 11, color: Colors.textSecondary, textAlign: 'center', marginBottom: 6 },
  statTrend: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  statTrendText: { fontSize: 12, fontWeight: '700' },

  // Chart
  chartCard: {
    marginHorizontal: 20, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  chartTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
  chartBadge: { backgroundColor: '#EFF6FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  chartBadgeText: { fontSize: 11, fontWeight: '600', color: Colors.primary },
  chartSubtitle: { fontSize: 13, color: Colors.textSecondary, marginBottom: 4 },
  chartFooter: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 4 },
  chartLegendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: Colors.textSecondary },

  // Breakdown
  breakdownCard: {
    marginHorizontal: 20, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  breakdownTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 16 },
  breakdownItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  breakdownLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  breakdownIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  breakdownName: { fontSize: 14, fontWeight: '600', color: Colors.text },
  breakdownSubtext: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  breakdownRight: { alignItems: 'flex-end', width: 80 },
  breakdownValue: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  breakdownBarBg: { width: 60, height: 5, backgroundColor: '#F3F4F6', borderRadius: 3, overflow: 'hidden' },
  breakdownBarFill: { height: '100%', borderRadius: 3 },

  // Action cards
  actionCard: {
    marginHorizontal: 20, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  actionIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E8F0FE', justifyContent: 'center', alignItems: 'center' },
  actionTextContainer: { flex: 1 },
  actionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 3 },
  actionSubtitle: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },

  dashboardButton: { marginHorizontal: 20, marginTop: 6, marginBottom: 20, height: 52, borderRadius: 26, backgroundColor: Colors.primary },

  tipsCard: {
    marginHorizontal: 20, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  tipsTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, textAlign: 'center', marginBottom: 18 },
  tipItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14, gap: 12 },
  tipDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D6ECFF', marginTop: 5 },
  tipText: { flex: 1, fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
  learnMoreButton: { marginTop: 6, height: 46, borderRadius: 12 },
});
