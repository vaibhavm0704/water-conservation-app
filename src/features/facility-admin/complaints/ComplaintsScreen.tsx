import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  FONT_FAMILY,
  FONT_SIZE,
  TYPOGRAPHY,
} from '../../../shared/constants/theme';
import ComplaintCard from '../../../shared/components/ComplaintCard';
import LoadingState from '../../../shared/components/LoadingState';
import EmptyState from '../../../shared/components/EmptyState';
import { getComplaints } from '../services/facilityService';
import { SharedComplaint, ComplaintStatus } from '../../../shared/data/sharedStore';

interface ComplaintsScreenProps {
  navigation?: any;
}

type FilterTab = 'all' | ComplaintStatus;

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'resolved', label: 'Resolved' },
];

const ISSUE_TYPE_LABELS: Record<string, string> = {
  leakage: 'Water Leakage',
  no_water: 'No Water Supply',
  low_pressure: 'Low Pressure',
  dirty_water: 'Dirty Water',
  other: 'Other Issue',
};

const ComplaintsScreen: React.FC<ComplaintsScreenProps> = ({ navigation }) => {
  const [complaints, setComplaints] = useState<SharedComplaint[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadComplaints = useCallback(async () => {
    try {
      const filter = activeFilter === 'all' ? undefined : activeFilter;
      const data = await getComplaints(filter);
      setComplaints(data);
    } catch (error) {
      console.error('Failed to load complaints:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeFilter]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadComplaints();
    }, [loadComplaints])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadComplaints();
  }, [loadComplaints]);

  const handleComplaintPress = (complaint: SharedComplaint) => {
    navigation?.navigate?.('ComplaintDetail', { complaintId: complaint.id });
  };

  const renderComplaint = ({ item }: { item: SharedComplaint }) => (
    <View style={styles.cardWrapper}>
      <ComplaintCard
        ticketId={item.ticketId}
        residentName={item.residentName}
        issueType={ISSUE_TYPE_LABELS[item.issueType]}
        priority={item.priority}
        status={item.status}
        date={item.date}
        onPress={() => handleComplaintPress(item)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Complaints</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{complaints.length}</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
        style={styles.filterScroll}
      >
        {FILTER_TABS.map((tab) => {
          const isActive = tab.key === activeFilter;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.filterPill, isActive && styles.filterPillActive]}
              onPress={() => setActiveFilter(tab.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterPillText,
                  isActive && styles.filterPillTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Complaints List */}
      {loading ? (
        <LoadingState message="Loading complaints..." />
      ) : complaints.length === 0 ? (
        <EmptyState
          title="No Complaints Found"
          description={`No ${activeFilter === 'all' ? '' : activeFilter.replace('_', ' ')} complaints at the moment.`}
          icon="chatbubble-ellipses-outline"
        />
      ) : (
        <FlatList
          data={complaints}
          renderItem={renderComplaint}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
  },
  countBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.round,
    minWidth: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.sm,
  },
  countText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textWhite,
  },
  filterScroll: {
    maxHeight: 48,
    marginBottom: SPACING.md,
  },
  filterContainer: {
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
  },
  filterPill: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterPillText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  filterPillTextActive: {
    color: COLORS.textWhite,
  },
  listContent: {
    padding: SPACING.xl,
    gap: SPACING.md,
    paddingBottom: SPACING.massive,
  },
  cardWrapper: {
    marginBottom: 0,
  },
});

export default ComplaintsScreen;
