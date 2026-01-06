import { AppointmentCard } from '@/components/dashboard/AppointmentCard';
import { HealthMetricsCard } from '@/components/dashboard/HealthMetricsCard';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';
import { RecentHistoryCard } from '@/components/dashboard/RecentHistoryCard';
import { Colors } from '@/constants/colors';
import { getAppointments } from '@/services/appointment';
import { getHealthMetrics, getRecentConsultations } from '@/services/patient';
import { useAuthStore } from '@/store/authStore';
import { Appointment } from '@/types/appointment';
import { Consultation, HealthMetrics } from '@/types/patient';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { user, fetchUserProfile } = useAuthStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(false);
  const [upcoming, setUpcoming] = useState<Appointment | null>(null);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics>({});
  const [recentConsultations, setRecentConsultations] = useState<Consultation[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appointmentsResult, metrics, consultations] = await Promise.all([
        getAppointments().catch(() => ({ data: [], total: 0 })),
        getHealthMetrics().catch(() => ({})),
        getRecentConsultations(3).catch(() => []),
        fetchUserProfile().catch(() => {}),
      ]);

      const now = new Date();
      const appointments = appointmentsResult?.data || [];
      const futureAppointments = appointments.filter(
        (a) => new Date(a.appointmentDate) >= now && a.status !== 'CANCELLED'
      );
      futureAppointments.sort(
        (a, b) =>
          new Date(a.appointmentDate).getTime() -
          new Date(b.appointmentDate).getTime()
      );
      setUpcoming(futureAppointments[0] || null);
      setHealthMetrics(metrics || {});
      setRecentConsultations(consultations || []);
    } catch (e) {
      console.error('Error fetching data:', e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getDisplayName = () => {
    if (user?.fullName) return user.fullName;
    if (user?.email) return user.email.split('@')[0];
    return 'there';
  };

  const getInitial = () => {
    if (user?.fullName) return user.fullName.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background.secondary }}>
      <LinearGradient
        colors={[Colors.primary[500], Colors.primary[600]]}
        style={{
          paddingTop: insets.top,
          paddingHorizontal: 20,
          paddingBottom: 80,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 10,
          }}
        >
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
              {getGreeting()} 👋
            </Text>
            <Text
              style={{
                color: Colors.white,
                fontSize: 24,
                fontWeight: '700',
                marginTop: 4,
              }}
            >
              {getDisplayName()}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Pressable
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: 'rgba(255,255,255,0.2)',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}
            >
              <Ionicons name="notifications-outline" size={22} color={Colors.white} />
              <View
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: Colors.error,
                }}
              />
            </Pressable>
            <Pressable
              onPress={() => router.push('/(tabs)/profile')}
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: Colors.white,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  color: Colors.primary[600],
                  fontSize: 18,
                  fontWeight: '700',
                }}
              >
                {getInitial()}
              </Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={() => router.push('/(tabs)/booking')}
          style={{
            marginTop: 20,
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: 14,
            paddingHorizontal: 16,
            paddingVertical: 14,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Ionicons
            name="search-outline"
            size={20}
            color="rgba(255,255,255,0.7)"
          />
          <Text
            style={{
              marginLeft: 12,
              color: 'rgba(255,255,255,0.7)',
              fontSize: 15,
            }}
          >
            Search doctors, specialties...
          </Text>
        </Pressable>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1, marginTop: -10 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, paddingTop: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchData}
            tintColor={Colors.primary[500]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(400).delay(100)}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: Colors.text.primary,
              marginBottom: 14,
            }}
          >
            Quick Actions
          </Text>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
            <QuickActionCard
              icon="calendar"
              title="Book Appointment"
              subtitle="Find a doctor"
              colors={[Colors.primary[500], Colors.primary[600]]}
              onPress={() => router.push('/(tabs)/booking')}
            />
            <QuickActionCard
              icon="sparkles"
              title="AI Consult"
              subtitle="Get recommendations"
              colors={[Colors.secondary[500], Colors.secondary[600]]}
              onPress={() => router.push('/(tabs)/chat')}
            />
          </View>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
            <QuickActionCard
              icon="document-text"
              title="Health Records"
              subtitle="View history"
              colors={[Colors.accent[500], Colors.accent[600]]}
              onPress={() => router.push('/(tabs)/appointments')}
            />
            <QuickActionCard
              icon="chatbubbles"
              title="Support Chat"
              subtitle="Get help"
              colors={['#8B5CF6', '#7C3AED']}
              onPress={() => router.push('/(tabs)/chat')}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(200)}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 14,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: Colors.text.primary,
              }}
            >
              Upcoming Appointment
            </Text>
            <Pressable onPress={() => router.push('/(tabs)/appointments')}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: Colors.primary[600],
                }}
              >
                See All
              </Text>
            </Pressable>
          </View>

          {upcoming ? (
            <AppointmentCard
              appointment={upcoming}
              onViewDetails={() => router.push('/(tabs)/appointments')}
            />
          ) : (
            <Pressable
              onPress={() => router.push('/(tabs)/booking')}
              style={{
                backgroundColor: Colors.white,
                borderRadius: 20,
                padding: 30,
                alignItems: 'center',
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
                  width: 64,
                  height: 64,
                  borderRadius: 20,
                  backgroundColor: Colors.primary[100],
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <Ionicons
                  name="calendar-outline"
                  size={32}
                  color={Colors.primary[500]}
                />
              </View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: Colors.text.primary,
                  marginBottom: 4,
                }}
              >
                No Upcoming Appointments
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.text.tertiary,
                  textAlign: 'center',
                  marginBottom: 16,
                }}
              >
                Book an appointment with a doctor today
              </Text>
              <View
                style={{
                  backgroundColor: Colors.primary[500],
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 12,
                }}
              >
                <Text style={{ color: Colors.white, fontWeight: '600' }}>
                  Book Now
                </Text>
              </View>
            </Pressable>
          )}
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(400).delay(300)}
          style={{ marginTop: 24 }}
        >
          <HealthMetricsCard metrics={healthMetrics} />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(400).delay(400)}
          style={{ marginTop: 24 }}
        >
          <RecentHistoryCard
            consultations={recentConsultations}
            onViewAll={() => router.push('/(tabs)/appointments')}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
}
