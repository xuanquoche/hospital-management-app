import { Appointment, getAppointments } from '@/services/appointment';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';

export default function AppointmentsScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
        const data = await getAppointments();
        setAppointments(data);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const renderItem = ({ item }: { item: Appointment }) => (
    <View className="bg-white p-4 rounded-xl mb-3 border border-gray-100 shadow-sm">
        <View className="flex-row justify-between mb-2">
            <Text className="font-bold text-gray-800 text-lg">{item.doctor.user.fullName}</Text>
            <View className={`px-2 py-1 rounded bg-blue-100`}>
                <Text className="text-blue-700 text-xs font-bold">{item.status}</Text>
            </View>
        </View>
        <Text className="text-gray-500 mb-1">{item.doctor.primarySpecialty.name}</Text>
        <View className="flex-row items-center mt-2">
            <View className="bg-gray-100 px-3 py-1 rounded-full mr-2">
                <Text className="text-gray-600 text-xs">
                    {format(new Date(item.appointmentDate), 'dd MMM yyyy')}
                </Text>
            </View>
            <View className="bg-gray-100 px-3 py-1 rounded-full">
                <Text className="text-gray-600 text-xs">
                    {item.timeSlot.startTime} - {item.timeSlot.endTime}
                </Text>
            </View>
        </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
       <View className="p-4 bg-white border-b border-gray-200">
           <Text className="text-xl font-bold text-gray-800">My Appointments</Text>
       </View>
       <FlatList 
          data={appointments}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchAppointments} />}
          ListEmptyComponent={
              <View className="p-10 items-center">
                  <Text className="text-gray-400">No appointments found.</Text>
              </View>
          }
       />
    </View>
  );
}
