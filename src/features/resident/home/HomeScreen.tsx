// ============================================================
// AquaEstate — Resident Home Screen
// ============================================================

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthContext';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  FONT_FAMILY,
  FONT_SIZE,
} from '../../../shared/constants/theme';
import { ResidentDashboard, ConservationTip } from '../types/residentTypes';
import { getDashboard, getConservationTips, getNotices } from '../services/residentService';
import NoticeCard from '../../../shared/components/NoticeCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = SPACING.md;
const CARD_HALF = (SCREEN_WIDTH - SPACING.xl * 2 - CARD_GAP) / 2;
const TIP_CARD_WIDTH = SCREEN_WIDTH * 0.72;

// ── Tip Carousel ─────────────────────────────────────────────
const TipCarousel: React.FC<{ tips: ConservationTip[] }> = ({ tips }) => {
  const scrollRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const currentIndex = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % tips.length;
      scrollRef.current?.scrollToIndex({
        index: currentIndex.current,
        animated: true,
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [tips.length]);

  const renderTip = ({ item }: { item: ConservationTip }) => (
    <View style={styles.tipCard}>
      <View style={styles.tipIconWrap}>
        <Ionicons name={item.icon as any} size={28} color={COLORS.ocean} />
      </View>
      <Text style={styles.tipTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.tipDesc} numberOfLines={3}>
        {item.description}
      </Text>
    </View>
  );

  return (
    <View>
      <FlatList
        ref={scrollRef}
        data={tips}
        horizontal
        pagingEnabled={false}
        snapToInterval={TIP_CARD_WIDTH + SPACING.md}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        keyExtractor={(t) => t.id}
        renderItem={renderTip}
        contentContainerStyle={{ paddingHorizontal: SPACING.xl }}
        ItemSeparatorComponent={() => <View style={{ width: SPACING.md }} />}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
      />
      {/* Dot indicators */}
      <View style={styles.dots}>
        {tips.map((_, i) => {
          const inputRange = [
            (i - 1) * (TIP_CARD_WIDTH + SPACING.md),
            i * (TIP_CARD_WIDTH + SPACING.md),
            (i + 1) * (TIP_CARD_WIDTH + SPACING.md),
          ];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.3, 0.8],
            extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.35, 1, 0.35],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                { transform: [{ scale }], opacity },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

// ── Conservation Score Ring ──────────────────────────────────
const ScoreRing: React.FC<{ score: number }> = ({ score }) => {
  const animVal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animVal, {
      toValue: score,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, [score]);

  return (
    <View style={styles.scoreRing}>
      <View style={styles.scoreOuter}>
        <View style={styles.scoreInner}>
          <Text style={styles.scoreValue}>{score}</Text>
          <Text style={styles.scoreLabel}>/ 100</Text>
        </View>
      </View>
    </View>
  );
};

// ── Main Screen ──────────────────────────────────────────────
const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<ResidentDashboard | null>(null);
  const [tips, setTips] = useState<ConservationTip[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Fade-in animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const loadData = useCallback(async () => {
    if (!user) return;
    const [d, t, n] = await Promise.all([getDashboard(user.id), getConservationTips(), getNotices()]);
    setDashboard(d);
    setTips(t);
    setNotices(n.slice(0, 3));
  }, [user]);

  useEffect(() => {
    loadData().then(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  if (!dashboard) {
    return (
      <View style={styles.loadingWrap}>
        <Ionicons name="water" size={48} color={COLORS.ocean} />
        <Text style={styles.loadingText}>Loading…</Text>
      </View>
    );
  }

  // Quick Action items
  const quickActions = [
    { key: 'usage', icon: 'bar-chart-outline', label: 'Usage', route: 'Usage' },
    { key: 'complaint', icon: 'chatbox-ellipses-outline', label: 'Complaint', route: 'RaiseComplaint' },
    { key: 'bill', icon: 'receipt-outline', label: 'Bills', route: 'Profile' },
    { key: 'tips', icon: 'bulb-outline', label: 'Tips', route: 'Usage' },
  ];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary, COLORS.ocean]}
          />
        }
      >
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
          {/* ── Header ─────────────────────────────────────── */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hello, {user?.name.split(' ')[0]} 👋</Text>
              <Text style={styles.subtitle}>Flat {user?.flatNumber} • {user?.estateName}</Text>
            </View>
            <TouchableOpacity
              style={styles.avatarCircle}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={styles.avatarText}>
                {user?.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── Water Saved Hero Card ──────────────────────── */}
          <View style={styles.heroCard}>
            <View style={styles.heroGradient}>
              {/* Decorative circles */}
              <View style={[styles.heroBubble, styles.heroBubble1]} />
              <View style={[styles.heroBubble, styles.heroBubble2]} />
              <View style={[styles.heroBubble, styles.heroBubble3]} />

              <View style={styles.heroContent}>
                <View style={styles.heroLeft}>
                  <View style={styles.heroIconWrap}>
                    <Ionicons name="water" size={32} color="#FFFFFF" />
                  </View>
                  <Text style={styles.heroValue}>
                    {dashboard.waterSaved.toLocaleString()}
                  </Text>
                  <Text style={styles.heroUnit}>Litres Saved This Month</Text>
                </View>

                <ScoreRing score={dashboard.conservationScore} />
              </View>
            </View>
          </View>

          {/* ── Summary Grid ──────────────────────────────── */}
          <View style={styles.gridRow}>
            <SummaryTile
              icon="water-outline"
              iconColor={COLORS.ocean}
              bgColor={COLORS.aquaMist}
              label="Today's Usage"
              value={`${dashboard.todayUsage}L`}
            />
            <SummaryTile
              icon="calendar-outline"
              iconColor={COLORS.primary}
              bgColor={COLORS.lightAqua}
              label="Monthly Usage"
              value={`${dashboard.monthlyUsage.toLocaleString()}L`}
            />
          </View>
          <View style={styles.gridRow}>
            <SummaryTile
              icon="receipt-outline"
              iconColor={COLORS.mint}
              bgColor={COLORS.successLight}
              label="Current Bill"
              value={`₹${dashboard.currentBill.toLocaleString()}`}
            />
            <SummaryTile
              icon="alert-circle-outline"
              iconColor={COLORS.warning}
              bgColor={COLORS.warningLight}
              label="Open Complaints"
              value={String(dashboard.openComplaints)}
            />
          </View>

          {/* ── Conservation Tips ─────────────────────────── */}
          <Text style={styles.sectionTitle}>💡 Conservation Tips</Text>
          <TipCarousel tips={tips} />

          {/* ── Community Notices ─────────────────────────── */}
          {notices.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Community Notices</Text>
              <View style={{ paddingHorizontal: SPACING.xl, gap: SPACING.md }}>
                {notices.map((notice) => (
                  <NoticeCard
                    key={notice.id}
                    title={notice.title}
                    description={notice.description}
                    type={notice.type}
                    startTime={new Date(notice.startTime).toLocaleDateString()}
                    endTime={new Date(notice.endTime).toLocaleDateString()}
                    createdBy={notice.createdBy}
                  />
                ))}
              </View>
            </>
          )}

          {/* ── Quick Actions ─────────────────────────────── */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            {quickActions.map((a) => (
              <TouchableOpacity
                key={a.key}
                style={styles.actionCard}
                activeOpacity={0.7}
                onPress={() => navigation.navigate(a.route)}
              >
                <View style={styles.actionIconWrap}>
                  <Ionicons name={a.icon as any} size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.actionLabel}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ height: SPACING.huge }} />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

// ── Summary Tile Component ───────────────────────────────────
interface SummaryTileProps {
  icon: string;
  iconColor: string;
  bgColor: string;
  label: string;
  value: string;
}
const SummaryTile: React.FC<SummaryTileProps> = ({
  icon,
  iconColor,
  bgColor,
  label,
  value,
}) => (
  <View style={styles.summaryCard}>
    <View style={[styles.summaryIconWrap, { backgroundColor: bgColor }]}>
      <Ionicons name={icon as any} size={22} color={iconColor} />
    </View>
    <Text style={styles.summaryValue}>{value}</Text>
    <Text style={styles.summaryLabel}>{label}</Text>
  </View>
);

// ── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: SPACING.xl },

  // Loading
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  greeting: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xxl,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    color: '#FFFFFF',
  },

  // Hero Card
  heroCard: {
    marginHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    ...SHADOWS.large,
  },
  heroGradient: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
    position: 'relative',
    overflow: 'hidden',
  },
  heroBubble: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.12,
    backgroundColor: '#FFFFFF',
  },
  heroBubble1: { width: 120, height: 120, top: -30, right: -20 },
  heroBubble2: { width: 80, height: 80, bottom: -20, left: 30 },
  heroBubble3: { width: 50, height: 50, top: 10, right: 100 },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroLeft: { flex: 1 },
  heroIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  heroValue: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: 42,
    color: '#FFFFFF',
    lineHeight: 48,
  },
  heroUnit: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },

  // Score Ring
  scoreRing: { alignItems: 'center', justifyContent: 'center' },
  scoreOuter: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 5,
    borderColor: 'rgba(255,255,255,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreValue: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: 24,
    color: '#FFFFFF',
  },
  scoreLabel: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
  },

  // Summary Grid
  gridRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    marginBottom: CARD_GAP,
    gap: CARD_GAP,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.small,
  },
  summaryIconWrap: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  summaryValue: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xl,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  summaryLabel: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
  },

  // Section Title
  sectionTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xxl,
    marginBottom: SPACING.md,
  },

  // Tips Carousel
  tipCard: {
    width: TIP_CARD_WIDTH,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.small,
  },
  tipIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.aquaMist,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  tipTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  tipDesc: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginHorizontal: 3,
  },

  // Quick Actions
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
  },
  actionCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  actionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.lightAqua,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  actionLabel: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
});

export default HomeScreen;
