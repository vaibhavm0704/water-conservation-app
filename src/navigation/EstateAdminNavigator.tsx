// AquaEstate Estate Admin Navigator
// Bottom tabs: Dashboard, Residents, Properties, Reports, Profile
// Each tab has a nested stack for sub-screens

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_FAMILY, FONT_SIZE } from '../shared/constants/theme';

// Import Screens
import DashboardScreen from '../features/estate-admin/dashboard/DashboardScreen';
import ResidentsScreen from '../features/estate-admin/residents/ResidentsScreen';
import AddResidentScreen from '../features/estate-admin/residents/AddResidentScreen';
import ResidentDetailScreen from '../features/estate-admin/residents/ResidentDetailScreen';
import PropertiesScreen from '../features/estate-admin/properties/PropertiesScreen';
import ReportsScreen from '../features/estate-admin/reports/ReportsScreen';
import ProfileScreen from '../features/estate-admin/profile/ProfileScreen';

const DashboardStack = createNativeStackNavigator();
const ResidentsStack = createNativeStackNavigator();
const PropertiesStack = createNativeStackNavigator();
const ReportsStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const DashboardStackScreen: React.FC = () => (
  <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
    <DashboardStack.Screen name="DashboardHome" component={DashboardScreen} />
    <DashboardStack.Screen name="AddResident" component={AddResidentScreen} />
    <DashboardStack.Screen name="ResidentDetail" component={ResidentDetailScreen} />
    <DashboardStack.Screen name="Reports" component={ReportsScreen} />
  </DashboardStack.Navigator>
);

const ResidentsStackScreen: React.FC = () => (
  <ResidentsStack.Navigator screenOptions={{ headerShown: false }}>
    <ResidentsStack.Screen name="ResidentsHome" component={ResidentsScreen} />
    <ResidentsStack.Screen name="AddResident" component={AddResidentScreen} />
    <ResidentsStack.Screen name="ResidentDetail" component={ResidentDetailScreen} />
  </ResidentsStack.Navigator>
);

const PropertiesStackScreen: React.FC = () => (
  <PropertiesStack.Navigator screenOptions={{ headerShown: false }}>
    <PropertiesStack.Screen name="PropertiesHome" component={PropertiesScreen} />
  </PropertiesStack.Navigator>
);

const ReportsStackScreen: React.FC = () => (
  <ReportsStack.Navigator screenOptions={{ headerShown: false }}>
    <ReportsStack.Screen name="ReportsHome" component={ReportsScreen} />
  </ReportsStack.Navigator>
);

const ProfileStackScreen: React.FC = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ProfileHome" component={ProfileScreen} />
  </ProfileStack.Navigator>
);

const Tab = createBottomTabNavigator();

const EstateAdminNavigator: React.FC = () => {
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
            case 'Residents':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Properties':
              iconName = focused ? 'business' : 'business-outline';
              break;
            case 'Reports':
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
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
      <Tab.Screen name="Residents" component={ResidentsStackScreen} />
      <Tab.Screen name="Properties" component={PropertiesStackScreen} />
      <Tab.Screen name="Reports" component={ReportsStackScreen} />
      <Tab.Screen name="Profile" component={ProfileStackScreen} />
    </Tab.Navigator>
  );
};

export default EstateAdminNavigator;
