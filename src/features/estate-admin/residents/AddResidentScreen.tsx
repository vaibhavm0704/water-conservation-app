// Estate Admin - Add Resident Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  FONT_FAMILY,
  FONT_SIZE,
} from '../../../shared/constants/theme';
import { addResident } from '../services/estateService';

const BLOCKS = [
  'Block A - Riverside',
  'Block B - Lakeview',
  'Block C - Fountain Court',
  'Block D - Raindrop Tower',
];

const AddResidentScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');
  const [flatNumber, setFlatNumber] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [showBlockPicker, setShowBlockPicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[+]?[\d\s-]{10,15}$/.test(phone.trim()))
      newErrors.phone = 'Enter a valid phone number';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      newErrors.email = 'Enter a valid email';
    if (!selectedBlock) newErrors.block = 'Please select a block';
    if (!flatNumber.trim()) newErrors.flat = 'Flat number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await addResident({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        blockName: selectedBlock,
        flatNumber: flatNumber.trim(),
        status: isActive ? 'active' : 'pending',
        joinDate: new Date().toISOString().split('T')[0],
      });
      Alert.alert('Success', 'Resident added successfully!', [
        { text: 'OK', onPress: () => navigation?.goBack?.() },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to add resident. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Form Fields ── */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name</Text>
          <View style={[styles.inputWrap, errors.name ? styles.inputError : null]}>
            <Ionicons name="person-outline" size={20} color={COLORS.textTertiary} />
            <TextInput
              style={styles.input}
              placeholder="Enter resident name"
              placeholderTextColor={COLORS.textTertiary}
              value={name}
              onChangeText={(t) => {
                setName(t);
                if (errors.name) setErrors((e) => ({ ...e, name: '' }));
              }}
            />
          </View>
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={[styles.inputWrap, errors.phone ? styles.inputError : null]}>
            <Ionicons name="call-outline" size={20} color={COLORS.textTertiary} />
            <TextInput
              style={styles.input}
              placeholder="+91 98765 43210"
              placeholderTextColor={COLORS.textTertiary}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={(t) => {
                setPhone(t);
                if (errors.phone) setErrors((e) => ({ ...e, phone: '' }));
              }}
            />
          </View>
          {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email Address</Text>
          <View style={[styles.inputWrap, errors.email ? styles.inputError : null]}>
            <Ionicons name="mail-outline" size={20} color={COLORS.textTertiary} />
            <TextInput
              style={styles.input}
              placeholder="resident@email.com"
              placeholderTextColor={COLORS.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (errors.email) setErrors((e) => ({ ...e, email: '' }));
              }}
            />
          </View>
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        </View>

        {/* ── Block Picker ── */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Block</Text>
          <TouchableOpacity
            style={[styles.inputWrap, errors.block ? styles.inputError : null]}
            activeOpacity={0.7}
            onPress={() => setShowBlockPicker((p) => !p)}
          >
            <Ionicons name="business-outline" size={20} color={COLORS.textTertiary} />
            <Text
              style={[
                styles.input,
                { paddingVertical: Platform.OS === 'ios' ? 2 : 0 },
                !selectedBlock && { color: COLORS.textTertiary },
              ]}
            >
              {selectedBlock || 'Select a block'}
            </Text>
            <Ionicons
              name={showBlockPicker ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={COLORS.textTertiary}
            />
          </TouchableOpacity>
          {errors.block ? <Text style={styles.errorText}>{errors.block}</Text> : null}

          {showBlockPicker && (
            <View style={styles.pickerDropdown}>
              {BLOCKS.map((block) => (
                <TouchableOpacity
                  key={block}
                  style={[
                    styles.pickerOption,
                    selectedBlock === block && styles.pickerOptionActive,
                  ]}
                  onPress={() => {
                    setSelectedBlock(block);
                    setShowBlockPicker(false);
                    if (errors.block) setErrors((e) => ({ ...e, block: '' }));
                  }}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      selectedBlock === block && styles.pickerOptionTextActive,
                    ]}
                  >
                    {block}
                  </Text>
                  {selectedBlock === block && (
                    <Ionicons name="checkmark" size={18} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Flat Number</Text>
          <View style={[styles.inputWrap, errors.flat ? styles.inputError : null]}>
            <Ionicons name="home-outline" size={20} color={COLORS.textTertiary} />
            <TextInput
              style={styles.input}
              placeholder="e.g. A-101"
              placeholderTextColor={COLORS.textTertiary}
              autoCapitalize="characters"
              value={flatNumber}
              onChangeText={(t) => {
                setFlatNumber(t);
                if (errors.flat) setErrors((e) => ({ ...e, flat: '' }));
              }}
            />
          </View>
          {errors.flat ? <Text style={styles.errorText}>{errors.flat}</Text> : null}
        </View>

        {/* ── Status Toggle ── */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleOption, isActive && styles.toggleActive]}
              onPress={() => setIsActive(true)}
            >
              <Text
                style={[styles.toggleText, isActive && styles.toggleTextActive]}
              >
                Active
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleOption, !isActive && styles.togglePending]}
              onPress={() => setIsActive(false)}
            >
              <Text
                style={[styles.toggleText, !isActive && styles.toggleTextPending]}
              >
                Pending
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Submit Button ── */}
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitDisabled]}
          activeOpacity={0.8}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Ionicons name="person-add" size={20} color={COLORS.textWhite} />
          <Text style={styles.submitText}>
            {submitting ? 'Adding...' : 'Add Resident'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: SPACING.huge }} />
      </ScrollView>
    </KeyboardAvoidingView>
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

  // Form
  formGroup: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    padding: 0,
  },
  errorText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.error,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },

  // Block picker dropdown
  pickerDropdown: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    marginTop: SPACING.sm,
    ...SHADOWS.medium,
    overflow: 'hidden',
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  pickerOptionActive: {
    backgroundColor: COLORS.lightAqua,
  },
  pickerOptionText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
  },
  pickerOptionTextActive: {
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.primary,
  },

  // Toggle
  toggleRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  toggleOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  toggleActive: {
    borderColor: COLORS.success,
    backgroundColor: COLORS.successLight,
  },
  togglePending: {
    borderColor: COLORS.warning,
    backgroundColor: COLORS.warningLight,
  },
  toggleText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  toggleTextActive: {
    color: COLORS.success,
  },
  toggleTextPending: {
    color: COLORS.warning,
  },

  // Submit
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
    ...SHADOWS.medium,
  },
  submitDisabled: {
    opacity: 0.6,
  },
  submitText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textWhite,
  },
});

export default AddResidentScreen;
