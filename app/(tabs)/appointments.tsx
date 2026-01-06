import { Colors } from '@/constants/colors';
import {
  getAppointments,
  getDoctorName,
  getSpecialtyName,
  getStatusConfig,
  getTimeSlot,
} from '@/services/appointment';
import { Appointment, AppointmentStatus } from '@/types/appointment';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabType = 'upcoming' | 'completed' | 'cancelled';

export default function AppointmentsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await getAppointments({ limit: 100 });
      setAppointments(data || []);
    } catch (e) {
      console.error(e);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [])
  );

  const filteredAppointments = useMemo(() => {
    const now = new Date();
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.appointmentDate);
      const status = apt.status?.toUpperCase() as AppointmentStatus;
      switch (activeTab) {
        case 'upcoming':
          return aptDate >= now && status !== 'CANCELLED' && status !== 'COMPLETED';
        case 'completed':
          return status === 'COMPLETED';
        case 'cancelled':
          return status === 'CANCELLED';
        default:
          return true;
      }
    });
  }, [appointments, activeTab]);

  const tabs = [
    { key: 'upcoming' as TabType, label: 'Upcoming', icon: 'calendar-outline' },
    { key: 'completed' as TabType, label: 'Completed', icon: 'checkmark-done-outline' },
    { key: 'cancelled' as TabType, label: 'Cancelled', icon: 'close-circle-outline' },
  ];

  const renderItem = ({ item, index }: { item: Appointment; index: number }) => {
    const statusConfig = getStatusConfig(item.status);
    const appointmentDate = new Date(item.appointmentDate);
    const doctorName = getDoctorName(item);
    const specialty = getSpecialtyName(item);
    const timeSlotStr = getTimeSlot(item);

    return (
      <Animated.View entering={FadeInDown.duration(400).delay(index * 100)}>
        <Pressable
          onPress={() => router.push(`/appointment/${item.id}`)}
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
            borderWidth: 1,
            borderColor: Colors.border.light,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 14,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: Colors.text.primary,
                }}
              >
                {doctorName}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: Colors.text.secondary,
                  marginTop: 2,
                }}
              >
                {specialty}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: statusConfig.bgColor,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 20,
                alignSelf: 'flex-start',
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color: statusConfig.color,
                }}
              >
                {statusConfig.label}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              backgroundColor: Colors.background.secondary,
              borderRadius: 12,
              padding: 12,
            }}
          >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons
                name="calendar-outline"
                size={16}
                color={Colors.primary[500]}
              />
              <Text
                style={{
                  marginLeft: 8,
                  fontSize: 13,
                  color: Colors.text.primary,
                  fontWeight: '500',
                }}
              >
                {format(appointmentDate, 'dd MMM yyyy')}
              </Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons
                name="time-outline"
                size={16}
                color={Colors.accent[500]}
              />
              <Text
                style={{
                  marginLeft: 8,
                  fontSize: 13,
                  color: Colors.text.primary,
                  fontWeight: '500',
                }}
              >
                {timeSlotStr}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginTop: 14,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons
                name={
                  item.examinationType === 'IN_PERSON'
                    ? 'business-outline'
                    : 'videocam-outline'
                }
                size={14}
                color={Colors.text.tertiary}
              />
              <Text
                style={{
                  marginLeft: 6,
                  fontSize: 12,
                  color: Colors.text.tertiary,
                }}
              >
                {item.examinationType === 'IN_PERSON' ? 'In-Person' : 'Online'}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 13,
                  color: Colors.primary[600],
                  fontWeight: '600',
                }}
              >
                View Details
              </Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={Colors.primary[600]}
                style={{ marginLeft: 4 }}
              />
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background.secondary }}>
      <Animated.View
        entering={FadeInUp.duration(400)}
        style={{
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 16,
          backgroundColor: Colors.white,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border.light,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: '700',
            color: Colors.text.primary,
            marginBottom: 16,
          }}
        >
          My Appointments
        </Text>

        <View
          style={{
            flexDirection: 'row',
            backgroundColor: Colors.background.secondary,
            borderRadius: 14,
            padding: 4,
          }}
        >
          {tabs.map((tab) => (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 10,
                borderRadius: 10,
                backgroundColor:
                  activeTab === tab.key ? Colors.white : 'transparent',
                shadowColor: activeTab === tab.key ? '#000' : 'transparent',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: activeTab === tab.key ? 0.1 : 0,
                shadowRadius: 4,
                elevation: activeTab === tab.key ? 2 : 0,
              }}
            >
              <Ionicons
                name={tab.icon as any}
                size={16}
                color={
                  activeTab === tab.key
                    ? Colors.primary[600]
                    : Colors.text.tertiary
                }
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color:
                    activeTab === tab.key
                      ? Colors.primary[600]
                      : Colors.text.tertiary,
                }}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>

      <FlatList
        data={filteredAppointments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchAppointments}
            tintColor={Colors.primary[500]}
          />
        }
        ListEmptyComponent={
          <View
            style={{
              paddingVertical: 60,
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 24,
                backgroundColor: Colors.neutral[100],
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}
            >
              <Ionicons
                name="calendar-outline"
                size={40}
                color={Colors.neutral[400]}
              />
            </View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
                color: Colors.text.primary,
                marginBottom: 8,
              }}
            >
              No {activeTab} appointments
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: Colors.text.tertiary,
                textAlign: 'center',
              }}
            >
              {activeTab === 'upcoming'
                ? 'Book an appointment to get started'
                : `You don't have any ${activeTab} appointments`}
            </Text>
            {activeTab === 'upcoming' && (
              <Pressable
                onPress={() => router.push('/(tabs)/booking')}
                style={{
                  marginTop: 20,
                  backgroundColor: Colors.primary[500],
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 12,
                }}
              >
                <Text style={{ color: Colors.white, fontWeight: '600' }}>
                  Book Appointment
                </Text>
              </Pressable>
            )}
          </View>
        }
      />
    </View>
  );
}
