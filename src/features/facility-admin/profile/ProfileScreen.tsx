import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Linking,
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
import { useAuth } from '../../../context/AuthContext';
import { useNotifications } from '../../../context/NotificationContext';

interface ProfileScreenProps {
  navigation?: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { pushEnabled, emailEnabled, togglePush, toggleEmail } = useNotifications();

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const handleCallAdmin = () => {
    Linking.openURL('tel:+919876512345');
  };

  const handleEmailAdmin = () => {
    Linking.openURL('mailto:admin@greenville.com');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user ? getInitials(user.name) : 'FA'}
            </Text>
          </View>
          <View style={styles.onlineDot} />
        </View>
        <Text style={styles.profileName}>{user?.name || 'Facility Admin'}</Text>
        <View style={styles.roleBadge}>
          <Ionicons name="shield-checkmark" size={14} color={COLORS.primary} />
          <Text style={styles.roleBadgeText}>Facility Admin</Text>
        </View>
      </View>

      {/* Personal Details Card */}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Ionicons name="person-outline" size={20} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Personal Details</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="mail-outline" size={16} color={COLORS.textTertiary} />
          <Text style={styles.detailLabel}>Email</Text>
          <Text style={styles.detailValue}>{user?.email || 'N/A'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="call-outline" size={16} color={COLORS.textTertiary} />
          <Text style={styles.detailLabel}>Phone</Text>
          <Text style={styles.detailValue}>{user?.phone || 'N/A'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="card-outline" size={16} color={COLORS.textTertiary} />
          <Text style={styles.detailLabel}>Employee ID</Text>
          <Text style={styles.detailValue}>{user?.id || 'N/A'}</Text>
        </View>
      </View>

      {/* Notification Settings Card */}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Notification Settings</Text>
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <View style={[styles.settingIcon, { backgroundColor: COLORS.infoLight }]}>
              <Ionicons name="phone-portrait-outline" size={16} color={COLORS.info} />
            </View>
            <View>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDescription}>Get real-time alerts on your phone</Text>
            </View>
          </View>
          <Switch
            value={pushEnabled}
            onValueChange={togglePush}
            trackColor={{ false: COLORS.border, true: COLORS.primaryLight + '60' }}
            thumbColor={pushEnabled ? COLORS.primary : COLORS.textTertiary}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <View style={[styles.settingIcon, { backgroundColor: COLORS.warningLight }]}>
              <Ionicons name="mail-outline" size={16} color={COLORS.warning} />
            </View>
            <View>
              <Text style={styles.settingLabel}>Email Notifications</Text>
              <Text style={styles.settingDescription}>Receive daily summary emails</Text>
            </View>
          </View>
          <Switch
            value={emailEnabled}
            onValueChange={toggleEmail}
            trackColor={{ false: COLORS.border, true: COLORS.primaryLight + '60' }}
            thumbColor={emailEnabled ? COLORS.primary : COLORS.textTertiary}
          />
        </View>
      </View>

      {/* Contact Estate Admin Card */}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Ionicons name="business-outline" size={20} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Contact Estate Admin</Text>
        </View>

        <View style={styles.contactInfo}>
          <View style={styles.contactAvatar}>
            <Text style={styles.contactAvatarText}>SA</Text>
          </View>
          <View style={styles.contactDetails}>
            <Text style={styles.contactName}>Sanjay Agarwal</Text>
            <Text style={styles.contactRole}>Estate Administrator</Text>
          </View>
        </View>

        <View style={styles.contactActions}>
          <TouchableOpacity
            style={[styles.contactButton, { backgroundColor: COLORS.successLight }]}
            onPress={handleCallAdmin}
            activeOpacity={0.7}
          >
            <Ionicons name="call" size={18} color={COLORS.success} />
            <Text style={[styles.contactButtonText, { color: COLORS.success }]}>
              +91 98765 12345
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.contactButton, { backgroundColor: COLORS.infoLight }]}
            onPress={handleEmailAdmin}
            activeOpacity={0.7}
          >
            <Ionicons name="mail" size={18} color={COLORS.info} />
            <Text style={[styles.contactButtonText, { color: COLORS.info }]}>
              admin@greenville.com
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* App Version */}
      <View style={styles.versionContainer}>
        <MaterialCommunityIcons name="water" size={16} color={COLORS.textTertiary} />
        <Text style={styles.versionText}>AquaEstate v1.0.0</Text>
      </View>

      {/* Logout Button */}
      <AppButton
        title="Logout"
        onPress={handleLogout}
        variant="danger"
        icon="log-out-outline"
        fullWidth
        style={styles.logoutButton}
      />
    </ScrollView>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
    paddingTop: SPACING.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.large,
  },
  avatarText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xxxl,
    color: COLORS.textWhite,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.success,
    borderWidth: 3,
    borderColor: COLORS.background,
  },
  profileName: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.sm,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.lightAqua,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs + 2,
    borderRadius: BORDER_RADIUS.round,
  },
  roleBadgeText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  cardTitle: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  detailLabel: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
    width: 80,
  },
  detailValue: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    flex: 1,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
  },
  settingDescription: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.lg,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.deepWater,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactAvatarText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.lg,
    color: COLORS.textWhite,
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
  },
  contactRole: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
  },
  contactActions: {
    gap: SPACING.sm,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  contactButtonText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
  },
  versionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.lg,
    marginTop: SPACING.sm,
  },
  versionText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
  },
  logoutButton: {
    marginBottom: SPACING.xxl,
  },
});

export default ProfileScreen;
