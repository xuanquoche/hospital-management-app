import { getDoctorDetail, getDoctors } from '@/services/doctor';
import { useBookingStore } from '@/store/bookingStore';
import { Doctor } from '@/types/booking';
import { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, Text, TextInput, View } from 'react-native';

export default function StepDoctor() {
  const { setSelectedDoctor, setCurrentStep, setSymptoms, symptoms, selectedDoctor } = useBookingStore();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');

  // Helper to extract unique specialties + 'All'
  const specialties = ['All', ...Array.from(new Set(doctors.map(d => d.primarySpecialty?.name || 'General')))];

  useEffect(() => {
    getDoctors()
      .then(setDoctors)
      .catch((err) => console.error('Failed to load doctors', err))
      .finally(() => setLoading(false));
  }, []);

  const handleNext = async () => {
    if (selectedDoctor) {
        // Fetch detail if needed
        try {
            const detail = await getDoctorDetail(selectedDoctor.id);
            setSelectedDoctor(detail);
        } catch {
            // fallback
        }
        setCurrentStep(2);
    }
  };

  const filteredDoctors = selectedSpecialty === 'All' 
    ? doctors 
    : doctors.filter(d => (d.primarySpecialty?.name || 'General') === selectedSpecialty);

  const renderItem = ({ item }: { item: Doctor }) => {
    const isSelected = selectedDoctor?.id === item.id;
    return (
      <Pressable
        className={`bg-white p-4 rounded-xl mb-3 border flex-row items-center ${isSelected ? 'border-green-500 bg-green-50' : 'border-gray-100 shadow-sm'}`}
        onPress={() => setSelectedDoctor(item)}
      >
        <Image 
            source={{ uri: item.image || 'https://via.placeholder.com/150' }} 
            className="h-16 w-16 rounded-xl mr-4 bg-gray-200"
        />
        
        <View className="flex-1">
          <Text className="font-bold text-gray-800 text-lg">{item.user.fullName}</Text>
          <Text className="text-gray-500 text-sm mb-1">{item.primarySpecialty?.name} • {item.yearsOfExperience} yrs exp</Text>
          <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                   <Text className="text-yellow-500 text-xs">⭐ 4.9</Text>
              </View>
              <Text className="text-blue-600 font-bold">${item.consultationFee || 50}/hr</Text>
          </View>
        </View>

        <View className={`h-6 w-6 rounded-full border items-center justify-center ml-2 ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
            {isSelected && <Text className="text-white text-xs">✓</Text>}
        </View>
      </Pressable>
    );
  };

  return (
    <View className="flex-1">
      <View className="mb-4">
          <Text className="font-bold text-gray-800 mb-2">Describe Symptoms</Text>
          <TextInput 
              className="bg-gray-100 p-4 rounded-xl h-24 text-base"
              multiline
              textAlignVertical="top"
              placeholder="E.g. I have a headache and fever since yesterday..."
              value={symptoms}
              onChangeText={setSymptoms}
          />
      </View>

      <Text className="font-bold text-gray-800 mb-2">Specialty</Text>
      <View className="h-12 mb-4">
        <FlatList 
            horizontal
            showsHorizontalScrollIndicator={false}
            data={specialties}
            keyExtractor={item => item}
            renderItem={({ item }) => (
                <Pressable 
                    onPress={() => setSelectedSpecialty(item)}
                    className={`px-4 py-2 rounded-full mr-2 border ${selectedSpecialty === item ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200'}`}
                >
                    <Text className={selectedSpecialty === item ? 'text-white' : 'text-gray-600'}>{item}</Text>
                </Pressable>
            )}
        />
      </View>

      <Text className="font-bold text-gray-800 mb-2">Available Doctors</Text>
      {loading ? (
        <Text>Loading doctors...</Text>
      ) : (
        <FlatList
          data={filteredDoctors}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-100">
          <Pressable 
             className={`p-4 rounded-xl items-center ${selectedDoctor ? 'bg-blue-600' : 'bg-gray-300'}`}
             disabled={!selectedDoctor}
             onPress={handleNext}
          >
              <Text className="text-white font-bold text-lg">Next Step</Text>
          </Pressable>
      </View>
    </View>
  );
}
