import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  FONT_FAMILY,
  FONT_SIZE,
} from '../constants/theme';

interface ResidentCardProps {
  name: string;
  flatNumber: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  avatar?: string;
  onEdit?: () => void;
  onView?: () => void;
  onRemove?: () => void;
}

const ResidentCard: React.FC<ResidentCardProps> = ({
  name,
  flatNumber,
  phone,
  email,
  status,
  avatar,
  onEdit,
  onView,
  onRemove,
}) => {
  const initials = name
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const isActive = status === 'active';

  return (
    <View style={styles.card}>
      <View style={styles.topSection}>
        {/* Avatar */}
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.initials}>{initials}</Text>
          </View>
        )}

        {/* Info */}
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: isActive ? COLORS.successLight : COLORS.errorLight,
                },
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: isActive ? COLORS.success : COLORS.error },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: isActive ? COLORS.success : COLORS.error },
                ]}
              >
                {isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>

          <Text style={styles.flatNumber}>Flat {flatNumber}</Text>
        </View>
      </View>

      {/* Contact Details */}
      <View style={styles.contactRow}>
        <View style={styles.contactItem}>
          <Ionicons name="call-outline" size={14} color={COLORS.textTertiary} />
          <Text style={styles.contactText}>{phone}</Text>
        </View>
        <View style={styles.contactItem}>
          <Ionicons name="mail-outline" size={14} color={COLORS.textTertiary} />
          <Text style={styles.contactText} numberOfLines={1}>
            {email}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {onView && (
          <TouchableOpacity style={styles.actionBtn} onPress={onView} activeOpacity={0.7}>
            <Ionicons name="eye-outline" size={18} color={COLORS.primary} />
            <Text style={styles.actionText}>View</Text>
          </TouchableOpacity>
        )}
        {onEdit && (
          <TouchableOpacity style={styles.actionBtn} onPress={onEdit} activeOpacity={0.7}>
            <Ionicons name="create-outline" size={18} color={COLORS.ocean} />
            <Text style={[styles.actionText, { color: COLORS.ocean }]}>Edit</Text>
          </TouchableOpacity>
        )}
        {onRemove && (
          <TouchableOpacity style={styles.actionBtn} onPress={onRemove} activeOpacity={0.7}>
            <Ionicons name="trash-outline" size={18} color={COLORS.error} />
            <Text style={[styles.actionText, { color: COLORS.error }]}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.medium,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: BORDER_RADIUS.round,
  },
  avatarFallback: {
    width: 52,
    height: 52,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.lightAqua,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xl,
    color: COLORS.primary,
  },
  info: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  name: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: SPACING.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs - 1,
    borderRadius: BORDER_RADIUS.round,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.xs,
  },
  flatNumber: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.lg,
    marginBottom: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  contactText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surface,
  },
  actionText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
  },
});

export default ResidentCard;
