import { Colors } from '@/constants/colors';
import { formatConsultationFee, formatDoctorName } from '@/services/doctor';
import { Doctor } from '@/types/doctor';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface DoctorCardProps {
  doctor: Doctor;
  onPress: () => void;
  onBook?: () => void;
  selected?: boolean;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  onPress,
  onBook,
  selected = false,
}) => {
  const name = formatDoctorName(doctor);
  const fee = formatConsultationFee(doctor.consultationFee);
  const specialty = doctor.primarySpecialty?.name || 'General';
  const experience = doctor.yearsOfExperience
    ? `${doctor.yearsOfExperience} years exp.`
    : '';

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 18,
        marginBottom: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? Colors.primary[500] : Colors.border.light,
      }}
    >
      <View style={{ flexDirection: 'row' }}>
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 18,
            backgroundColor: Colors.primary[100],
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 14,
          }}
        >
          {doctor.user?.avatar ? (
            <Ionicons name="person" size={28} color={Colors.primary[600]} />
          ) : (
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: Colors.primary[600],
              }}
            >
              {doctor.user?.fullName?.charAt(0) || 'D'}
            </Text>
          )}
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: Colors.text.primary,
              marginBottom: 4,
            }}
            numberOfLines={1}
          >
            {name}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 4,
            }}
          >
            <Ionicons
              name="medical"
              size={14}
              color={Colors.primary[500]}
              style={{ marginRight: 4 }}
            />
            <Text
              style={{
                fontSize: 13,
                color: Colors.text.secondary,
              }}
              numberOfLines={1}
            >
              {specialty}
            </Text>
          </View>
          {experience && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons
                name="briefcase-outline"
                size={14}
                color={Colors.text.tertiary}
                style={{ marginRight: 4 }}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: Colors.text.tertiary,
                }}
              >
                {experience}
              </Text>
            </View>
          )}
        </View>

        {selected && (
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: Colors.primary[500],
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="checkmark" size={18} color={Colors.white} />
          </View>
        )}
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 14,
          paddingTop: 14,
          borderTopWidth: 1,
          borderTopColor: Colors.border.light,
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 11,
              color: Colors.text.tertiary,
              marginBottom: 2,
            }}
          >
            Consultation fee
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: Colors.primary[600],
            }}
          >
            {fee}
          </Text>
        </View>

        {onBook && (
          <Pressable
            onPress={onBook}
            style={{
              backgroundColor: Colors.primary[500],
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                color: Colors.white,
                fontWeight: '600',
                fontSize: 14,
              }}
            >
              Book Now
            </Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
};

