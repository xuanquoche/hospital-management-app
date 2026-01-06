import { Colors } from '@/constants/colors';
import { AvailableSlot } from '@/types/doctor';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

interface TimeSlotPickerProps {
  slots: AvailableSlot[];
  selectedSlot: AvailableSlot | null;
  onSelectSlot: (slot: AvailableSlot) => void;
  loading?: boolean;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  slots,
  selectedSlot,
  onSelectSlot,
  loading = false,
}) => {
  if (loading) {
    return (
      <View style={{ padding: 30, alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary[500]} />
        <Text
          style={{
            marginTop: 12,
            fontSize: 14,
            color: Colors.text.tertiary,
          }}
        >
          Loading available slots...
        </Text>
      </View>
    );
  }

  if (slots.length === 0) {
    return (
      <View style={{ padding: 30, alignItems: 'center' }}>
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: Colors.neutral[100],
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 14,
          }}
        >
          <Ionicons name="calendar-outline" size={28} color={Colors.neutral[400]} />
        </View>
        <Text
          style={{
            fontSize: 15,
            fontWeight: '600',
            color: Colors.text.primary,
            marginBottom: 4,
          }}
        >
          No available slots
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: Colors.text.tertiary,
            textAlign: 'center',
          }}
        >
          Please select a different date
        </Text>
      </View>
    );
  }

  const morningSlots = slots.filter(
    (s) => parseInt(s.startTime.split(':')[0]) < 12
  );
  const afternoonSlots = slots.filter(
    (s) =>
      parseInt(s.startTime.split(':')[0]) >= 12 &&
      parseInt(s.startTime.split(':')[0]) < 17
  );
  const eveningSlots = slots.filter(
    (s) => parseInt(s.startTime.split(':')[0]) >= 17
  );

  const renderSlots = (slotList: AvailableSlot[], title: string, icon: string) => {
    if (slotList.length === 0) return null;

    return (
      <View style={{ marginBottom: 20 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Ionicons name={icon as any} size={18} color={Colors.text.secondary} />
          <Text
            style={{
              marginLeft: 8,
              fontSize: 14,
              fontWeight: '600',
              color: Colors.text.secondary,
            }}
          >
            {title}
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10 }}
        >
          {slotList.map((slot) => {
            const isSelected = selectedSlot?.slotId === slot.slotId;
            return (
              <Pressable
                key={slot.slotId}
                onPress={() => onSelectSlot(slot)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: isSelected
                    ? Colors.primary[500]
                    : Colors.border.light,
                  backgroundColor: isSelected
                    ? Colors.primary[50]
                    : Colors.white,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: isSelected
                      ? Colors.primary[600]
                      : Colors.text.primary,
                  }}
                >
                  {slot.startTime}
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    color: isSelected
                      ? Colors.primary[500]
                      : Colors.text.tertiary,
                    marginTop: 2,
                  }}
                >
                  {slot.examinationType === 'IN_PERSON' ? 'In-person' : 'Online'}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  return (
    <View>
      {renderSlots(morningSlots, 'Morning', 'sunny-outline')}
      {renderSlots(afternoonSlots, 'Afternoon', 'partly-sunny-outline')}
      {renderSlots(eveningSlots, 'Evening', 'moon-outline')}
    </View>
  );
};

