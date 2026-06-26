// Estate Admin - Reports & Analytics Screen
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  FONT_FAMILY,
  FONT_SIZE,
} from '../../../shared/constants/theme';
import {
  getWeeklyUsage,
  getMonthlyComparison,
  getComplaintCategories,
} from '../services/estateService';
import type {
  WeeklyUsageData,
  MonthlyComparisonData,
  ComplaintCategoryData,
} from '../types/estateTypes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - SPACING.xl * 2 - SPACING.lg * 2;

type FilterType = 'daily' | 'weekly' | 'monthly' | 'yearly';
const FILTERS: FilterType[] = ['daily', 'weekly', 'monthly', 'yearly'];

// ── Horizontal Bar (Custom Pie Replacement) ────────────────────────────

const HorizontalBarChart: React.FC<{ data: ComplaintCategoryData[] }> = ({ data }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <View>
      {/* Stacked bar */}
      <View style={pieStyles.stackedBar}>
        {data.map((item, index) => (
          <View
            key={index}
            style={[
              pieStyles.stackedSegment,
              {
                width: `${(item.value / total) * 100}%`,
                backgroundColor: item.color,
                borderTopLeftRadius: index === 0 ? 8 : 0,
                borderBottomLeftRadius: index === 0 ? 8 : 0,
                borderTopRightRadius: index === data.length - 1 ? 8 : 0,
                borderBottomRightRadius: index === data.length - 1 ? 8 : 0,
              },
            ]}
          />
        ))}
      </View>
      {/* Legend */}
      <View style={pieStyles.legend}>
        {data.map((item, index) => (
          <View key={index} style={pieStyles.legendItem}>
            <View style={[pieStyles.legendDot, { backgroundColor: item.color }]} />
            <Text style={pieStyles.legendLabel}>{item.name}</Text>
            <Text style={pieStyles.legendValue}>{item.value}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// ── Main Component ─────────────────────────────────────────────────────

const ReportsScreen: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('weekly');
  const [weeklyData, setWeeklyData] = useState<WeeklyUsageData | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyComparisonData | null>(null);
  const [categoryData, setCategoryData] = useState<ComplaintCategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [w, m, c] = await Promise.all([
        getWeeklyUsage(),
        getMonthlyComparison(),
        getComplaintCategories(),
      ]);
      setWeeklyData(w);
      setMonthlyData(m);
      setCategoryData(c);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Filter Pills ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterPill, activeFilter === filter && styles.filterPillActive]}
            activeOpacity={0.7}
            onPress={() => setActiveFilter(filter)}
          >
            <Text
              style={[
                styles.filterPillText,
                activeFilter === filter && styles.filterPillTextActive,
              ]}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Water Usage Trend (Line Chart) ── */}
      {weeklyData && (
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Ionicons name="trending-up" size={20} color={COLORS.primary} />
            <Text style={styles.chartTitle}>Water Usage Trend</Text>
          </View>
          <Text style={styles.chartSubtitle}>Daily consumption in liters</Text>
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
              decimalPlaces: 0,
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
            }}
            bezier
            style={styles.chart}
          />
        </View>
      )}

      {/* ── Block-wise Comparison (Bar Chart) ── */}
      {monthlyData && (
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Ionicons name="bar-chart" size={20} color={COLORS.ocean} />
            <Text style={styles.chartTitle}>Block-wise Comparison</Text>
          </View>
          <Text style={styles.chartSubtitle}>Current vs Previous month (liters)</Text>
          <BarChart
            data={{
              labels: monthlyData.labels,
              datasets: [{ data: monthlyData.datasets[0] }],
            }}
            width={CHART_WIDTH}
            height={220}
            yAxisSuffix="L"
            yAxisLabel=""
            chartConfig={{
              backgroundColor: COLORS.card,
              backgroundGradientFrom: COLORS.card,
              backgroundGradientTo: COLORS.card,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(14, 165, 233, ${opacity})`,
              labelColor: () => COLORS.textSecondary,
              barPercentage: 0.6,
              propsForBackgroundLines: {
                strokeDasharray: '6,6',
                stroke: COLORS.border,
              },
            }}
            style={styles.chart}
          />
        </View>
      )}

      {/* ── Complaint Categories (Stacked Horizontal Bar) ── */}
      {categoryData.length > 0 && (
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Ionicons name="pie-chart" size={20} color={COLORS.cyan} />
            <Text style={styles.chartTitle}>Complaint Categories</Text>
          </View>
          <Text style={styles.chartSubtitle}>Distribution by type</Text>
          <HorizontalBarChart data={categoryData} />
        </View>
      )}

      {/* ── Export Section ── */}
      <View style={styles.exportSection}>
        <Text style={styles.exportTitle}>Export Reports</Text>
        <Text style={styles.exportSubtitle}>
          Download reports for offline analysis
        </Text>
        <View style={styles.exportRow}>
          <TouchableOpacity
            style={styles.exportButton}
            activeOpacity={0.8}
            onPress={() => Alert.alert('Coming Soon', 'PDF export will be available soon.')}
          >
            <Ionicons name="document-text" size={20} color={COLORS.textWhite} />
            <Text style={styles.exportButtonText}>Export PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.exportButton, styles.exportExcel]}
            activeOpacity={0.8}
            onPress={() =>
              Alert.alert('Coming Soon', 'Excel export will be available soon.')
            }
          >
            <Ionicons name="grid" size={20} color={COLORS.mint} />
            <Text style={[styles.exportButtonText, { color: COLORS.mint }]}>
              Export Excel
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: SPACING.huge }} />
    </ScrollView>
  );
};

// ── Pie / Stacked Bar Styles ───────────────────────────────────────────

const pieStyles = StyleSheet.create({
  stackedBar: {
    flexDirection: 'row',
    height: 24,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
    marginTop: SPACING.sm,
  },
  stackedSegment: {
    height: '100%',
  },
  legend: {
    gap: SPACING.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    flex: 1,
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
  },
  legendValue: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
});

// ── Main Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingTop: SPACING.lg,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },

  // Filters
  filterRow: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.md,
    gap: SPACING.sm,
  },
  filterPill: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm + 2,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterPillText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  filterPillTextActive: {
    color: COLORS.textWhite,
  },

  // Chart card
  chartCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
    ...SHADOWS.medium,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  chartTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
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

  // Export
  exportSection: {
    marginHorizontal: SPACING.xl,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.medium,
  },
  exportTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
  },
  exportSubtitle: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  exportRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  exportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md + 2,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.primary,
    gap: SPACING.sm,
    ...SHADOWS.small,
  },
  exportExcel: {
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.mint,
  },
  exportButtonText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    color: COLORS.textWhite,
  },
});

export default ReportsScreen;
