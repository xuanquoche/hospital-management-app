import { useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { logout, user } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView>
        <View className="bg-blue-600 pt-10 pb-6 items-center rounded-b-3xl">
             <View className="h-24 w-24 bg-white rounded-full items-center justify-center mb-3">
                  <Text className="text-3xl font-bold text-blue-600">{user?.fullName?.[0] || 'U'}</Text>
             </View>
             <Text className="text-white text-xl font-bold">{user?.fullName}</Text>
             <Text className="text-blue-100">{user?.email}</Text>
        </View>

        <View className="p-4 -mt-4">
             <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
                 <Text className="font-bold text-gray-800 mb-4 text-lg">Personal Info</Text>
                 
                 <View className="mb-3">
                     <Text className="text-gray-500 text-xs uppercase">Phone</Text>
                     <Text className="text-gray-800 text-base">{user?.phone || 'Not set'}</Text>
                 </View>
                 <View className="mb-3">
                     <Text className="text-gray-500 text-xs uppercase">Address</Text>
                     <Text className="text-gray-800 text-base">{user?.address || 'Not set'}</Text>
                 </View>
                 <View className="mb-3">
                     <Text className="text-gray-500 text-xs uppercase">Role</Text>
                     <Text className="text-gray-800 text-base">{user?.role}</Text>
                 </View>
             </View>

             <TouchableOpacity 
                className="bg-white p-4 rounded-xl flex-row items-center justify-between mb-4 shadow-sm"
             >
                 <View className="flex-row items-center">
                    <View className="h-8 w-8 bg-blue-100 rounded-full items-center justify-center mr-3">
                        <Ionicons name="settings-outline" size={18} color="#2563eb" />
                    </View>
                    <Text className="font-bold text-gray-700">Settings</Text>
                 </View>
                 <Ionicons name="chevron-forward" size={20} color="#ccc" />
             </TouchableOpacity>

             <TouchableOpacity 
                className="bg-white p-4 rounded-xl flex-row items-center justify-between mb-8 shadow-sm"
                onPress={logout}
             >
                 <View className="flex-row items-center">
                    <View className="h-8 w-8 bg-red-100 rounded-full items-center justify-center mr-3">
                        <Ionicons name="log-out-outline" size={18} color="#dc2626" />
                    </View>
                    <Text className="font-bold text-red-600">Log Out</Text>
                 </View>
             </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
