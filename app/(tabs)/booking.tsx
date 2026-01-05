import StepDate from '@/components/booking/StepDate';
import StepDoctor from '@/components/booking/StepDoctor';
import StepInfo from '@/components/booking/StepInfo';
import { useBookingStore } from '@/store/bookingStore';
import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookingScreen() {
  const { currentStep, setCurrentStep, resetBooking } = useBookingStore();

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepDoctor />;
      case 2:
        return <StepDate />;
      case 3:
        return <StepInfo />;
      default:
        return null; // or Success component handled in StepInfo
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 py-4 bg-white border-b border-gray-200 flex-row items-center">
        {currentStep > 1 && (
            <TouchableOpacity onPress={handleBack} className="mr-4">
                <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
        )}
        <View>
            <Text className="text-xl font-bold text-gray-800">New Appointment</Text>
            <Text className="text-xs text-blue-600">Step {currentStep} of 3</Text>
        </View>
      </View>
      
      <View className="flex-1 p-4">
        {renderStep()}
      </View>
    </SafeAreaView>
  );
}
