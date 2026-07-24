import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  FONT_FAMILY,
  FONT_SIZE,
  TYPOGRAPHY,
} from '../../../shared/constants/theme';
import SummaryCard from '../../../shared/components/SummaryCard';
import ChartCard from '../../../shared/components/ChartCard';
import LoadingState from '../../../shared/components/LoadingState';
import { getDashboardStats, getComplaintDistribution } from '../services/facilityService';
import { FacilityDashboardStats, ComplaintDistribution } from '../types/facilityTypes';
import { useAuth } from '../../../context/AuthContext';

interface DashboardScreenProps {
  navigation?: any;
}

const ISSUE_TYPE_LABELS: Record<string, string> = {
  leakage: 'Leakage',
  no_water: 'No Water',
  low_pressure: 'Low Pressure',
  dirty_water: 'Dirty Water',
  other: 'Other',
};

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const [stats, setStats] = useState<FacilityDashboardStats | null>(null);
  const [distribution, setDistribution] = useState<ComplaintDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const loadData = useCallback(async () => {
    try {
      const [statsData, distData] = await Promise.all([
        getDashboardStats(),
        getComplaintDistribution(),
      ]);
      setStats(statsData);
      setDistribution(distData);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const formatWaterUsage = (liters: number): string => {
    if (liters >= 1000) {
      return `${(liters / 1000).toFixed(1)}K L`;
    }
    return `${liters} L`;
  };

  if (loading) {
    return <LoadingState message="Loading dashboard..." />;
  }

  const quickActions = [
    {
      label: 'Publish Notice',
      icon: 'megaphone-outline' as keyof typeof Ionicons.glyphMap,
      color: COLORS.ocean,
      bg: COLORS.aquaMist,
      onPress: () => navigation?.navigate?.('PublishNotice'),
    },
    {
      label: 'Assign Staff',
      icon: 'people-outline' as keyof typeof Ionicons.glyphMap,
      color: COLORS.mint,
      bg: COLORS.successLight,
      onPress: () => navigation?.navigate?.('Complaints'),
    },
    {
      label: 'View Reports',
      icon: 'bar-chart-outline' as keyof typeof Ionicons.glyphMap,
      color: COLORS.cyan,
      bg: '#E0F7FA',
      onPress: () => navigation?.navigate?.('Complaints'),
    },
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
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Hello, {user?.name || 'Admin'}</Text>
          <Text style={styles.headerSubtitle}>{user?.estateName || 'GreenVille Estate'}</Text>
        </View>
        <View style={styles.headerBadge}>
          <Ionicons name="shield-checkmark" size={16} color={COLORS.primary} />
          <Text style={styles.headerBadgeText}>Admin</Text>
        </View>
      </View>

      {/* Summary Cards Grid */}
      {stats && (
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <View style={styles.statsCardWrapper}>
              <SummaryCard
                title="Pending Complaints"
                value={stats.pendingComplaints}
                icon="time-outline"
                iconColor={COLORS.warning}
                iconBg={COLORS.warningLight}
                trend="up"
                trendValue="+2"
              />
            </View>
            <View style={styles.statsCardWrapper}>
              <SummaryCard
                title="Resolved Issues"
                value={stats.resolvedIssues}
                icon="checkmark-circle-outline"
                iconColor={COLORS.success}
                iconBg={COLORS.successLight}
                trend="up"
                trendValue="+5"
              />
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statsCardWrapper}>
              <SummaryCard
                title="Water Usage"
                value={formatWaterUsage(stats.waterUsage)}
                icon="water-outline"
                iconColor={COLORS.ocean}
                iconBg={COLORS.aquaMist}
                trend="down"
                trendValue="-8%"
              />
            </View>
            <View style={styles.statsCardWrapper}>
              <SummaryCard
                title="Maintenance"
                value={stats.scheduledMaintenance}
                icon="construct-outline"
                iconColor={COLORS.cyan}
                iconBg="#E0F7FA"
              />
            </View>
          </View>
        </View>
      )}

      {/* Complaint Distribution Chart */}
      <View style={styles.section}>
        <ChartCard title="Complaint Distribution" subtitle="By issue category">
          {/* Stacked Bar */}
          <View style={styles.stackedBarContainer}>
            <View style={styles.stackedBar}>
              {distribution.map((item, index) => (
                <View
                  key={item.category}
                  style={[
                    styles.stackedBarSegment,
                    {
                      backgroundColor: item.color,
                      flex: item.percentage,
                      borderTopLeftRadius: index === 0 ? BORDER_RADIUS.sm : 0,
                      borderBottomLeftRadius: index === 0 ? BORDER_RADIUS.sm : 0,
                      borderTopRightRadius:
                        index === distribution.length - 1 ? BORDER_RADIUS.sm : 0,
                      borderBottomRightRadius:
                        index === distribution.length - 1 ? BORDER_RADIUS.sm : 0,
                    },
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Legend */}
          <View style={styles.legendContainer}>
            {distribution.map((item) => (
              <View key={item.category} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={styles.legendLabel}>{item.label}</Text>
                <Text style={styles.legendPercent}>{item.percentage}%</Text>
              </View>
            ))}
          </View>
        </ChartCard>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsRow}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.quickActionCard}
              onPress={action.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: action.bg }]}>
                <Ionicons name={action.icon} size={24} color={action.color} />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: SPACING.xl,
    paddingBottom: SPACING.massive,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xxl,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
  },
  headerSubtitle: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightAqua,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.round,
    gap: SPACING.xs,
  },
  headerBadgeText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
  },
  statsGrid: {
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  statsCardWrapper: {
    flex: 1,
  },
  section: {
    marginBottom: SPACING.xxl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.lg,
  },
  stackedBarContainer: {
    marginBottom: SPACING.lg,
  },
  stackedBar: {
    flexDirection: 'row',
    height: 28,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
    gap: 2,
  },
  stackedBarSegment: {
    height: '100%',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    minWidth: '40%',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: BORDER_RADIUS.round,
  },
  legendLabel: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    flex: 1,
  },
  legendPercent: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  quickActionLabel: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
});

export default DashboardScreen;
