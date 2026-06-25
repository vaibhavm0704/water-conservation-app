// ============================================================
// AquaEstate — Complaints List Screen
// ============================================================

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  FONT_FAMILY,
  FONT_SIZE,
} from '../../../shared/constants/theme';
import { Complaint, ComplaintStatus } from '../types/residentTypes';
import { getComplaints } from '../services/residentService';

// ── Status Badge ─────────────────────────────────────────────
const STATUS_CONFIG: Record<
  ComplaintStatus,
  { bg: string; text: string; label: string; icon: string }
> = {
  open: {
    bg: COLORS.warningLight,
    text: COLORS.warning,
    label: 'Open',
    icon: 'alert-circle',
  },
  'in-progress': {
    bg: COLORS.infoLight,
    text: COLORS.info,
    label: 'In Progress',
    icon: 'time',
  },
  resolved: {
    bg: COLORS.successLight,
    text: COLORS.success,
    label: 'Resolved',
    icon: 'checkmark-circle',
  },
  closed: {
    bg: COLORS.surface,
    text: COLORS.textTertiary,
    label: 'Closed',
    icon: 'close-circle',
  },
};

const ISSUE_ICONS: Record<string, string> = {
  Leakage: 'water-outline',
  'No Water': 'water-off',
  'Low Pressure': 'speedometer-outline',
  'Dirty Water': 'flask-outline',
  Others: 'help-circle-outline',
};

// ── Complaint Card ───────────────────────────────────────────
const ComplaintItem: React.FC<{ item: Complaint; index: number }> = ({
  item,
  index,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const status = STATUS_CONFIG[item.status];
  const iconName =
    ISSUE_ICONS[item.issueType] || 'help-circle-outline';

  // For 'No Water' we need MaterialCommunityIcons
  const isNoWater = item.issueType === 'No Water';

  return (
    <Animated.View
      style={[
        styles.card,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.cardRow}>
        {/* Icon */}
        <View style={[styles.issueIconWrap, { backgroundColor: COLORS.lightAqua }]}>
          {isNoWater ? (
            <MaterialCommunityIcons
              name="water-off"
              size={22}
              color={COLORS.primary}
            />
          ) : (
            <Ionicons name={iconName as any} size={22} color={COLORS.primary} />
          )}
        </View>

        {/* Info */}
        <View style={styles.cardInfo}>
          <View style={styles.cardTopRow}>
            <Text style={styles.ticketId}>{item.ticketId}</Text>
            <View style={[styles.badge, { backgroundColor: status.bg }]}>
              <Ionicons name={status.icon as any} size={12} color={status.text} />
              <Text style={[styles.badgeText, { color: status.text }]}>
                {status.label}
              </Text>
            </View>
          </View>

          <Text style={styles.issueType}>{item.issueType}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.dateRow}>
            <Ionicons
              name="calendar-outline"
              size={13}
              color={COLORS.textTertiary}
            />
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

// ── Main Screen ──────────────────────────────────────────────
const ComplaintsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getComplaints();
    setComplaints(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, []);

  // Re-load when navigating back from raise-complaint
  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      load();
    });
    return unsub;
  }, [navigation, load]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Complaints</Text>
        <Text style={styles.headerSub}>
          {complaints.length} total • {complaints.filter((c) => c.status === 'open').length} open
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={complaints}
        keyExtractor={(c) => c.id}
        renderItem={({ item, index }) => (
          <ComplaintItem item={item} index={index} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>Loading…</Text>
            </View>
          ) : (
            <View style={styles.emptyWrap}>
              <Ionicons
                name="chatbubbles-outline"
                size={56}
                color={COLORS.textTertiary}
              />
              <Text style={styles.emptyText}>No complaints yet</Text>
            </View>
          )
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('RaiseComplaint')}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

// ── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },

  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 48,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.background,
  },
  title: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xxl,
    color: COLORS.textPrimary,
  },
  headerSub: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
    marginTop: 2,
  },

  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 100,
  },

  // Card
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  cardRow: { flexDirection: 'row' },
  issueIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  cardInfo: { flex: 1 },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  ticketId: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.round,
    gap: 4,
  },
  badgeText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 10,
  },
  issueType: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  description: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SPACING.sm,
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

  // Empty
  emptyWrap: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.textTertiary,
    marginTop: SPACING.md,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.large,
  },
});

export default ComplaintsScreen;
