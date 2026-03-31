import { Redirect } from 'expo-router';

export default function Index() {
  // Directly point to the auth flow according to the assignment requirements.
  return <Redirect href="/(auth)/set-password" />;
}
