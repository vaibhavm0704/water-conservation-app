// AquaEstate Facility Admin Navigator
// Bottom tabs: Dashboard, Complaints, Notices, Profile

import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_FAMILY, FONT_SIZE } from '../shared/constants/theme';

// Import Screens
import DashboardScreen from '../features/facility-admin/dashboard/DashboardScreen';
import ComplaintsScreen from '../features/facility-admin/complaints/ComplaintsScreen';
import ComplaintDetailScreen from '../features/facility-admin/complaints/ComplaintDetailScreen';
import NoticesScreen from '../features/facility-admin/notices/NoticesScreen';
import CreateNoticeScreen from '../features/facility-admin/notices/CreateNoticeScreen';
import ProfileScreen from '../features/facility-admin/profile/ProfileScreen';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 32) : 0;

const DashboardStack = createNativeStackNavigator();
const ComplaintsStack = createNativeStackNavigator();
const NoticesStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const DashboardStackScreen: React.FC = () => (
  <DashboardStack.Navigator screenOptions={{ headerShown: false, contentStyle: { paddingTop: STATUSBAR_HEIGHT } }}>
    <DashboardStack.Screen name="DashboardHome" component={DashboardScreen} />
    <DashboardStack.Screen name="PublishNotice" component={CreateNoticeScreen} />
    <DashboardStack.Screen name="ComplaintDetail" component={ComplaintDetailScreen} />
  </DashboardStack.Navigator>
);

const ComplaintsStackScreen: React.FC = () => (
  <ComplaintsStack.Navigator screenOptions={{ headerShown: false, contentStyle: { paddingTop: STATUSBAR_HEIGHT } }}>
    <ComplaintsStack.Screen name="ComplaintsHome" component={ComplaintsScreen} />
    <ComplaintsStack.Screen name="ComplaintDetail" component={ComplaintDetailScreen} />
  </ComplaintsStack.Navigator>
);

const NoticesStackScreen: React.FC = () => (
  <NoticesStack.Navigator screenOptions={{ headerShown: false, contentStyle: { paddingTop: STATUSBAR_HEIGHT } }}>
    <NoticesStack.Screen name="NoticesHome" component={NoticesScreen} />
    <NoticesStack.Screen name="CreateNotice" component={CreateNoticeScreen} />
  </NoticesStack.Navigator>
);

const ProfileStackScreen: React.FC = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false, contentStyle: { paddingTop: STATUSBAR_HEIGHT } }}>
    <ProfileStack.Screen name="ProfileHome" component={ProfileScreen} />
  </ProfileStack.Navigator>
);

const Tab = createBottomTabNavigator();

const FacilityAdminNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textTertiary,
        tabBarLabelStyle: {
          fontFamily: FONT_FAMILY.medium,
          fontSize: FONT_SIZE.xs,
          marginBottom: 2,
        },
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.borderLight,
          borderTopWidth: 1,
          height: 60,
          paddingTop: 6,
          paddingBottom: 6,
        },
        tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'Complaints':
              iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
              break;
            case 'Notices':
              iconName = focused ? 'megaphone' : 'megaphone-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'grid-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardStackScreen} />
      <Tab.Screen name="Complaints" component={ComplaintsStackScreen} />
      <Tab.Screen name="Notices" component={NoticesStackScreen} />
      <Tab.Screen name="Profile" component={ProfileStackScreen} />
    </Tab.Navigator>
  );
};

export default FacilityAdminNavigator;
