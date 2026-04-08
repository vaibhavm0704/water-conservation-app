import { Drawer } from 'expo-router/drawer';
import { Colors } from '../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function MainLayout() {
  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: '#fff',
        drawerActiveTintColor: Colors.primary,
        drawerInactiveTintColor: Colors.text,
        drawerStyle: {
          backgroundColor: '#F7F9FC',
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
        },
        drawerLabelStyle: {
          fontSize: 15,
          fontWeight: '600',
        },
      }}
    >
      <Drawer.Screen
        name="dashboard"
        options={{
          drawerLabel: 'Dashboard',
          title: 'Dashboard',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="invite-admin"
        options={{
          drawerLabel: 'Invite Estate Admin',
          title: 'Invite Estate Admin',
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-add-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
