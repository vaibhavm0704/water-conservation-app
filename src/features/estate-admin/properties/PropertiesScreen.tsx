// Estate Admin - Properties Screen (Blocks & Flats)
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  FONT_FAMILY,
  FONT_SIZE,
} from '../../../shared/constants/theme';
import { getBlocks, getFlats } from '../services/estateService';
import type { Block, Flat } from '../types/estateTypes';

// ── Occupancy badge helpers ────────────────────────────────────────────

const occupancyColor = (status: Flat['occupancyStatus']) => {
  switch (status) {
    case 'occupied':
      return COLORS.success;
    case 'vacant':
      return COLORS.warning;
    case 'maintenance':
      return COLORS.error;
  }
};

const occupancyBg = (status: Flat['occupancyStatus']) => {
  switch (status) {
    case 'occupied':
      return COLORS.successLight;
    case 'vacant':
      return COLORS.warningLight;
    case 'maintenance':
      return COLORS.errorLight;
  }
};

// ── Block Card ─────────────────────────────────────────────────────────

const BlockCard: React.FC<{ block: Block }> = ({ block }) => {
  const occupancyPct = Math.round((block.totalResidents / block.totalFlats) * 100);

  return (
    <View style={styles.blockCard}>
      <View style={styles.blockHeader}>
        <View style={styles.blockIconWrap}>
          <MaterialCommunityIcons name="office-building" size={24} color={COLORS.primary} />
        </View>
        <View style={styles.blockInfo}>
          <Text style={styles.blockName}>{block.name}</Text>
          <Text style={styles.blockDesc}>{block.description}</Text>
        </View>
      </View>

      <View style={styles.blockStats}>
        <View style={styles.blockStat}>
          <Ionicons name="home-outline" size={16} color={COLORS.cyan} />
          <Text style={styles.blockStatText}>{block.totalFlats} Flats</Text>
        </View>
        <View style={styles.blockStat}>
          <Ionicons name="people-outline" size={16} color={COLORS.ocean} />
          <Text style={styles.blockStatText}>{block.totalResidents} Residents</Text>
        </View>
        <View style={styles.blockStat}>
          <Ionicons name="analytics-outline" size={16} color={COLORS.mint} />
          <Text style={styles.blockStatText}>{occupancyPct}% Occupied</Text>
        </View>
      </View>

      {/* Occupancy progress bar */}
      <View style={styles.progressBg}>
        <View
          style={[
            styles.progressFill,
            { width: `${occupancyPct}%` },
          ]}
        />
      </View>
    </View>
  );
};

// ── Flat Card ──────────────────────────────────────────────────────────

const FlatCard: React.FC<{ flat: Flat }> = ({ flat }) => (
  <View style={styles.flatCard}>
    <View style={styles.flatLeft}>
      <View style={styles.flatIconWrap}>
        <Ionicons name="home" size={20} color={COLORS.ocean} />
      </View>
      <View>
        <Text style={styles.flatNumber}>{flat.flatNumber}</Text>
        <Text style={styles.flatOwner}>
          {flat.ownerName || 'No owner assigned'}
        </Text>
        <Text style={styles.flatArea}>{flat.area} sq.ft. • {flat.blockName.split(' - ')[0]}</Text>
      </View>
    </View>
    <View style={[styles.occupancyBadge, { backgroundColor: occupancyBg(flat.occupancyStatus) }]}>
      <Text style={[styles.occupancyText, { color: occupancyColor(flat.occupancyStatus) }]}>
        {flat.occupancyStatus.charAt(0).toUpperCase() + flat.occupancyStatus.slice(1)}
      </Text>
    </View>
  </View>
);

// ── Main Component ─────────────────────────────────────────────────────

const PropertiesScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blocks' | 'flats'>('blocks');
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [flats, setFlats] = useState<Flat[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [b, f] = await Promise.all([getBlocks(), getFlats()]);
      setBlocks(b);
      setFlats(f);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ── Tab Bar ── */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'blocks' && styles.tabActive]}
          activeOpacity={0.7}
          onPress={() => setActiveTab('blocks')}
        >
          <MaterialCommunityIcons
            name="office-building"
            size={18}
            color={activeTab === 'blocks' ? COLORS.primary : COLORS.textTertiary}
          />
          <Text style={[styles.tabText, activeTab === 'blocks' && styles.tabTextActive]}>
            Blocks
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'flats' && styles.tabActive]}
          activeOpacity={0.7}
          onPress={() => setActiveTab('flats')}
        >
          <Ionicons
            name="home"
            size={18}
            color={activeTab === 'flats' ? COLORS.primary : COLORS.textTertiary}
          />
          <Text style={[styles.tabText, activeTab === 'flats' && styles.tabTextActive]}>
            Flats
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Content ── */}
      {activeTab === 'blocks' ? (
        <FlatList
          data={blocks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <BlockCard block={item} />}
        />
      ) : (
        <FlatList
          data={flats}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <FlatCard flat={item} />}
        />
      )}
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

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xs,
    ...SHADOWS.small,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
  },
  tabActive: {
    backgroundColor: COLORS.lightAqua,
  },
  tabText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.textTertiary,
  },
  tabTextActive: {
    color: COLORS.primary,
  },

  // List
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.huge,
  },

  // Block card
  blockCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  blockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  blockIconWrap: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.lightAqua,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  blockInfo: {
    flex: 1,
  },
  blockName: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
  },
  blockDesc: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  blockStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  blockStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  blockStatText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  progressBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.borderLight,
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },

  // Flat card
  flatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  flatLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flatIconWrap: {
    width: 42,
    height: 42,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.aquaMist,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  flatNumber: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
  },
  flatOwner: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  flatArea: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  occupancyBadge: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs + 1,
    borderRadius: BORDER_RADIUS.round,
    marginLeft: SPACING.sm,
  },
  occupancyText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.xs,
  },
});

export default PropertiesScreen;
