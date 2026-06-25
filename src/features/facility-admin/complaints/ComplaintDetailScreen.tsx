import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  FONT_FAMILY,
  FONT_SIZE,
  TYPOGRAPHY,
} from '../../../shared/constants/theme';
import AppButton from '../../../shared/components/AppButton';
import LoadingState from '../../../shared/components/LoadingState';
import {
  getComplaintById,
  assignComplaint,
  resolveComplaint,
  getStaff,
} from '../services/facilityService';
import {
  Complaint,
  Staff,
  ComplaintCategory,
  ComplaintPriority,
  ComplaintStatus,
} from '../types/facilityTypes';

interface ComplaintDetailScreenProps {
  route?: { params?: { complaintId?: string } };
  navigation?: any;
}

const PRIORITY_CONFIG: Record<ComplaintPriority, { label: string; color: string; bg: string }> = {
  high: { label: 'High', color: COLORS.error, bg: COLORS.errorLight },
  medium: { label: 'Medium', color: COLORS.warning, bg: COLORS.warningLight },
  low: { label: 'Low', color: COLORS.success, bg: COLORS.successLight },
};

const STATUS_CONFIG: Record<
  ComplaintStatus,
  { label: string; color: string; bg: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  pending: { label: 'Pending', color: COLORS.warning, bg: COLORS.warningLight, icon: 'time-outline' },
  in_progress: { label: 'In Progress', color: COLORS.info, bg: COLORS.infoLight, icon: 'construct-outline' },
  resolved: { label: 'Resolved', color: COLORS.success, bg: COLORS.successLight, icon: 'checkmark-circle-outline' },
};

const ISSUE_ICONS: Record<ComplaintCategory, { icon: keyof typeof MaterialCommunityIcons.glyphMap; color: string }> = {
  leakage: { icon: 'water-alert', color: COLORS.error },
  no_water: { icon: 'water-off', color: COLORS.deepWater },
  low_pressure: { icon: 'gauge-low', color: COLORS.warning },
  dirty_water: { icon: 'water-remove', color: '#92400E' },
  other: { icon: 'help-circle-outline', color: COLORS.textTertiary },
};

const ISSUE_LABELS: Record<ComplaintCategory, string> = {
  leakage: 'Water Leakage',
  no_water: 'No Water Supply',
  low_pressure: 'Low Pressure',
  dirty_water: 'Dirty Water',
  other: 'Other Issue',
};

