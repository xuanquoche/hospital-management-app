import { useBookingStore } from '@/store/bookingStore';
import { useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function StepDate() {
  const { 
    selectedDoctor, 
    selectedDate, 
    selectedTimeSlotId, 
    setSelectedDate, 
    selectTimeSlot,
    setCurrentStep 
  } = useBookingStore();

  const next14Days = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        days.push(d);
    }
    return days;
  }, []);

  const availableTimeSlots = useMemo(() => {
    if (!selectedDoctor?.schedules || !selectedDate) return [];

    const dateStr = selectedDate.toISOString().split('T')[0];
    const validSchedules = selectedDoctor.schedules.filter(s => {
        const start = new Date(s.startDate);
        const end = new Date(s.endDate);
        const current = new Date(dateStr);
        return current >= start && current <= end;
    });

    return validSchedules.flatMap(s => s.timeSlots.filter(ts => ts.availableDates.includes(dateStr)));
  }, [selectedDoctor, selectedDate]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // clear time slot
  };

  const isDisabled = !selectedDate || !selectedTimeSlotId;

  return (
    <View className="flex-1">
        <ScrollView className="flex-1">
            <Text className="text-xl font-bold text-gray-800 mb-4">Select Date & Time</Text>
            
            <Text className="text-gray-600 mb-2 font-medium">Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                {next14Days.map((date, index) => {
                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                    return (
                        <TouchableOpacity
                            key={index}
                            className={`p-3 rounded-xl mr-2 items-center min-w-[60px] border ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200'}`}
                            onPress={() => handleDateSelect(date)}
                        >
                            <Text className={`text-xs font-medium ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </Text>
                            <Text className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                                {date.getDate()}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <Text className="text-gray-600 mb-2 font-medium">Available Time Slots</Text>
            {selectedDate ? (
                availableTimeSlots.length > 0 ? (
                    <View className="flex-row flex-wrap gap-2">
                        {availableTimeSlots.map(slot => {
                            const isSelected = selectedTimeSlotId === slot.id;
                            return (
                                <TouchableOpacity
                                    key={slot.id}
                                    className={`px-4 py-2 rounded-full border ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200'}`}
                                    onPress={() => selectTimeSlot(slot.id, `${slot.startTime} - ${slot.endTime}`, slot.examinationType)}
                                >
                                    <Text className={`${isSelected ? 'text-white' : 'text-gray-700'}`}>
                                        {slot.startTime} - {slot.endTime}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ) : (
                    <Text className="text-gray-400 italic">No slots available for this date.</Text>
                )
            ) : (
                <Text className="text-gray-400 italic">Please select a date first.</Text>
            )}

        </ScrollView>

        <TouchableOpacity 
            className={`p-4 rounded-xl mt-4 bg-blue-600 items-center ${isDisabled ? 'opacity-50' : ''}`}
            disabled={isDisabled}
            onPress={() => setCurrentStep(3)}
        >
            <Text className="text-white font-bold text-lg">Next Step</Text>
        </TouchableOpacity>
    </View>
  );
}
