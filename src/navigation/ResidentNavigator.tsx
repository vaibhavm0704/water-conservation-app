// AquaEstate Resident Navigator
// Bottom tabs: Home, Usage, Complaints, Profile

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_FAMILY, FONT_SIZE } from '../shared/constants/theme';

// Import Screens
import HomeScreen from '../features/resident/home/HomeScreen';
import UsageScreen from '../features/resident/usage/UsageScreen';
import ComplaintsScreen from '../features/resident/complaints/ComplaintsScreen';
import RaiseComplaintScreen from '../features/resident/complaints/RaiseComplaintScreen';
import ProfileScreen from '../features/resident/profile/ProfileScreen';

const HomeStack = createNativeStackNavigator();
const UsageStack = createNativeStackNavigator();
const ComplaintsStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const HomeStackScreen: React.FC = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="HomeMain" component={HomeScreen} />
    <HomeStack.Screen name="Usage" component={UsageScreen} />
    <HomeStack.Screen name="RaiseComplaint" component={RaiseComplaintScreen} />
    <HomeStack.Screen name="Profile" component={ProfileScreen} />
  </HomeStack.Navigator>
);

const UsageStackScreen: React.FC = () => (
  <UsageStack.Navigator screenOptions={{ headerShown: false }}>
    <UsageStack.Screen name="UsageHome" component={UsageScreen} />
  </UsageStack.Navigator>
);

const ComplaintsStackScreen: React.FC = () => (
  <ComplaintsStack.Navigator screenOptions={{ headerShown: false }}>
    <ComplaintsStack.Screen name="ComplaintsHome" component={ComplaintsScreen} />
    <ComplaintsStack.Screen name="RaiseComplaint" component={RaiseComplaintScreen} />
  </ComplaintsStack.Navigator>
);

const ProfileStackScreen: React.FC = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ProfileHome" component={ProfileScreen} />
  </ProfileStack.Navigator>
);

const Tab = createBottomTabNavigator();

const ResidentNavigator: React.FC = () => {
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
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Usage':
              iconName = focused ? 'water' : 'water-outline';
              break;
            case 'Complaints':
              iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'home-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Usage" component={UsageStackScreen} />
      <Tab.Screen name="Complaints" component={ComplaintsStackScreen} />
      <Tab.Screen name="Profile" component={ProfileStackScreen} />
    </Tab.Navigator>
  );
};

export default ResidentNavigator;
