import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function PaymentLayout() {
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
        <Stack.Screen name="[id]" />
      </Stack>
    </>
  );
}

