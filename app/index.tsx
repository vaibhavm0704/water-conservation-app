import { Redirect } from 'expo-router';

export default function Index() {
  // Start with the login screen
  return <Redirect href="/(auth)/login" />;
}
