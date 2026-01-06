import { Colors } from '@/constants/colors';
import { Appointment, getDoctorName, getSpecialtyName, getTimeSlot } from '@/services/appointment';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface AppointmentCardProps {
  appointment: Appointment;
  onPress?: () => void;
  onViewDetails?: () => void;
}

const getStatusConfig = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'CONFIRMED':
      return {
        label: 'Confirmed',
        bgColor: Colors.secondary[100],
        textColor: Colors.secondary[700],
        icon: 'checkmark-circle' as const,
      };
    case 'PENDING':
      return {
        label: 'Pending',
        bgColor: Colors.accent[100],
        textColor: Colors.accent[700],
        icon: 'time' as const,
      };
    case 'IN_PROGRESS':
      return {
        label: 'In Progress',
        bgColor: Colors.primary[100],
        textColor: Colors.primary[700],
        icon: 'pulse' as const,
      };
    case 'COMPLETED':
      return {
        label: 'Completed',
        bgColor: Colors.neutral[100],
        textColor: Colors.neutral[600],
        icon: 'checkmark-done' as const,
      };
    case 'CANCELLED':
      return {
        label: 'Cancelled',
        bgColor: '#FEE2E2',
        textColor: Colors.error,
        icon: 'close-circle' as const,
      };
    default:
      return {
        label: status || 'Unknown',
        bgColor: Colors.neutral[100],
        textColor: Colors.neutral[600],
        icon: 'help-circle' as const,
      };
  }
};

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onPress,
  onViewDetails,
}) => {
  const statusConfig = getStatusConfig(appointment.status);
  const appointmentDate = new Date(appointment.appointmentDate);
  const doctorName = getDoctorName(appointment);
  const specialtyName = getSpecialtyName(appointment);
  const timeSlot = getTimeSlot(appointment);

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: Colors.border.light,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 16,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: Colors.text.primary,
              marginBottom: 4,
            }}
          >
            {doctorName}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: Colors.text.secondary,
            }}
          >
            {specialtyName}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: statusConfig.bgColor,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 20,
          }}
        >
          <Ionicons
            name={statusConfig.icon}
            size={14}
            color={statusConfig.textColor}
            style={{ marginRight: 4 }}
          />
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: statusConfig.textColor,
            }}
          >
            {statusConfig.label}
          </Text>
        </View>
      </View>

      <View
        style={{
          backgroundColor: Colors.background.secondary,
          borderRadius: 14,
          padding: 14,
          marginBottom: 16,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: Colors.primary[100],
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            <Ionicons
              name="calendar-outline"
              size={18}
              color={Colors.primary[600]}
            />
          </View>
          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: Colors.text.primary,
              }}
            >
              {format(appointmentDate, 'EEEE, d MMMM yyyy')}
            </Text>
            <Text style={{ fontSize: 12, color: Colors.text.tertiary }}>
              Date
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: Colors.accent[100],
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            <Ionicons
              name="time-outline"
              size={18}
              color={Colors.accent[600]}
            />
          </View>
          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: Colors.text.primary,
              }}
            >
              {timeSlot}
            </Text>
            <Text style={{ fontSize: 12, color: Colors.text.tertiary }}>
              Time Slot
            </Text>
          </View>
        </View>
      </View>

      {onViewDetails && (
        <Pressable
          onPress={onViewDetails}
          style={{
            backgroundColor: Colors.primary[50],
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              color: Colors.primary[600],
              fontWeight: '600',
              fontSize: 14,
            }}
          >
            View Details
          </Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={Colors.primary[600]}
            style={{ marginLeft: 4 }}
          />
        </Pressable>
      )}
    </Pressable>
  );
};
