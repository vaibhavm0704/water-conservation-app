import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  FONT_FAMILY,
  FONT_SIZE,
} from '../constants/theme';

type Priority = 'high' | 'medium' | 'low';
type Status = 'pending' | 'in_progress' | 'resolved';

interface ComplaintCardProps {
  ticketId: string;
  residentName: string;
  issueType: string;
  priority: Priority;
  status: Status;
  date: string;
  onPress?: () => void;
}

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string }> = {
  high: { label: 'High', color: COLORS.error, bg: COLORS.errorLight },
  medium: { label: 'Medium', color: COLORS.warning, bg: COLORS.warningLight },
  low: { label: 'Low', color: COLORS.success, bg: COLORS.successLight },
};

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string; icon: keyof typeof Ionicons.glyphMap }> = {
  pending: { label: 'Pending', color: COLORS.warning, bg: COLORS.warningLight, icon: 'time-outline' },
  in_progress: { label: 'In Progress', color: COLORS.info, bg: COLORS.infoLight, icon: 'construct-outline' },
  resolved: { label: 'Resolved', color: COLORS.success, bg: COLORS.successLight, icon: 'checkmark-circle-outline' },
};

const ComplaintCard: React.FC<ComplaintCardProps> = ({
  ticketId,
  residentName,
  issueType,
  priority,
  status,
  date,
  onPress,
}) => {
  const priorityCfg = PRIORITY_CONFIG[priority];
  const statusCfg = STATUS_CONFIG[status];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      {/* Priority Bar */}
      <View style={[styles.priorityBar, { backgroundColor: priorityCfg.color }]} />

      <View style={styles.content}>
        {/* Top Row */}
        <View style={styles.topRow}>
          <Text style={styles.ticketId}>#{ticketId}</Text>
          <View style={[styles.priorityBadge, { backgroundColor: priorityCfg.bg }]}>
            <Text style={[styles.priorityText, { color: priorityCfg.color }]}>
              {priorityCfg.label}
            </Text>
          </View>
        </View>

        {/* Issue Type */}
        <Text style={styles.issueType} numberOfLines={2}>
          {issueType}
        </Text>

        {/* Resident Name */}
        <View style={styles.residentRow}>
          <Ionicons name="person-outline" size={14} color={COLORS.textTertiary} />
          <Text style={styles.residentName}>{residentName}</Text>
        </View>

        {/* Bottom Row */}
        <View style={styles.bottomRow}>
          <View style={[styles.statusChip, { backgroundColor: statusCfg.bg }]}>
            <Ionicons name={statusCfg.icon} size={12} color={statusCfg.color} />
            <Text style={[styles.statusText, { color: statusCfg.color }]}>
              {statusCfg.label}
            </Text>
          </View>

          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={12} color={COLORS.textTertiary} />
            <Text style={styles.dateText}>{date}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    flexDirection: 'row',
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  priorityBar: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  ticketId: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
  },
  priorityBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs - 1,
    borderRadius: BORDER_RADIUS.round,
  },
  priorityText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xs,
  },
  issueType: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  residentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  residentName: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
    gap: 4,
  },
  statusText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.xs,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
  },
});

export default ComplaintCard;
