import { CustomTabBar } from '@/components/navigation/CustomTabBar';
import { useConversations } from '@/hooks/useConversations';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function TabLayout() {
  const { unreadCount } = useConversations();

  return (
    <>
      <StatusBar style="dark" />
      <Tabs
        tabBar={(props) => (
          <CustomTabBar {...props} unreadMessages={unreadCount} />
        )}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="booking" />
        <Tabs.Screen name="appointments" />
        <Tabs.Screen name="chat" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </>
  );
}
