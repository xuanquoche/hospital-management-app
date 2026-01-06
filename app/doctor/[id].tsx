import { Colors } from '@/constants/colors';
import { formatConsultationFee, formatDoctorName, getDoctorById } from '@/services/doctor';
import { useBookingStore } from '@/store/bookingStore';
import { Doctor } from '@/types/doctor';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DoctorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setDoctor, setStep, reset } = useBookingStore();

  const [doctor, setDoctorData] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadDoctor();
    }
  }, [id]);

  const loadDoctor = async () => {
    setLoading(true);
    const data = await getDoctorById(id!);
    setDoctorData(data);
    setLoading(false);
  };

  const handleBookNow = () => {
    if (doctor) {
      reset();
      setDoctor(doctor);
      setStep('schedule');
      router.push('/(tabs)/booking');
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.white,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary[500]} />
      </View>
    );
  }

  if (!doctor) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.white,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
        }}
      >
        <Ionicons name="alert-circle-outline" size={60} color={Colors.error} />
        <Text
          style={{
            marginTop: 16,
            fontSize: 18,
            fontWeight: '600',
            color: Colors.text.primary,
          }}
        >
          Doctor not found
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={{
            marginTop: 20,
            backgroundColor: Colors.primary[500],
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: Colors.white, fontWeight: '600' }}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const name = formatDoctorName(doctor);
  const fee = formatConsultationFee(doctor.consultationFee);
  const specialty = doctor.primarySpecialty?.name || 'General';
  const experience = doctor.yearsOfExperience
    ? `${doctor.yearsOfExperience} years of experience`
    : '';

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background.secondary }}>
      <LinearGradient
        colors={[Colors.primary[500], Colors.primary[600]]}
        style={{
          paddingTop: insets.top,
          paddingBottom: 80,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </Pressable>
          <Text
            style={{
              flex: 1,
              marginLeft: 16,
              fontSize: 18,
              fontWeight: '700',
              color: Colors.white,
            }}
          >
            Doctor Profile
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1, marginTop: -60 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.duration(500)}>
          <View
            style={{
              backgroundColor: Colors.white,
              borderRadius: 24,
              padding: 24,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 5,
            }}
          >
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 30,
                backgroundColor: Colors.primary[100],
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 40,
                  fontWeight: '700',
                  color: Colors.primary[600],
                }}
              >
                {doctor.user?.fullName?.charAt(0) || 'D'}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 22,
                fontWeight: '700',
                color: Colors.text.primary,
                textAlign: 'center',
                marginBottom: 4,
              }}
            >
              {name}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <Ionicons
                name="medical"
                size={16}
                color={Colors.primary[500]}
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  fontSize: 15,
                  color: Colors.text.secondary,
                }}
              >
                {specialty}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 24 }}>
              {experience && (
                <View style={{ alignItems: 'center' }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      color: Colors.primary[600],
                    }}
                  >
                    {doctor.yearsOfExperience}+
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: Colors.text.tertiary,
                    }}
                  >
                    Years Exp.
                  </Text>
                </View>
              )}
              <View style={{ alignItems: 'center' }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: Colors.secondary[600],
                  }}
                >
                  4.9
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: Colors.text.tertiary,
                  }}
                >
                  Rating
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(100)}>
          <View
            style={{
              backgroundColor: Colors.white,
              borderRadius: 20,
              padding: 20,
              marginTop: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: Colors.text.primary,
                marginBottom: 12,
              }}
            >
              About
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: Colors.text.secondary,
                lineHeight: 22,
              }}
            >
              {doctor.bio ||
                `${name} is a highly skilled ${specialty} specialist with ${experience || 'extensive experience'}. Dedicated to providing exceptional patient care and staying current with the latest medical advancements.`}
            </Text>
          </View>
        </Animated.View>

        {doctor.education && doctor.education.length > 0 && (
          <Animated.View entering={FadeInDown.duration(400).delay(200)}>
            <View
              style={{
                backgroundColor: Colors.white,
                borderRadius: 20,
                padding: 20,
                marginTop: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: Colors.text.primary,
                  marginBottom: 12,
                }}
              >
                Education
              </Text>
              {doctor.education.map((edu, index) => (
                <View
                  key={edu.id || index}
                  style={{
                    flexDirection: 'row',
                    marginBottom: index < doctor.education!.length - 1 ? 12 : 0,
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
                      name="school-outline"
                      size={18}
                      color={Colors.primary[600]}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: Colors.text.primary,
                      }}
                    >
                      {edu.degree}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color: Colors.text.secondary,
                      }}
                    >
                      {edu.institution}
                      {edu.year ? ` • ${edu.year}` : ''}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.duration(400).delay(300)}>
          <View
            style={{
              backgroundColor: Colors.white,
              borderRadius: 20,
              padding: 20,
              marginTop: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: Colors.text.primary,
                marginBottom: 12,
              }}
            >
              Consultation Fee
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: Colors.secondary[100],
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  <Ionicons
                    name="cash-outline"
                    size={18}
                    color={Colors.secondary[600]}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    color: Colors.text.secondary,
                  }}
                >
                  Per Visit
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '700',
                  color: Colors.primary[600],
                }}
              >
                {fee}
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 20,
          paddingBottom: insets.bottom + 20,
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.border.light,
        }}
      >
        <Pressable
          onPress={handleBookNow}
          style={{
            backgroundColor: Colors.primary[500],
            paddingVertical: 16,
            borderRadius: 14,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: Colors.white,
              fontSize: 16,
              fontWeight: '700',
            }}
          >
            Book Appointment
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

