// ============================================================
// AquaEstate — Resident Usage Screen
// ============================================================

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  FONT_FAMILY,
  FONT_SIZE,
} from '../../../shared/constants/theme';
import { MonthlyUsage, UsageStatistics } from '../types/residentTypes';
import {
  getDailyUsage,
  getWeeklyUsage,
  getMonthlyUsage,
  getStatistics,
  getConservationScore,
} from '../services/residentService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - SPACING.xl * 2;

type FilterTab = 'Daily' | 'Weekly' | 'Monthly';
const TABS: FilterTab[] = ['Daily', 'Weekly', 'Monthly'];

// ── Chart config ─────────────────────────────────────────────
const chartConfig = {
  backgroundGradientFrom: COLORS.card,
  backgroundGradientTo: COLORS.card,
  decimalCount: 0,
  color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
  labelColor: () => COLORS.textTertiary,
  propsForLabels: { fontFamily: FONT_FAMILY.regular, fontSize: 11 },
  propsForDots: { r: '5', strokeWidth: '2', stroke: COLORS.primary },
  propsForBackgroundLines: { stroke: COLORS.borderLight, strokeDasharray: '' },
  fillShadowGradientFrom: COLORS.primary,
  fillShadowGradientTo: COLORS.lightAqua,
  fillShadowGradientFromOpacity: 0.3,
  fillShadowGradientToOpacity: 0.02,
  barPercentage: 0.55,
  useShadowColorFromDataset: false,
};

// ── Conservation Score Circle ────────────────────────────────
const ConservationCircle: React.FC<{ score: number }> = ({ score }) => {
  const getColor = (s: number) =>
    s >= 80 ? COLORS.mint : s >= 60 ? COLORS.warning : COLORS.error;
  const getLabel = (s: number) =>
    s >= 80 ? 'Excellent' : s >= 60 ? 'Good' : 'Needs Work';

  const color = getColor(score);

  return (
    <View style={styles.conservationCard}>
      <Text style={styles.conservationTitle}>Conservation Score</Text>
      <View style={styles.circleRow}>
        <View
          style={[
            styles.circleOuter,
            { borderColor: `${color}30` },
          ]}
        >
          <View
            style={[
              styles.circleProgress,
              { borderColor: color, borderTopColor: `${color}20` },
            ]}
          >
            <View style={styles.circleInner}>
              <Text style={[styles.circleValue, { color }]}>{score}</Text>
              <Text style={styles.circleOf}>/100</Text>
            </View>
          </View>
        </View>
        <View style={styles.circleInfo}>
          <Text style={[styles.circleLabel, { color }]}>{getLabel(score)}</Text>
          <Text style={styles.circleDesc}>
            You're doing great! Keep conserving water to maintain your score.
          </Text>
        </View>
      </View>
    </View>
  );
};

