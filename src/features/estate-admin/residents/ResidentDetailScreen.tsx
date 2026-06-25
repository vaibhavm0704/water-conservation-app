// Estate Admin - Resident Detail Screen
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  FONT_FAMILY,
  FONT_SIZE,
} from '../../../shared/constants/theme';
import { removeResident } from '../services/estateService';
import type { Resident } from '../types/estateTypes';

// ── Helpers ────────────────────────────────────────────────────────────

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const statusColor = (status: Resident['status']) => {
  switch (status) {
    case 'active':
      return COLORS.success;
    case 'inactive':
      return COLORS.error;
    case 'pending':
      return COLORS.warning;
  }
};

const statusBg = (status: Resident['status']) => {
  switch (status) {
    case 'active':
      return COLORS.successLight;
    case 'inactive':
      return COLORS.errorLight;
    case 'pending':
      return COLORS.warningLight;
  }
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// ── Info Card ──────────────────────────────────────────────────────────

const InfoCard: React.FC<{
  icon: string;
  iconFamily?: 'ionicons' | 'material';
  label: string;
  value: string;
  color?: string;
}> = ({ icon, iconFamily = 'ionicons', label, value, color = COLORS.primary }) => (
  <View style={styles.infoCard}>
    <View style={[styles.infoIconWrap, { backgroundColor: `${color}15` }]}>
      {iconFamily === 'material' ? (
        <MaterialCommunityIcons name={icon as any} size={20} color={color} />
      ) : (
        <Ionicons name={icon as any} size={20} color={color} />
      )}
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

// ── Main Component ─────────────────────────────────────────────────────

const ResidentDetailScreen: React.FC<{ route?: any; navigation?: any }> = ({
  route,
  navigation,
}) => {
  const resident: Resident = route?.params?.resident ?? {
    id: 'r0',
    name: 'Unknown',
    email: 'N/A',
    phone: 'N/A',
    flatNumber: 'N/A',
    blockName: 'N/A',
    status: 'inactive' as const,
    joinDate: new Date().toISOString(),
  };

  const handleRemove = () => {
    Alert.alert(
      'Remove Resident',
      `Are you sure you want to remove ${resident.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await removeResident(resident.id);
            Alert.alert('Removed', 'Resident has been removed.');
            navigation?.goBack?.();
          },
        },
      ]
    );
  };

  // Mock water usage data for individual
  const waterUsage = {
    thisMonth: '1,250 L',
    lastMonth: '1,380 L',
    savings: '9.4%',
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Profile Header ── */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarLargeText}>{getInitials(resident.name)}</Text>
        </View>
        <Text style={styles.profileName}>{resident.name}</Text>
        <Text style={styles.profileFlat}>
          {resident.flatNumber} • {resident.blockName}
        </Text>
        <View
          style={[styles.statusBadge, { backgroundColor: statusBg(resident.status) }]}
        >
          <View
            style={[styles.statusDot, { backgroundColor: statusColor(resident.status) }]}
          />
          <Text style={[styles.statusText, { color: statusColor(resident.status) }]}>
            {resident.status.charAt(0).toUpperCase() + resident.status.slice(1)}
          </Text>
        </View>
      </View>

      {/* ── Contact & Info Cards ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <InfoCard icon="call" label="Phone" value={resident.phone} color={COLORS.ocean} />
        <InfoCard
          icon="mail"
          label="Email"
          value={resident.email}
          color={COLORS.primary}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Property Details</Text>
        <InfoCard
          icon="business"
          label="Block"
          value={resident.blockName}
          color={COLORS.cyan}
        />
        <InfoCard
          icon="home"
          label="Flat Number"
          value={resident.flatNumber}
          color={COLORS.mint}
        />
        <InfoCard
          icon="calendar"
          label="Join Date"
          value={formatDate(resident.joinDate)}
          color={COLORS.primary}
        />
      </View>

      {/* ── Water Usage Summary ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Water Usage</Text>
        <View style={styles.usageRow}>
          <View style={styles.usageCard}>
            <Ionicons name="water" size={22} color={COLORS.ocean} />
            <Text style={styles.usageValue}>{waterUsage.thisMonth}</Text>
            <Text style={styles.usageLabel}>This Month</Text>
          </View>
          <View style={styles.usageCard}>
            <Ionicons name="water-outline" size={22} color={COLORS.textTertiary} />
            <Text style={styles.usageValue}>{waterUsage.lastMonth}</Text>
            <Text style={styles.usageLabel}>Last Month</Text>
          </View>
          <View style={styles.usageCard}>
            <Ionicons name="trending-down" size={22} color={COLORS.mint} />
            <Text style={[styles.usageValue, { color: COLORS.mint }]}>
              {waterUsage.savings}
            </Text>
            <Text style={styles.usageLabel}>Savings</Text>
          </View>
        </View>
      </View>

      {/* ── Action Buttons ── */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          activeOpacity={0.8}
          onPress={() =>
            Alert.alert('Edit', 'Edit functionality coming soon.')
          }
        >
          <Ionicons name="create-outline" size={20} color={COLORS.textWhite} />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.removeButton]}
          activeOpacity={0.8}
          onPress={handleRemove}
        >
          <Ionicons name="trash-outline" size={20} color={COLORS.error} />
          <Text style={[styles.actionButtonText, { color: COLORS.error }]}>Remove</Text>
        </TouchableOpacity>
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
  content: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl,
  },

  // Profile header
  profileHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  avatarLarge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.lightAqua,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  avatarLargeText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xxxl,
    color: COLORS.primary,
  },
  profileName: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xxl,
    color: COLORS.textPrimary,
  },
  profileFlat: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.round,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
  },

  // Sections
  section: {
    marginBottom: SPACING.xxl,
  },
  sectionTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },

  // Info cards
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  infoIconWrap: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
  },
  infoValue: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    marginTop: 2,
  },

  // Water usage
  usageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  usageCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
    ...SHADOWS.small,
  },
  usageValue: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
  },
  usageLabel: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    marginTop: 2,
  },

  // Action buttons
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    gap: SPACING.sm,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.medium,
  },
  removeButton: {
    backgroundColor: COLORS.errorLight,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  actionButtonText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    color: COLORS.textWhite,
  },
});

export default ResidentDetailScreen;
