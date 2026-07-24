// ============================================================
// AquaEstate — Raise Complaint Screen
// ============================================================

import React, { useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../../context/AuthContext';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  FONT_FAMILY,
  FONT_SIZE,
} from '../../../shared/constants/theme';
import { raiseComplaint } from '../services/residentService';
import { ComplaintCategory, ISSUE_TYPE_LABELS } from '../../../shared/data/sharedStore';

const ISSUE_TYPES: { type: ComplaintCategory; icon: string; lib: 'ion' | 'mci' }[] = [
  { type: 'leakage', icon: 'water-outline', lib: 'ion' },
  { type: 'no_water', icon: 'water-off', lib: 'mci' },
  { type: 'low_pressure', icon: 'speedometer-outline', lib: 'ion' },
  { type: 'dirty_water', icon: 'flask-outline', lib: 'ion' },
  { type: 'other', icon: 'help-circle-outline', lib: 'ion' },
];

const RaiseComplaintScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<ComplaintCategory | null>(null);
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });
      if (!result.canceled && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Error', 'Could not open image library.');
    }
  };

  const handleSubmit = async () => {
    if (!selectedType) {
      Alert.alert('Required', 'Please select an issue type.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Required', 'Please enter a description.');
      return;
    }

    setSubmitting(true);
    try {
      if (!user) throw new Error("No user");
      await raiseComplaint({
        issueType: selectedType,
        description: description.trim(),
        imageUri: imageUri ?? undefined,
        residentId: user.id,
        residentName: user.name,
        flatNumber: user.flatNumber,
      });
      Alert.alert(
        'Complaint Raised ✓',
        'Your complaint has been submitted successfully. You will receive updates on the progress.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch {
      Alert.alert('Error', 'Failed to submit complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.title}>Raise Complaint</Text>
            </View>

            {/* Issue Type */}
            <Text style={styles.sectionLabel}>Select Issue Type</Text>
            <View style={styles.chipRow}>
              {ISSUE_TYPES.map((it) => {
                const selected = selectedType === it.type;
                return (
                  <TouchableOpacity
                    key={it.type}
                    style={[styles.chip, selected && styles.chipActive]}
                    activeOpacity={0.7}
                    onPress={() => setSelectedType(it.type)}
                  >
                    {it.lib === 'mci' ? (
                      <MaterialCommunityIcons
                        name={it.icon as any}
                        size={18}
                        color={selected ? '#FFFFFF' : COLORS.primary}
                      />
                    ) : (
                      <Ionicons
                        name={it.icon as any}
                        size={18}
                        color={selected ? '#FFFFFF' : COLORS.primary}
                      />
                    )}
                    <Text
                      style={[
                        styles.chipText,
                        selected && styles.chipTextActive,
                      ]}
                    >
                      {ISSUE_TYPE_LABELS[it.type]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Description */}
            <Text style={styles.sectionLabel}>Description</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                placeholder="Describe the issue in detail…"
                placeholderTextColor={COLORS.textTertiary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>

            {/* Image Picker */}
            <Text style={styles.sectionLabel}>Attach Image (Optional)</Text>
            {imageUri ? (
              <View style={styles.previewWrap}>
                <Image source={{ uri: imageUri }} style={styles.preview} />
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => setImageUri(null)}
                >
                  <Ionicons name="close-circle" size={28} color={COLORS.error} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.imagePicker}
                activeOpacity={0.7}
                onPress={pickImage}
              >
                <Ionicons name="camera-outline" size={32} color={COLORS.textTertiary} />
                <Text style={styles.imagePickerText}>
                  Tap to select an image
                </Text>
              </TouchableOpacity>
            )}

            {/* Submit */}
            <TouchableOpacity
              style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
              activeOpacity={0.8}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <Ionicons name="send" size={20} color="#FFFFFF" />
              <Text style={styles.submitText}>
                {submitting ? 'Submitting…' : 'Submit Complaint'}
              </Text>
            </TouchableOpacity>

            <View style={{ height: SPACING.huge }} />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

// ── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  scrollContent: {
    paddingTop: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.massive,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  title: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xxl,
    color: COLORS.textPrimary,
  },

  // Section label
  sectionLabel: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.lg,
  },

  // Chips
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.lightAqua,
    gap: 6,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
  },
  chipText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },

  // Input
  inputWrap: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  input: {
    padding: SPACING.lg,
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    minHeight: 120,
  },

  // Image Picker
  imagePicker: {
    height: 130,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.card,
  },
  imagePickerText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
    marginTop: SPACING.sm,
  },
  previewWrap: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: BORDER_RADIUS.lg,
  },
  removeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
  },

  // Submit
  submitBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xxl,
    gap: SPACING.sm,
    ...SHADOWS.medium,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: '#FFFFFF',
  },
});

export default RaiseComplaintScreen;