const ComplaintDetailScreen: React.FC<ComplaintDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const complaintId = route?.params?.complaintId ?? 'c-001';

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [showStaffPicker, setShowStaffPicker] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [complaintData, staffData] = await Promise.all([
        getComplaintById(complaintId),
        getStaff(),
      ]);
      setComplaint(complaintData);
      setStaff(staffData);
      if (complaintData?.resolutionNotes) {
        setResolutionNotes(complaintData.resolutionNotes);
      }
    } catch (error) {
      console.error('Failed to load complaint:', error);
    } finally {
      setLoading(false);
    }
  }, [complaintId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAssignStaff = async (staffId: string) => {
    setShowStaffPicker(false);
    setActionLoading(true);
    try {
      const updated = await assignComplaint(complaintId, staffId);
      setComplaint(updated);
      Alert.alert('Success', 'Staff assigned and complaint marked as In Progress.');
    } catch (error) {
      Alert.alert('Error', 'Failed to assign staff.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!resolutionNotes.trim()) {
      Alert.alert('Required', 'Please add resolution notes before resolving.');
      return;
    }
    setActionLoading(true);
    try {
      const updated = await resolveComplaint(complaintId, resolutionNotes.trim());
      setComplaint(updated);
      Alert.alert('Success', 'Complaint has been resolved successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to resolve complaint.');
    } finally {
      setActionLoading(false);
    }
  };

  const getAssignedStaffName = (): string => {
    if (!complaint?.assignedStaff) return '';
    const member = staff.find((s) => s.id === complaint.assignedStaff);
    return member ? member.name : complaint.assignedStaff;
  };

  const getAssignedStaffRole = (): string => {
    if (!complaint?.assignedStaff) return '';
    const member = staff.find((s) => s.id === complaint.assignedStaff);
    return member ? member.role : '';
  };

  if (loading) {
    return <LoadingState message="Loading complaint details..." />;
  }

  if (!complaint) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
        <Text style={styles.errorText}>Complaint not found</Text>
      </View>
    );
  }

  const priorityCfg = PRIORITY_CONFIG[complaint.priority];
  const statusCfg = STATUS_CONFIG[complaint.status];
  const issueCfg = ISSUE_ICONS[complaint.issueType];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack?.()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.ticketId}>#{complaint.ticketId}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
            <Ionicons name={statusCfg.icon} size={14} color={statusCfg.color} />
            <Text style={[styles.statusText, { color: statusCfg.color }]}>
              {statusCfg.label}
            </Text>
          </View>
        </View>

        {/* Complaint Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.issueIconCircle, { backgroundColor: issueCfg.color + '15' }]}>
              <MaterialCommunityIcons
                name={issueCfg.icon}
                size={24}
                color={issueCfg.color}
              />
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={styles.issueType}>{ISSUE_LABELS[complaint.issueType]}</Text>
              <View style={[styles.priorityBadge, { backgroundColor: priorityCfg.bg }]}>
                <Text style={[styles.priorityText, { color: priorityCfg.color }]}>
                  {priorityCfg.label} Priority
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={16} color={COLORS.textTertiary} />
            <Text style={styles.infoLabel}>Resident</Text>
            <Text style={styles.infoValue}>{complaint.residentName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="home-outline" size={16} color={COLORS.textTertiary} />
            <Text style={styles.infoLabel}>Flat</Text>
            <Text style={styles.infoValue}>{complaint.flatNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.textTertiary} />
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{complaint.date}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Description</Text>
          <Text style={styles.description}>{complaint.description}</Text>
        </View>

        {/* Image Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Attached Image</Text>
          {complaint.imageUri ? (
            <View style={styles.imageContainer}>
              <Text style={styles.imagePlaceholderText}>Image: {complaint.imageUri}</Text>
            </View>
          ) : (
            <View style={styles.noImageContainer}>
              <Ionicons name="image-outline" size={40} color={COLORS.textTertiary} />
              <Text style={styles.noImageText}>No image attached</Text>
            </View>
          )}
        </View>

        {/* Assigned Staff */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Assigned Staff</Text>
          {complaint.assignedStaff ? (
            <View style={styles.staffInfo}>
              <View style={styles.staffAvatar}>
                <Ionicons name="person" size={22} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.staffName}>{getAssignedStaffName()}</Text>
                <Text style={styles.staffRole}>{getAssignedStaffRole()}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.notAssigned}>
              <Ionicons name="person-add-outline" size={24} color={COLORS.textTertiary} />
              <Text style={styles.notAssignedText}>Not Assigned</Text>
            </View>
          )}
        </View>

        {/* Resolution Notes */}
        {complaint.status !== 'pending' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Resolution Notes</Text>
            {complaint.status === 'resolved' ? (
              <View style={styles.resolvedNotesContainer}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={COLORS.success}
                  style={styles.resolvedIcon}
                />
                <Text style={styles.resolvedNotes}>
                  {complaint.resolutionNotes || 'No resolution notes provided.'}
                </Text>
              </View>
            ) : (
              <TextInput
                style={styles.notesInput}
                placeholder="Enter resolution notes..."
                placeholderTextColor={COLORS.textTertiary}
                value={resolutionNotes}
                onChangeText={setResolutionNotes}
                multiline
                textAlignVertical="top"
              />
            )}
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      {complaint.status !== 'resolved' && (
        <View style={styles.actionBar}>
          {complaint.status === 'pending' && (
            <>
              <AppButton
                title="Assign Staff"
                onPress={() => setShowStaffPicker(true)}
                variant="outline"
                icon="person-add-outline"
                loading={actionLoading}
                style={styles.actionButton}
              />
              <AppButton
                title="Mark In Progress"
                onPress={() => {
                  if (staff.length > 0) {
                    handleAssignStaff(staff[0].id);
                  }
                }}
                variant="primary"
                icon="arrow-forward-outline"
                loading={actionLoading}
                style={styles.actionButton}
              />
            </>
          )}
          {complaint.status === 'in_progress' && (
            <AppButton
              title="Resolve Complaint"
              onPress={handleResolve}
              variant="primary"
              icon="checkmark-circle-outline"
              loading={actionLoading}
              fullWidth
            />
          )}
        </View>
      )}

      {/* Staff Picker Modal */}
      <Modal
        visible={showStaffPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowStaffPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Staff</Text>
              <TouchableOpacity onPress={() => setShowStaffPicker(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={staff.filter((s) => s.available)}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.staffPickerItem}
                  onPress={() => handleAssignStaff(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.staffPickerAvatar}>
                    <Ionicons name="person" size={20} color={COLORS.primary} />
                  </View>
                  <View style={styles.staffPickerInfo}>
                    <Text style={styles.staffPickerName}>{item.name}</Text>
                    <Text style={styles.staffPickerRole}>{item.role}</Text>
                  </View>
                  <View style={styles.availableBadge}>
                    <View style={styles.availableDot} />
                    <Text style={styles.availableText}>Available</Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.noStaffText}>No available staff at the moment.</Text>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.xl,
    paddingBottom: SPACING.massive + 80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xxl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  ticketId: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xl,
    color: COLORS.primary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.round,
    gap: SPACING.xs,
  },
  statusText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xs,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  issueIconCircle: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderText: {
    flex: 1,
    gap: SPACING.xs,
  },
  issueType: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs - 1,
    borderRadius: BORDER_RADIUS.round,
  },
  priorityText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xs,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  infoLabel: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
    width: 60,
  },
  infoValue: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    flex: 1,
  },
  cardTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  description: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  imageContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
  },
  noImageContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  noImageText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
  },
  staffInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  staffAvatar: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.lightAqua,
    alignItems: 'center',
    justifyContent: 'center',
  },
  staffName: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
  },
  staffRole: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
  },
  notAssigned: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    gap: SPACING.sm,
  },
  notAssignedText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.textTertiary,
  },
  resolvedNotesContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  resolvedIcon: {
    marginTop: 2,
  },
  resolvedNotes: {
    flex: 1,
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  notesInput: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    minHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionBar: {
    flexDirection: 'row',
    gap: SPACING.md,
    padding: SPACING.xl,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.large,
  },
  actionButton: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  errorText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textSecondary,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: BORDER_RADIUS.xxl,
    borderTopRightRadius: BORDER_RADIUS.xxl,
    padding: SPACING.xl,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  modalTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xl,
    color: COLORS.textPrimary,
  },
  staffPickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.sm,
    gap: SPACING.md,
  },
  staffPickerAvatar: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.lightAqua,
    alignItems: 'center',
    justifyContent: 'center',
  },
  staffPickerInfo: {
    flex: 1,
  },
  staffPickerName: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
  },
  staffPickerRole: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  availableDot: {
    width: 8,
    height: 8,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.success,
  },
  availableText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.xs,
    color: COLORS.success,
  },
  noStaffText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.textTertiary,
    textAlign: 'center',
    padding: SPACING.xxl,
  },
});

export default ComplaintDetailScreen;
