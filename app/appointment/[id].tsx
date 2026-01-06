import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/colors';
import {
  cancelAppointment,
  getAppointmentById,
  getDoctorName,
  getSpecialtyName,
  getStatusConfig,
  getTimeSlot,
} from '@/services/appointment';
import { formatConsultationFee } from '@/services/doctor';
import { Appointment, CancelReason } from '@/types/appointment';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CANCEL_REASONS: { value: CancelReason; label: string }[] = [
  { value: 'PATIENT_REQUEST', label: 'Personal reasons' },
  { value: 'SCHEDULE_CONFLICT', label: 'Schedule conflict' },
  { value: 'EMERGENCY', label: 'Emergency' },
  { value: 'OTHER', label: 'Other reason' },
];

export default function AppointmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState<CancelReason>('PATIENT_REQUEST');
  const [cancelNotes, setCancelNotes] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (id) {
      loadAppointment();
    }
  }, [id]);

  const loadAppointment = async () => {
    setLoading(true);
    const data = await getAppointmentById(id!);
    setAppointment(data);
    setLoading(false);
  };

  const handleCancel = async () => {
    if (!appointment) return;

    setCancelling(true);
    try {
      await cancelAppointment(appointment.id, {
        reason: cancelReason,
        notes: cancelNotes || undefined,
      });
      setShowCancelModal(false);
      Alert.alert('Success', 'Appointment cancelled successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || 'Failed to cancel appointment';
      Alert.alert('Error', message);
    } finally {
      setCancelling(false);
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

  if (!appointment) {
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
          Appointment not found
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

  const statusConfig = getStatusConfig(appointment.status);
  const doctorName = getDoctorName(appointment);
  const specialty = getSpecialtyName(appointment);
  const timeSlot = getTimeSlot(appointment);
  const canCancel = ['PENDING', 'CONFIRMED'].includes(appointment.status);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background.secondary }}>
      <LinearGradient
        colors={[Colors.primary[500], Colors.primary[600]]}
        style={{
          paddingTop: insets.top,
          paddingBottom: 20,
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
            Appointment Details
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.duration(500)}>
          <View
            style={{
              backgroundColor: Colors.white,
              borderRadius: 20,
              padding: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 4,
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
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    color: Colors.text.tertiary,
                    marginBottom: 4,
                  }}
                >
                  Appointment ID
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: Colors.text.primary,
                  }}
                >
                  #{appointment.id.slice(0, 8).toUpperCase()}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: statusConfig.bgColor,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
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
                alignItems: 'center',
                paddingTop: 16,
                borderTopWidth: 1,
                borderTopColor: Colors.border.light,
              }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 18,
                  backgroundColor: Colors.primary[100],
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 14,
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: '700',
                    color: Colors.primary[600],
                  }}
                >
                  {appointment.doctor?.user?.fullName?.charAt(0) || 'D'}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: Colors.text.primary,
                    marginBottom: 4,
                  }}
                >
                  {doctorName}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: Colors.text.secondary,
                  }}
                >
                  {specialty}
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
                fontSize: 14,
                fontWeight: '600',
                color: Colors.text.secondary,
                marginBottom: 16,
              }}
            >
              APPOINTMENT INFO
            </Text>

            <View style={{ gap: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: Colors.primary[100],
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 14,
                  }}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={Colors.primary[600]}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 12,
                      color: Colors.text.tertiary,
                    }}
                  >
                    Date
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '600',
                      color: Colors.text.primary,
                    }}
                  >
                    {format(new Date(appointment.appointmentDate), 'EEEE, MMMM d, yyyy')}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: Colors.accent[100],
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 14,
                  }}
                >
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color={Colors.accent[600]}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 12,
                      color: Colors.text.tertiary,
                    }}
                  >
                    Time Slot
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '600',
                      color: Colors.text.primary,
                    }}
                  >
                    {timeSlot}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: Colors.secondary[100],
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 14,
                  }}
                >
                  <Ionicons
                    name={
                      appointment.examinationType === 'IN_PERSON'
                        ? 'business-outline'
                        : 'videocam-outline'
                    }
                    size={20}
                    color={Colors.secondary[600]}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 12,
                      color: Colors.text.tertiary,
                    }}
                  >
                    Type
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '600',
                      color: Colors.text.primary,
                    }}
                  >
                    {appointment.examinationType === 'IN_PERSON'
                      ? 'In-Person Visit'
                      : 'Online Consultation'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {appointment.symptoms && (
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
                  fontSize: 14,
                  fontWeight: '600',
                  color: Colors.text.secondary,
                  marginBottom: 12,
                }}
              >
                SYMPTOMS
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.text.primary,
                  lineHeight: 22,
                }}
              >
                {appointment.symptoms}
              </Text>
            </View>
          </Animated.View>
        )}

        {appointment.diagnosis && (
          <Animated.View entering={FadeInDown.duration(400).delay(250)}>
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
                  fontSize: 14,
                  fontWeight: '600',
                  color: Colors.text.secondary,
                  marginBottom: 12,
                }}
              >
                DIAGNOSIS
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.text.primary,
                  lineHeight: 22,
                }}
              >
                {appointment.diagnosis}
              </Text>
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
                fontSize: 14,
                fontWeight: '600',
                color: Colors.text.secondary,
                marginBottom: 12,
              }}
            >
              PAYMENT
            </Text>

            <View style={{ gap: 10 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={{ fontSize: 14, color: Colors.text.secondary }}>
                  Consultation Fee
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: Colors.text.primary,
                  }}
                >
                  {formatConsultationFee(appointment.consultationFee)}
                </Text>
              </View>
              {appointment.medicineFee && appointment.medicineFee > 0 && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ fontSize: 14, color: Colors.text.secondary }}>
                    Medicine Fee
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '500',
                      color: Colors.text.primary,
                    }}
                  >
                    {formatConsultationFee(appointment.medicineFee)}
                  </Text>
                </View>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingTop: 10,
                  borderTopWidth: 1,
                  borderTopColor: Colors.border.light,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '700',
                    color: Colors.text.primary,
                  }}
                >
                  Total
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: Colors.primary[600],
                  }}
                >
                  {formatConsultationFee(
                    appointment.totalFee || appointment.consultationFee
                  )}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {canCancel && (
          <Animated.View entering={FadeInDown.duration(400).delay(400)}>
            <Pressable
              onPress={() => setShowCancelModal(true)}
              style={{
                marginTop: 24,
                backgroundColor: '#FEE2E2',
                paddingVertical: 16,
                borderRadius: 14,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: Colors.error,
                  fontSize: 16,
                  fontWeight: '600',
                }}
              >
                Cancel Appointment
              </Text>
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>

      <Modal
        visible={showCancelModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              backgroundColor: Colors.white,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingTop: 20,
              paddingHorizontal: 20,
              paddingBottom: insets.bottom + 20,
            }}
          >
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: Colors.neutral[300],
                alignSelf: 'center',
                marginBottom: 20,
              }}
            />

            <Text
              style={{
                fontSize: 20,
                fontWeight: '700',
                color: Colors.text.primary,
                marginBottom: 8,
              }}
            >
              Cancel Appointment
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: Colors.text.secondary,
                marginBottom: 20,
              }}
            >
              Please select a reason for cancellation
            </Text>

            {CANCEL_REASONS.map((reason) => (
              <Pressable
                key={reason.value}
                onPress={() => setCancelReason(reason.value)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 14,
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.border.light,
                }}
              >
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    borderWidth: 2,
                    borderColor:
                      cancelReason === reason.value
                        ? Colors.primary[500]
                        : Colors.neutral[300],
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 14,
                  }}
                >
                  {cancelReason === reason.value && (
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: Colors.primary[500],
                      }}
                    />
                  )}
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    color: Colors.text.primary,
                    fontWeight:
                      cancelReason === reason.value ? '600' : '400',
                  }}
                >
                  {reason.label}
                </Text>
              </Pressable>
            ))}

            <View style={{ marginTop: 16 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: Colors.text.primary,
                  marginBottom: 10,
                }}
              >
                Additional Notes (Optional)
              </Text>
              <TextInput
                placeholder="Any additional information..."
                value={cancelNotes}
                onChangeText={setCancelNotes}
                multiline
                style={{
                  backgroundColor: Colors.background.secondary,
                  borderRadius: 12,
                  padding: 14,
                  minHeight: 80,
                  fontSize: 14,
                  color: Colors.text.primary,
                  textAlignVertical: 'top',
                }}
                placeholderTextColor={Colors.text.placeholder}
              />
            </View>

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
              <View style={{ flex: 1 }}>
                <Button
                  variant="outline"
                  onPress={() => setShowCancelModal(false)}
                  size="lg"
                >
                  Keep Appointment
                </Button>
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  variant="danger"
                  onPress={handleCancel}
                  loading={cancelling}
                  size="lg"
                >
                  Confirm Cancel
                </Button>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

