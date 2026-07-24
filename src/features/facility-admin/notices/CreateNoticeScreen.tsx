import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
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
import AppInput from '../../../shared/components/AppInput';
import { createNotice } from '../services/facilityService';
import { NoticeType } from '../types/facilityTypes';
import { useAuth } from '../../../context/AuthContext';

interface CreateNoticeScreenProps {
  navigation?: any;
}

interface NoticeTypeOption {
  key: NoticeType;
  label: string;
  icon: string;
  iconSet: 'ionicons' | 'material';
  color: string;
  bg: string;
}

const NOTICE_TYPES: NoticeTypeOption[] = [
  {
    key: 'shutdown',
    label: 'Water Shutdown',
    icon: 'power-outline',
    iconSet: 'ionicons',
    color: COLORS.error,
    bg: COLORS.errorLight,
  },
  {
    key: 'cleaning',
    label: 'Tank Cleaning',
    icon: 'broom',
    iconSet: 'material',
    color: COLORS.ocean,
    bg: COLORS.aquaMist,
  },
  {
    key: 'repair',
    label: 'Pipeline Repair',
    icon: 'hammer-wrench',
    iconSet: 'material',
    color: COLORS.warning,
    bg: COLORS.warningLight,
  },
];

const CreateNoticeScreen: React.FC<CreateNoticeScreenProps> = ({ navigation }) => {
  const [selectedType, setSelectedType] = useState<NoticeType | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { user } = useAuth();

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!selectedType) newErrors.type = 'Please select a notice type';
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!startTime.trim()) newErrors.startTime = 'Start time is required';
    if (!endTime.trim()) newErrors.endTime = 'End time is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await createNotice({
        title: title.trim(),
        description: description.trim(),
        type: selectedType!,
        startTime: startTime.trim(),
        endTime: endTime.trim(),
        createdBy: user?.name ?? 'Admin',
      });
      Alert.alert(
        'Notice Published! ✅',
        'The water notice has been successfully published and residents will be notified.',
        [
          {
            text: 'OK',
            onPress: () => navigation?.goBack?.(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to publish notice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
          <Text style={styles.headerTitle}>Create Notice</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Notice Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Notice Type</Text>
          {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
          <View style={styles.typeChipsRow}>
            {NOTICE_TYPES.map((type) => {
              const isSelected = selectedType === type.key;
              return (
                <TouchableOpacity
                  key={type.key}
                  style={[
                    styles.typeChip,
                    isSelected && { borderColor: type.color, backgroundColor: type.bg },
                  ]}
                  onPress={() => {
                    setSelectedType(type.key);
                    setErrors((prev) => ({ ...prev, type: '' }));
                  }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.typeChipIcon, { backgroundColor: isSelected ? type.color + '20' : COLORS.surface }]}>
                    {type.iconSet === 'ionicons' ? (
                      <Ionicons
                        name={type.icon as keyof typeof Ionicons.glyphMap}
                        size={18}
                        color={isSelected ? type.color : COLORS.textTertiary}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name={type.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                        size={18}
                        color={isSelected ? type.color : COLORS.textTertiary}
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.typeChipText,
                      isSelected && { color: type.color, fontFamily: FONT_FAMILY.semiBold },
                    ]}
                  >
                    {type.label}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={16} color={type.color} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <AppInput
            label="Title"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              setErrors((prev) => ({ ...prev, title: '' }));
            }}
            placeholder="e.g., Water Shutdown for Maintenance"
            error={errors.title}
            leftIcon="create-outline"
          />

          <AppInput
            label="Description"
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              setErrors((prev) => ({ ...prev, description: '' }));
            }}
            placeholder="Provide detailed information about the notice..."
            error={errors.description}
            multiline
          />

          <AppInput
            label="Start Time"
            value={startTime}
            onChangeText={(text) => {
              setStartTime(text);
              setErrors((prev) => ({ ...prev, startTime: '' }));
            }}
            placeholder="e.g., 2024-12-20 09:00 AM"
            error={errors.startTime}
            leftIcon="time-outline"
          />

          <AppInput
            label="End Time"
            value={endTime}
            onChangeText={(text) => {
              setEndTime(text);
              setErrors((prev) => ({ ...prev, endTime: '' }));
            }}
            placeholder="e.g., 2024-12-20 05:00 PM"
            error={errors.endTime}
            leftIcon="time-outline"
          />
        </View>

        {/* Submit Button */}
        <AppButton
          title="Publish Notice"
          onPress={handleSubmit}
          loading={loading}
          icon="megaphone-outline"
          fullWidth
          style={styles.submitButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: SPACING.xl,
    paddingBottom: SPACING.massive,
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
  headerTitle: {
    ...TYPOGRAPHY.h2,
  },
  headerSpacer: {
    width: 40,
  },
  section: {
    marginBottom: SPACING.xxl,
  },
  sectionLabel: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  errorText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.xs,
    color: COLORS.error,
    marginBottom: SPACING.sm,
  },
  typeChipsRow: {
    gap: SPACING.sm,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  typeChipIcon: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeChipText: {
    flex: 1,
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  formSection: {
    marginBottom: SPACING.lg,
  },
  submitButton: {
    marginTop: SPACING.sm,
  },
});

export default CreateNoticeScreen;
