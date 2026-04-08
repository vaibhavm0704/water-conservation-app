import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="otp-verification" />
      <Stack.Screen name="set-password" />
      <Stack.Screen name="estate-details" />
      <Stack.Screen name="add-address" />
      <Stack.Screen name="search-location" />
      <Stack.Screen name="add-residents" />
    </Stack>
  );
}
