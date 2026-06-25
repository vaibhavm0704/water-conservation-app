import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
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
import LoadingState from '../../../shared/components/LoadingState';
import EmptyState from '../../../shared/components/EmptyState';
import { getNotices } from '../services/facilityService';
import { WaterNotice, NoticeType, NoticeStatus } from '../types/facilityTypes';

interface NoticesScreenProps {
  navigation?: any;
}

const TYPE_CONFIG: Record<
  NoticeType,
  { label: string; color: string; bg: string; icon: string; iconSet: 'ionicons' | 'material' }
> = {
  shutdown: {
    label: 'Shutdown',
    color: COLORS.error,
    bg: COLORS.errorLight,
    icon: 'power-outline',
    iconSet: 'ionicons',
  },
  cleaning: {
    label: 'Cleaning',
    color: COLORS.ocean,
    bg: COLORS.aquaMist,
    icon: 'broom',
    iconSet: 'material',
  },
  repair: {
    label: 'Repair',
    color: COLORS.warning,
    bg: COLORS.warningLight,
    icon: 'hammer-wrench',
    iconSet: 'material',
  },
  testing: {
    label: 'Testing',
    color: COLORS.cyan,
    bg: '#E0F7FA',
    icon: 'flask-outline',
    iconSet: 'ionicons',
  },
  emergency: {
    label: 'Emergency',
    color: '#DC2626',
    bg: '#FEF2F2',
    icon: 'alert-circle-outline',
    iconSet: 'ionicons',
  },
};

const STATUS_LABELS: Record<NoticeStatus, { label: string; color: string }> = {
  active: { label: 'Active', color: COLORS.success },
  scheduled: { label: 'Scheduled', color: COLORS.ocean },
  completed: { label: 'Completed', color: COLORS.textTertiary },
  cancelled: { label: 'Cancelled', color: COLORS.error },
};

const NoticesScreen: React.FC<NoticesScreenProps> = ({ navigation }) => {
  const [notices, setNotices] = useState<WaterNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotices = useCallback(async () => {
    try {
      const data = await getNotices();
      setNotices(data);
    } catch (error) {
      console.error('Failed to load notices:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadNotices();
  }, [loadNotices]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadNotices();
  }, [loadNotices]);

  const renderNotice = ({ item }: { item: WaterNotice }) => {
    const typeCfg = TYPE_CONFIG[item.type];
    const statusCfg = STATUS_LABELS[item.status];

    return (
      <View style={[styles.card, { borderLeftColor: typeCfg.color }]}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={[styles.iconCircle, { backgroundColor: typeCfg.bg }]}>
            {typeCfg.iconSet === 'ionicons' ? (
              <Ionicons
                name={typeCfg.icon as keyof typeof Ionicons.glyphMap}
                size={18}
                color={typeCfg.color}
              />
            ) : (
              <MaterialCommunityIcons
                name={typeCfg.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                size={18}
                color={typeCfg.color}
              />
            )}
          </View>
          <View style={styles.badgesRow}>
            <View style={[styles.typeBadge, { backgroundColor: typeCfg.bg }]}>
              <Text style={[styles.typeText, { color: typeCfg.color }]}>{typeCfg.label}</Text>
            </View>
            <View style={[styles.statusDot, { backgroundColor: statusCfg.color }]} />
            <Text style={[styles.statusLabel, { color: statusCfg.color }]}>{statusCfg.label}</Text>
          </View>
        </View>

        {/* Title & Description */}
        <Text style={styles.noticeTitle}>{item.title}</Text>
        <Text style={styles.noticeDescription} numberOfLines={3}>
          {item.description}
        </Text>

        {/* Time Range */}
        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={14} color={COLORS.textTertiary} />
          <Text style={styles.timeText}>
            {item.startTime} – {item.endTime}
          </Text>
        </View>

        {/* Author */}
        <View style={styles.authorRow}>
          <Ionicons name="person-circle-outline" size={14} color={COLORS.textTertiary} />
          <Text style={styles.authorText}>Posted by {item.createdBy}</Text>
          <Text style={styles.dateText}> · {item.createdAt}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return <LoadingState message="Loading notices..." />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Water Notices</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation?.navigate?.('CreateNotice')}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={20} color={COLORS.textWhite} />
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>

      {notices.length === 0 ? (
        <EmptyState
          title="No Notices"
          description="There are no water notices at the moment."
          icon="megaphone-outline"
          actionLabel="Create Notice"
          onAction={() => navigation?.navigate?.('CreateNotice')}
        />
      ) : (
        <FlatList
          data={notices}
          renderItem={renderNotice}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    borderRadius: BORDER_RADIUS.round,
    ...SHADOWS.medium,
  },
  createButtonText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textWhite,
  },
  listContent: {
    padding: SPACING.xl,
    gap: SPACING.lg,
    paddingBottom: SPACING.massive,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderLeftWidth: 4,
    ...SHADOWS.medium,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  typeBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs - 1,
    borderRadius: BORDER_RADIUS.round,
  },
  typeText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xs,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: BORDER_RADIUS.round,
  },
  statusLabel: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.xs,
  },
  noticeTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  noticeDescription: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  timeText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  authorText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
  },
  dateText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
  },
});

export default NoticesScreen;
