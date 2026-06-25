// Estate Admin - Dashboard Screen
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  FONT_FAMILY,
  FONT_SIZE,
  TYPOGRAPHY,
} from '../../../shared/constants/theme';
import {
  getDashboardStats,
  getRecentActivities,
  getWeeklyUsage,
} from '../services/estateService';
import type { DashboardStats, Activity, WeeklyUsageData } from '../types/estateTypes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - SPACING.xl * 2 - SPACING.lg * 2;

// ── Helpers ────────────────────────────────────────────────────────────

const formatNumber = (n: number): string => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
};

const getActivityIcon = (
  type: Activity['type']
): { name: keyof typeof Ionicons.glyphMap; color: string } => {
  switch (type) {
    case 'resident':
      return { name: 'person-add', color: COLORS.primary };
    case 'complaint':
      return { name: 'warning', color: COLORS.warning };
    case 'water':
      return { name: 'water', color: COLORS.ocean };
    case 'maintenance':
      return { name: 'construct', color: COLORS.cyan };
    case 'notice':
      return { name: 'megaphone', color: COLORS.mint };
    default:
      return { name: 'ellipse', color: COLORS.textTertiary };
  }
};

const timeAgo = (timestamp: string): string => {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

// ── Component ──────────────────────────────────────────────────────────

const DashboardScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyUsageData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [s, a, w] = await Promise.all([
        getDashboardStats(),
        getRecentActivities(),
        getWeeklyUsage(),
      ]);
      setStats(s);
      setActivities(a);
      setWeeklyData(w);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // ── Stat cards config ──
  const statCards = [
    {
      title: 'Total Residents',
      value: stats?.totalResidents ?? 0,
      icon: 'people' as const,
      color: COLORS.primary,
      bg: COLORS.lightAqua,
    },
    {
      title: 'Total Blocks',
      value: stats?.totalBlocks ?? 0,
      icon: 'business' as const,
      color: COLORS.cyan,
      bg: '#CFFAFE',
    },
    {
      title: 'Water Usage',
      value: `${formatNumber(stats?.monthlyWaterUsage ?? 0)}L`,
      icon: 'water' as const,
      color: COLORS.ocean,
      bg: COLORS.aquaMist,
    },
    {
      title: 'Open Complaints',
      value: stats?.openComplaints ?? 0,
      icon: 'alert-circle' as const,
      color: COLORS.warning,
      bg: COLORS.warningLight,
    },
  ];

  // ── Quick actions ──
  const quickActions = [
    { label: 'Add Resident', icon: 'person-add', color: COLORS.primary, onPress: () => navigation?.navigate?.('AddResident') },
    { label: 'Create Notice', icon: 'megaphone', color: COLORS.ocean, onPress: () => {} },
    { label: 'Generate Report', icon: 'document-text', color: COLORS.cyan, onPress: () => navigation?.navigate?.('Reports') },
    { label: 'View Analytics', icon: 'analytics', color: COLORS.mint, onPress: () => navigation?.navigate?.('Reports') },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.primary]}
          tintColor={COLORS.primary}
        />
      }
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Good Morning, Admin 👋</Text>
        <Text style={styles.estateName}>GreenVille Estate</Text>
      </View>

      {/* ── Stat Cards 2×2 ── */}
      <View style={styles.statsGrid}>
        {statCards.map((card, index) => (
          <View key={index} style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: card.bg }]}>
              <Ionicons name={card.icon} size={22} color={card.color} />
            </View>
            <Text style={styles.statValue}>
              {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
            </Text>
            <Text style={styles.statLabel}>{card.title}</Text>
          </View>
        ))}
      </View>

      {/* ── Weekly Water Usage Chart ── */}
      {weeklyData && (
        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Weekly Water Usage</Text>
          <Text style={styles.chartSubtitle}>Liters consumed per day</Text>
          <LineChart
            data={{
              labels: weeklyData.labels,
              datasets: [{ data: weeklyData.data }],
            }}
            width={CHART_WIDTH}
            height={200}
            yAxisSuffix="L"
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: COLORS.card,
              backgroundGradientFrom: COLORS.card,
              backgroundGradientTo: COLORS.card,
              decimalCount: 0,
              color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
              labelColor: () => COLORS.textSecondary,
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: COLORS.primary,
              },
              propsForBackgroundLines: {
                strokeDasharray: '6,6',
                stroke: COLORS.border,
              },
              style: { borderRadius: BORDER_RADIUS.lg },
            }}
            bezier
            style={styles.chart}
          />
        </View>
      )}

      {/* ── Recent Activities ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        {activities.map((activity) => {
          const iconInfo = getActivityIcon(activity.type);
          return (
            <View key={activity.id} style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: `${iconInfo.color}15` }]}>
                <Ionicons name={iconInfo.name} size={18} color={iconInfo.color} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDesc}>{activity.description}</Text>
              </View>
              <Text style={styles.activityTime}>{timeAgo(activity.timestamp)}</Text>
            </View>
          );
        })}
      </View>

      {/* ── Quick Actions 2×2 ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              activeOpacity={0.7}
              onPress={action.onPress}
            >
              <View style={[styles.actionIconWrap, { backgroundColor: `${action.color}15` }]}>
                <Ionicons name={action.icon as any} size={24} color={action.color} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ height: SPACING.huge }} />
    </ScrollView>
  );
};

// ── Styles ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },

  // Header
  header: {
    marginBottom: SPACING.xxl,
  },
  greeting: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xxl,
    color: COLORS.textPrimary,
  },
  estateName: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },

  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.xxl,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  statIconWrap: {
    width: 42,
    height: 42,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xxl,
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
    marginTop: 2,
  },

  // Chart card
  chartCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.xxl,
    ...SHADOWS.medium,
  },
  chartSubtitle: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
    marginBottom: SPACING.md,
  },
  chart: {
    borderRadius: BORDER_RADIUS.lg,
    marginLeft: -SPACING.lg,
  },

  // Section
  section: {
    marginBottom: SPACING.xxl,
  },
  sectionTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xl,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },

  // Activity
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  activityIcon: {
    width: 38,
    height: 38,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
  },
  activityDesc: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  activityTime: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    marginLeft: SPACING.sm,
  },

  // Quick Actions
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  actionIconWrap: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  actionLabel: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
});

export default DashboardScreen;
