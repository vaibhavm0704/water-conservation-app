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
    </Drawer>
  );
}
