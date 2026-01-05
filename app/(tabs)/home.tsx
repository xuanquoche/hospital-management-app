import { Appointment, getAppointments } from '@/services/appointment';
import { useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [upcoming, setUpcoming] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
      setLoading(true);
      try {
          const apps = await getAppointments();
          // Filter for future and sort
          const now = new Date();
          const future = apps.filter(a => new Date(a.appointmentDate) >= now && a.status !== 'CANCELLED');
          future.sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
          setUpcoming(future[0] || null);
      } catch (e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
  };

  useFocusEffect(
      useCallback(() => {
          fetchData();
      }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView 
        contentContainerStyle={{ padding: 20 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
      >
        <View className="flex-row justify-between items-center mb-6 mt-4">
            <View>
                <Text className="text-gray-500 text-base">Welcome back,</Text>
                <Text className="text-2xl font-bold text-gray-800">{user?.fullName || 'Patient'}</Text>
            </View>
            <TouchableOpacity 
                className="bg-white p-2 rounded-full shadow-sm"
                onPress={() => router.push('/(tabs)/profile')}
            >
                {/* Avatar Placeholder */}
                <View className="h-10 w-10 bg-blue-100 rounded-full items-center justify-center">
                    <Text className="text-blue-600 font-bold">{user?.fullName?.[0] || 'U'}</Text>
                </View>
            </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <Text className="font-bold text-gray-800 text-lg mb-3">Quick Actions</Text>
        <View className="flex-row justify-between mb-8">
            <TouchableOpacity 
                className="bg-blue-600 p-4 rounded-xl flex-1 mr-3 items-center justify-center shadow-sm"
                onPress={() => router.push('/(tabs)/booking')}
            >
                <Ionicons name="calendar" size={24} color="white" className="mb-2" />
                <Text className="text-white font-bold">Book Now</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                className="bg-teal-500 p-4 rounded-xl flex-1 ml-3 items-center justify-center shadow-sm"
                onPress={() => router.push('/(tabs)/chat')}
            >
                <Ionicons name="chatbubbles" size={24} color="white" className="mb-2" />
                <Text className="text-white font-bold">Chat Support</Text>
            </TouchableOpacity>
        </View>

        {/* Upcoming Appointment */}
        <View className="flex-row justify-between items-center mb-3">
             <Text className="font-bold text-gray-800 text-lg">Upcoming Appointment</Text>
             <TouchableOpacity onPress={() => router.push('/(tabs)/appointments')}>
                 <Text className="text-blue-600 font-medium">See All</Text>
             </TouchableOpacity>
        </View>

        {upcoming ? (
            <View className="bg-white p-5 rounded-2xl shadow-sm border border-blue-50">
                <View className="flex-row justify-between items-start mb-3">
                    <View>
                        <Text className="font-bold text-lg text-gray-800">{upcoming.doctor.user.fullName}</Text>
                        <Text className="text-gray-500">{upcoming.doctor.primarySpecialty.name}</Text>
                    </View>
                    <View className="bg-blue-100 px-3 py-1 rounded-full">
                         <Text className="text-blue-700 font-bold text-xs">CONFIRMED</Text>
                    </View>
                </View>
                
                <View className="flex-row items-center mb-2">
                    <Ionicons name="time-outline" size={18} color="#666" className="mr-2" />
                    <Text className="text-gray-600 ml-2">
                        {format(new Date(upcoming.appointmentDate), 'EEEE, d MMMM yyyy')}
                    </Text>
                </View>
                <View className="flex-row items-center">
                    <Ionicons name="alarm-outline" size={18} color="#666" className="mr-2" />
                    <Text className="text-gray-600 ml-2">
                        {upcoming.timeSlot.startTime} - {upcoming.timeSlot.endTime}
                    </Text>
                </View>
                
                <TouchableOpacity className="mt-4 bg-gray-50 py-3 rounded-xl border border-gray-200 items-center">
                    <Text className="font-medium text-gray-700">View Details</Text>
                </TouchableOpacity>
            </View>
        ) : (
            <View className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 items-center">
                <Ionicons name="calendar-outline" size={48} color="#ccc" className="mb-3" />
                <Text className="text-gray-500 font-medium">No upcoming appointments</Text>
                <TouchableOpacity 
                    className="mt-4"
                    onPress={() => router.push('/(tabs)/booking')}
                >
                    <Text className="text-blue-600 font-bold">Book an appointment</Text>
                </TouchableOpacity>
            </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
