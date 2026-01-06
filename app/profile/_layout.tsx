import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function ProfileLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: 'white' },
        }}
      >
        <Stack.Screen name="edit" />
        <Stack.Screen name="medical" />
        <Stack.Screen name="payments" />
        <Stack.Screen name="language" />
        <Stack.Screen name="settings" />
      </Stack>
    </>
  );
}
