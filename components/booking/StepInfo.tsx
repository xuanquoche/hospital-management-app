import { useBookingStore } from '@/store/bookingStore';
import { useRouter } from 'expo-router';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function StepInfo() {
  const router = useRouter();
  const { 
    selectedDoctor, 
    selectedDate, 
    selectedTimeLabel,
    symptoms, 
    notes, 
    setSymptoms, 
    setNotes, 
    submitBooking,
    isLoading,
    resetBooking
  } = useBookingStore();

  const handleSubmit = async () => {
     try {
        await submitBooking();
        Alert.alert("Success", "Appointment booked successfully!", [
            { text: "OK", onPress: () => {
                resetBooking();
                router.replace('/(tabs)/appointments');
            }}
        ]);
     } catch (e: any) {
        Alert.alert("Error", e.message || "Failed to book");
     }
  };

  return (
    <ScrollView className="flex-1">
      <Text className="text-xl font-bold text-gray-800 mb-6">Confirm Details</Text>

      <View className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
        <Text className="font-bold text-blue-800 text-lg mb-2">Appointment Summary</Text>
        <Text className="text-blue-700">Doctor: <Text className="font-bold">{selectedDoctor?.user.fullName}</Text></Text>
        <Text className="text-blue-700">Specialty: {selectedDoctor?.primarySpecialty?.name}</Text>
        <Text className="text-blue-700">Date: {selectedDate?.toLocaleDateString()}</Text>
        <Text className="text-blue-700">Time: {selectedTimeLabel}</Text>
      </View>

      <Text className="text-gray-700 mb-1 font-medium">Symptoms (Required)</Text>
      <TextInput
        className="border border-gray-300 rounded-xl p-3 bg-white mb-4 h-24"
        multiline
        textAlignVertical="top"
        placeholder="Describe your symptoms..."
        value={symptoms}
        onChangeText={setSymptoms}
      />

      <Text className="text-gray-700 mb-1 font-medium">Notes (Optional)</Text>
      <TextInput
        className="border border-gray-300 rounded-xl p-3 bg-white mb-6 h-24"
        multiline
        textAlignVertical="top"
        placeholder="Any other details..."
        value={notes}
        onChangeText={setNotes}
      />
      
      <TouchableOpacity 
          className={`p-4 rounded-xl bg-green-600 items-center ${isLoading || !symptoms ? 'opacity-50' : ''}`}
          disabled={isLoading || !symptoms}
          onPress={handleSubmit}
      >
          <Text className="text-white font-bold text-lg">
            {isLoading ? 'Booking...' : 'Confirm Booking'}
          </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
