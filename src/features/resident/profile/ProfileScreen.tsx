// ============================================================
// AquaEstate — Resident Profile Screen
// ============================================================

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
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
import { Bill } from '../types/residentTypes';
import { getBills, downloadBill } from '../services/residentService';

import { useAuth } from '../../../context/AuthContext';
// import { useNotifications } from '../../../context/NotificationContext';

// ── Status badge helper ──────────────────────────────────────
const statusColor = (s: Bill['status']) => {
  switch (s) {
    case 'paid':
      return { bg: COLORS.successLight, text: COLORS.success };
    case 'pending':
      return { bg: COLORS.warningLight, text: COLORS.warning };
    case 'overdue':
      return { bg: COLORS.errorLight, text: COLORS.error };
  }
};

// ── Profile Screen ───────────────────────────────────────────
const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getBills();
    setBills(data);
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

  const handleDownloadBill = async (id: string) => {
    try {
      const url = await downloadBill(id);
      Alert.alert('Bill Downloaded', `Your bill is ready.\n${url}`);
    } catch {
      Alert.alert('Error', 'Failed to download bill.');
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* ── Profile Header ──────────────────────────────── */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarInitials}>
                {user?.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.profileName}>{user?.name}</Text>
            <View style={styles.badgeRow}>
              <View style={styles.roleBadge}>
                <Ionicons name="person" size={12} color={COLORS.primary} />
                <Text style={styles.roleBadgeText}>Resident</Text>
              </View>
              <View style={styles.flatBadge}>
                <Ionicons name="home" size={12} color={COLORS.ocean} />
                <Text style={styles.flatBadgeText}>{user?.flatNumber}</Text>
              </View>
            </View>
          </View>

          {/* ── Personal Details ─────────────────────────────── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Personal Details</Text>
            <DetailRow
              icon="person-outline"
              label="Name"
              value={user?.name || ''}
            />
            <DetailRow
              icon="call-outline"
              label="Phone"
              value={user?.phone || ''}
            />
            <DetailRow
              icon="mail-outline"
              label="Email"
              value={user?.email || ''}
            />
            <DetailRow
              icon="home-outline"
              label="Flat"
              value={`${user?.flatNumber}, ${user?.estateName}`}
              last
            />
          </View>

          {/* ── Bill History ──────────────────────────────────── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Bill History</Text>
            {bills.map((bill, idx) => {
              const sc = statusColor(bill.status);
              return (
                <View
                  key={bill.id}
                  style={[
                    styles.billRow,
                    idx === bills.length - 1 && styles.lastRow,
                  ]}
                >
                  <View style={styles.billInfo}>
                    <Text style={styles.billMonth}>
                      {bill.month} {bill.year}
                    </Text>
                    <Text style={styles.billAmount}>
                      ₹{bill.amount.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.billRight}>
                    <View
                      style={[styles.statusBadge, { backgroundColor: sc.bg }]}
                    >
                      <Text style={[styles.statusText, { color: sc.text }]}>
                        {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDownloadBill(bill.id)}
                      activeOpacity={0.7}
                      style={styles.downloadBtn}
                    >
                      <Ionicons
                        name="download-outline"
                        size={20}
                        color={COLORS.primary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>

          {/* ── Settings ──────────────────────────────────────── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Settings</Text>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color={COLORS.textPrimary}
                />
                <Text style={styles.settingLabel}>Push Notifications</Text>
              </View>
              <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                trackColor={{
                  false: COLORS.border,
                  true: COLORS.primaryLight,
                }}
                thumbColor={pushEnabled ? COLORS.primary : COLORS.textTertiary}
              />
            </View>
            <View style={[styles.settingRow, styles.lastRow]}>
              <View style={styles.settingLeft}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={COLORS.textPrimary}
                />
                <Text style={styles.settingLabel}>Email Notifications</Text>
              </View>
              <Switch
                value={emailEnabled}
                onValueChange={setEmailEnabled}
                trackColor={{
                  false: COLORS.border,
                  true: COLORS.primaryLight,
                }}
                thumbColor={emailEnabled ? COLORS.primary : COLORS.textTertiary}
              />
            </View>
          </View>

          {/* ── Logout ────────────────────────────────────────── */}
          <TouchableOpacity
            style={styles.logoutBtn}
            activeOpacity={0.8}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          <View style={{ height: SPACING.huge }} />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

// ── Detail Row ───────────────────────────────────────────────
const DetailRow: React.FC<{
  icon: string;
  label: string;
  value: string;
  last?: boolean;
}> = ({ icon, label, value, last }) => (
  <View style={[styles.detailRow, last && styles.lastRow]}>
    <View style={styles.detailIconWrap}>
      <Ionicons name={icon as any} size={18} color={COLORS.primary} />
    </View>
    <View style={styles.detailTexts}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

// ── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  scrollContent: {
    paddingTop: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.massive,
  },

  // Profile Header
  profileHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  avatarLarge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  avatarInitials: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: 32,
    color: '#FFFFFF',
  },
  profileName: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xxl,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightAqua,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
    gap: 4,
  },
  roleBadgeText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
  },
  flatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.aquaMist,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
    gap: 4,
  },
  flatBadgeText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.xs,
    color: COLORS.ocean,
  },

  // Card
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.small,
  },
  cardTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },

  // Detail Row
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: SPACING.md,
    marginBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  lastRow: {
    borderBottomWidth: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
  detailIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.lightAqua,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  detailTexts: { flex: 1 },
  detailLabel: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    marginBottom: 2,
  },
  detailValue: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
  },

  // Bill Row
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: SPACING.md,
    marginBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  billInfo: {},
  billMonth: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
  },
  billAmount: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  billRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.round,
  },
  statusText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.xs,
  },
  downloadBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.lightAqua,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Settings
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: SPACING.md,
    marginBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  settingLabel: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
  },

  // Logout
  logoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.errorLight,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.lg,
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
