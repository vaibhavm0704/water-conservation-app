import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  FONT_FAMILY,
  FONT_SIZE,
} from '../constants/theme';

type NoticeType = 'shutdown' | 'cleaning' | 'repair';

interface NoticeCardProps {
  title: string;
  description: string;
  type: NoticeType;
  startTime: string;
  endTime: string;
  createdBy: string;
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
};

const NoticeCard: React.FC<NoticeCardProps> = ({
  title,
  description,
  type,
  startTime,
  endTime,
  createdBy,
}) => {
  const cfg = TYPE_CONFIG[type];

  return (
    <View style={[styles.card, { borderLeftColor: cfg.color }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: cfg.bg }]}>
          {cfg.iconSet === 'ionicons' ? (
            <Ionicons
              name={cfg.icon as keyof typeof Ionicons.glyphMap}
              size={18}
              color={cfg.color}
            />
          ) : (
            <MaterialCommunityIcons
              name={cfg.icon as keyof typeof MaterialCommunityIcons.glyphMap}
              size={18}
              color={cfg.color}
            />
          )}
        </View>

        <View style={[styles.typeBadge, { backgroundColor: cfg.bg }]}>
          <Text style={[styles.typeText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
      </View>

      {/* Title & Description */}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description} numberOfLines={3}>
        {description}
      </Text>

      {/* Time Range */}
      <View style={styles.timeRow}>
        <Ionicons name="time-outline" size={14} color={COLORS.textTertiary} />
        <Text style={styles.timeText}>
          {startTime} – {endTime}
        </Text>
      </View>

      {/* Created By */}
      <View style={styles.authorRow}>
        <Ionicons name="person-circle-outline" size={14} color={COLORS.textTertiary} />
        <Text style={styles.authorText}>Posted by {createdBy}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderLeftWidth: 4,
    ...SHADOWS.medium,
  },
  header: {
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
  typeBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs - 1,
    borderRadius: BORDER_RADIUS.round,
  },
  typeText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xs,
  },
  title: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  description: {
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
});

export default NoticeCard;