// ── Main Screen ──────────────────────────────────────────────
const UsageScreen: React.FC = () => {
  const [tab, setTab] = useState<FilterTab>('Daily');
  const [dailyLabels, setDailyLabels] = useState<string[]>([]);
  const [dailyData, setDailyData] = useState<number[]>([]);
  const [weeklyLabels, setWeeklyLabels] = useState<string[]>([]);
  const [weeklyDataArr, setWeeklyDataArr] = useState<number[]>([]);
  const [monthlyArr, setMonthlyArr] = useState<MonthlyUsage[]>([]);
  const [stats, setStats] = useState<UsageStatistics | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const load = useCallback(async () => {
    setLoading(true);
    const [daily, weekly, monthly, s, sc] = await Promise.all([
      getDailyUsage('Monday'),
      getWeeklyUsage(),
      getMonthlyUsage(),
      getStatistics(),
      getConservationScore(),
    ]);

    // Pick a few hours for the daily line chart
    const selectedHours = [0, 4, 8, 12, 16, 20, 23];
    setDailyLabels(selectedHours.map((h) => `${h}h`));
    setDailyData(selectedHours.map((h) => daily.find((d) => d.hour === h)?.usage ?? 0));

    setWeeklyLabels(weekly.labels);
    setWeeklyDataArr(weekly.data);
    setMonthlyArr(monthly);
    setStats(s);
    setScore(sc);
    setLoading(false);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    load();
  }, []);

  // ── Render chart based on active tab ───────────────────────
  const renderChart = () => {
    if (loading) {
      return (
        <View style={styles.chartPlaceholder}>
          <Text style={styles.placeholderText}>Loading chart…</Text>
        </View>
      );
    }

    if (tab === 'Daily') {
      return (
        <LineChart
          data={{
            labels: dailyLabels,
            datasets: [{ data: dailyData.length ? dailyData : [0] }],
          }}
          width={CHART_WIDTH}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withInnerLines
          withOuterLines={false}
          withVerticalLines={false}
          yAxisSuffix="L"
        />
      );
    }

    if (tab === 'Weekly') {
      return (
        <BarChart
          data={{
            labels: weeklyLabels,
            datasets: [{ data: weeklyDataArr.length ? weeklyDataArr : [0] }],
          }}
          width={CHART_WIDTH}
          height={220}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(14, 165, 233, ${opacity})`,
          }}
          style={styles.chart}
          withInnerLines
          showValuesOnTopOfBars
          fromZero
          yAxisSuffix="L"
          yAxisLabel=""
        />
      );
    }

    // Monthly with target overlay
    return (
      <View>
        <BarChart
          data={{
            labels: monthlyArr.map((m) => m.month),
            datasets: [{ data: monthlyArr.map((m) => m.usage) }],
          }}
          width={CHART_WIDTH}
          height={220}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(6, 182, 212, ${opacity})`,
          }}
          style={styles.chart}
          withInnerLines
          showValuesOnTopOfBars
          fromZero
          yAxisSuffix="L"
          yAxisLabel=""
        />
        <View style={styles.targetLegend}>
          <View style={styles.legendDot} />
          <Text style={styles.legendText}>Target: 3,000 L/month</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.screenTitle}>Water Usage</Text>

        {/* Filter Tabs */}
        <View style={styles.tabRow}>
          {TABS.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, tab === t && styles.tabActive]}
              activeOpacity={0.7}
              onPress={() => setTab(t)}
            >
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart Card */}
        <View style={styles.chartCard}>{renderChart()}</View>

        {/* Statistics */}
        {stats && (
          <Animated.View style={[styles.statsCard, { opacity: fadeAnim }]}>
            <Text style={styles.statsTitle}>
              <Ionicons name="analytics-outline" size={18} color={COLORS.primary} />
              {'  '}Statistics
            </Text>
            <View style={styles.statRow}>
              <StatItem
                icon="speedometer-outline"
                label="Average Usage"
                value={`${stats.averageUsage}L/day`}
                color={COLORS.primary}
              />
              <StatItem
                icon="arrow-up-circle-outline"
                label="Highest Usage"
                value={`${stats.highestDay} (${stats.highestUsage}L)`}
                color={COLORS.error}
              />
            </View>
            <View style={styles.statRow}>
              <StatItem
                icon="arrow-down-circle-outline"
                label="Lowest Usage"
                value={`${stats.lowestDay} (${stats.lowestUsage}L)`}
                color={COLORS.mint}
              />
              <StatItem
                icon="trending-down-outline"
                label="Below Target"
                value="All months ✓"
                color={COLORS.cyan}
              />
            </View>
          </Animated.View>
        )}

        {/* Conservation Score */}
        <ConservationCircle score={score} />

        <View style={{ height: SPACING.huge }} />
      </ScrollView>
    </View>
  );
};

// ── Stat Item ────────────────────────────────────────────────
const StatItem: React.FC<{
  icon: string;
  label: string;
  value: string;
  color: string;
}> = ({ icon, label, value, color }) => (
  <View style={styles.statItem}>
    <Ionicons name={icon as any} size={20} color={color} />
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

// ── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 48,
    paddingBottom: SPACING.massive,
  },

  screenTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xxl,
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
  },

  // Filter Tabs
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.round,
    padding: 4,
    marginBottom: SPACING.xl,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.small,
  },
  tabText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },

  // Chart
  chartCard: {
    marginHorizontal: SPACING.xl,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    ...SHADOWS.medium,
    alignItems: 'center',
  },
  chart: {
    borderRadius: BORDER_RADIUS.lg,
  },
  chartPlaceholder: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.textTertiary,
  },

  // Target legend
  targetLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
  },
  legendDot: {
    width: 10,
    height: 3,
    backgroundColor: COLORS.error,
    marginRight: SPACING.xs,
    borderRadius: 2,
  },
  legendText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
  },

  // Stats
  statsCard: {
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.xl,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.small,
  },
  statsTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  statRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  statItem: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  statLabel: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    marginTop: SPACING.xs,
  },
  statValue: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
    marginTop: 2,
  },

  // Conservation Score
  conservationCard: {
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.xl,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.small,
  },
  conservationTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  circleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleOuter: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleProgress: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleValue: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: 28,
  },
  circleOf: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
  },
  circleInfo: {
    flex: 1,
    marginLeft: SPACING.xl,
  },
  circleLabel: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xl,
    marginBottom: 4,
  },
  circleDesc: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});

export default UsageScreen;
