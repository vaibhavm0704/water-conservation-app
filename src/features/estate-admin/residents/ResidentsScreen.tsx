// Estate Admin - Residents List Screen
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  FONT_FAMILY,
  FONT_SIZE,
} from '../../../shared/constants/theme';
import { getResidents, searchResidents } from '../services/estateService';
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

// ── Resident Row ───────────────────────────────────────────────────────

const ResidentRow: React.FC<{
  resident: Resident;
  onPress: () => void;
}> = ({ resident, onPress }) => (
  <TouchableOpacity style={styles.residentCard} activeOpacity={0.7} onPress={onPress}>
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{getInitials(resident.name)}</Text>
    </View>
    <View style={styles.residentInfo}>
      <Text style={styles.residentName}>{resident.name}</Text>
      <Text style={styles.residentFlat}>
        {resident.flatNumber} • {resident.blockName.split(' - ')[0]}
      </Text>
    </View>
    <View style={[styles.statusBadge, { backgroundColor: statusBg(resident.status) }]}>
      <View style={[styles.statusDot, { backgroundColor: statusColor(resident.status) }]} />
      <Text style={[styles.statusText, { color: statusColor(resident.status) }]}>
        {resident.status.charAt(0).toUpperCase() + resident.status.slice(1)}
      </Text>
    </View>
  </TouchableOpacity>
);

// ── Main Component ─────────────────────────────────────────────────────

const ResidentsScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadResidents = useCallback(async () => {
    try {
      const data = await getResidents();
      setResidents(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadResidents();
    }, [loadResidents])
  );

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim()) {
        const results = await searchResidents(searchQuery);
        setResidents(results);
      } else {
        const all = await getResidents();
        setResidents(all);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setSearchQuery('');
    await loadResidents();
    setRefreshing(false);
  }, [loadResidents]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ── Search Bar ── */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search residents..."
            placeholderTextColor={COLORS.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Residents List ── */}
      <FlatList
        data={residents}
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
        renderItem={({ item }) => (
          <ResidentRow
            resident={item}
            onPress={() => navigation?.navigate?.('ResidentDetail', { resident: item })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color={COLORS.textTertiary} />
            <Text style={styles.emptyText}>No residents found</Text>
          </View>
        }
      />

      {/* ── FAB ── */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => navigation?.navigate?.('AddResident')}
      >
        <Ionicons name="add" size={28} color={COLORS.textWhite} />
      </TouchableOpacity>
    </View>
  );
};

// ── Styles ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },

  // Search
  searchContainer: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    ...SHADOWS.small,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    padding: 0,
  },

  // List
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
    paddingBottom: 100,
  },

  // Resident card
  residentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.lightAqua,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.primary,
  },
  residentInfo: {
    flex: 1,
  },
  residentName: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
  },
  residentFlat: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.xs,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    marginTop: SPACING.massive,
  },
  emptyText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textTertiary,
    marginTop: SPACING.md,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: SPACING.xxl,
    right: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.large,
  },
});

export default ResidentsScreen;
