// Estate Admin - Profile & Settings Screen
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
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

// ── Info Row ───────────────────────────────────────────────────────────

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

// ── Toggle Row ─────────────────────────────────────────────────────────

const ToggleRow: React.FC<{
  label: string;
  value: boolean;
  onToggle: (v: boolean) => void;
}> = ({ label, value, onToggle }) => (
  <View style={styles.toggleRow}>
    <Text style={styles.toggleLabel}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
      thumbColor={value ? COLORS.primary : COLORS.textTertiary}
    />
  </View>
);

// ── Main Component ─────────────────────────────────────────────────────

const ProfileScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  // Notification preferences
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

  // Complaint category toggles
  const [categories, setCategories] = useState([
    { label: 'Water Leakage', enabled: true },
    { label: 'Water Quality', enabled: true },
    { label: 'Billing Issues', enabled: true },
    { label: 'Low Pressure', enabled: false },
    { label: 'Maintenance', enabled: true },
  ]);

  const toggleCategory = useCallback((index: number) => {
    setCategories((prev) =>
      prev.map((c, i) => (i === index ? { ...c, enabled: !c.enabled } : c))
    );
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          // useAuth().logout would be called here
          // For now, just show confirmation
          Alert.alert('Logged out', 'You have been logged out successfully.');
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Profile Header ── */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={36} color={COLORS.primary} />
        </View>
        <Text style={styles.profileName}>Admin User</Text>
        <View style={styles.roleBadge}>
          <MaterialCommunityIcons name="shield-crown" size={14} color={COLORS.primary} />
          <Text style={styles.roleText}>Estate Administrator</Text>
        </View>
      </View>

      {/* ── Estate Information ── */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="business" size={20} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Estate Information</Text>
        </View>
        <InfoRow label="Estate Name" value="GreenVille Estate" />
        <InfoRow label="Address" value="Sector 42, Whitefield, Bengaluru" />
        <InfoRow label="Total Blocks" value="4 Blocks" />
        <InfoRow label="Established" value="January 2020" />
      </View>

      {/* ── Water Rate Settings ── */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="water" size={20} color={COLORS.ocean} />
          <Text style={styles.cardTitle}>Water Rate Settings</Text>
        </View>
        <InfoRow label="Rate per Liter" value="₹0.08" />
        <InfoRow label="Billing Cycle" value="Monthly (1st - 30th)" />
        <InfoRow label="Late Fee" value="₹50 after due date" />
        <InfoRow label="Payment Methods" value="UPI, Card, Net Banking" />
      </View>

      {/* ── Complaint Categories ── */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="list" size={20} color={COLORS.cyan} />
          <Text style={styles.cardTitle}>Complaint Categories</Text>
        </View>
        {categories.map((cat, index) => (
          <ToggleRow
            key={cat.label}
            label={cat.label}
            value={cat.enabled}
            onToggle={() => toggleCategory(index)}
          />
        ))}
      </View>

      {/* ── Notification Preferences ── */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="notifications" size={20} color={COLORS.mint} />
          <Text style={styles.cardTitle}>Notification Preferences</Text>
        </View>
        <ToggleRow
          label="Push Notifications"
          value={pushEnabled}
          onToggle={setPushEnabled}
        />
        <ToggleRow
          label="Email Notifications"
          value={emailEnabled}
          onToggle={setEmailEnabled}
        />
      </View>

      {/* ── Logout Button ── */}
      <TouchableOpacity
        style={styles.logoutButton}
        activeOpacity={0.8}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={22} color={COLORS.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

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
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.lightAqua,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  profileName: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xxl,
    color: COLORS.textPrimary,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.lightAqua,
  },
  roleText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
  },

  // Card
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    ...SHADOWS.medium,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  cardTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
  },

  // Info row
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  infoLabel: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    flex: 1,
  },
  infoValue: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    textAlign: 'right',
    flex: 1,
  },

  // Toggle row
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  toggleLabel: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
  },

  // Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.errorLight,
    borderWidth: 1,
    borderColor: COLORS.error,
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  logoutText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.error,
  },
});

export default ProfileScreen;
