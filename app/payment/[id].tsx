import { Colors } from '@/constants/colors';
import { getPaymentById } from '@/services/payment';
import { Payment, PaymentStatusConfig } from '@/types/payment';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const formatCurrency = (amount?: number) => {
  if (!amount) return '0đ';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

const InfoRow = ({
  icon,
  iconColor,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  value: string;
}) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border.light,
    }}
  >
    <View
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: `${iconColor}20`,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
      }}
    >
      <Ionicons name={icon} size={18} color={iconColor} />
    </View>
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: 12,
          color: Colors.text.tertiary,
          marginBottom: 2,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: 14,
          fontWeight: '600',
          color: Colors.text.primary,
        }}
      >
        {value}
      </Text>
    </View>
  </View>
);

export default function PaymentDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPayment = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getPaymentById(id);
      setPayment(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPayment();
  }, [fetchPayment]);

  const openBlockchainExplorer = () => {
    if (payment?.blockchainTxHash) {
      const explorerUrl = `https://sepolia.etherscan.io/tx/${payment.blockchainTxHash}`;
      Linking.openURL(explorerUrl);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.background.secondary,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary[500]} />
      </View>
    );
  }

  if (!payment) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.background.secondary,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 40,
        }}
      >
        <Ionicons
          name="alert-circle-outline"
          size={60}
          color={Colors.neutral[400]}
        />
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: Colors.text.primary,
            marginTop: 16,
            marginBottom: 8,
          }}
        >
          Payment not found
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: Colors.text.tertiary,
            textAlign: 'center',
            marginBottom: 24,
          }}
        >
          The payment you're looking for doesn't exist or has been removed.
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={{
            backgroundColor: Colors.primary[500],
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: Colors.white, fontWeight: '600' }}>
            Go Back
          </Text>
        </Pressable>
      </View>
    );
  }

  const statusConfig = PaymentStatusConfig[payment.status];
  const doctor = payment.appointment?.doctor;
  const doctorName = doctor?.user?.fullName
    ? `${doctor.professionalTitle || ''} ${doctor.user.fullName}`.trim()
    : 'Unknown Doctor';
  const specialty = doctor?.primarySpecialty?.name || '';
  const appointment = payment.appointment;
  const timeSlot = appointment?.timeSlot;
  const timeSlotStr = timeSlot
    ? `${timeSlot.startTime} - ${timeSlot.endTime}`
    : '';

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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: Colors.background.secondary,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.text.primary} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '700',
                color: Colors.text.primary,
              }}
            >
              Payment Details
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: Colors.text.tertiary,
              }}
            >
              #{payment.paymentCode}
            </Text>
          </View>
        </View>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchPayment}
            tintColor={Colors.primary[500]}
          />
        }
      >
        <View style={{ padding: 20 }}>
          <Animated.View entering={FadeInDown.duration(400).delay(100)}>
            <View
              style={{
                backgroundColor: Colors.white,
                borderRadius: 20,
                padding: 20,
                marginBottom: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 3,
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 20,
                  backgroundColor: statusConfig.bgColor,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <Ionicons
                  name={statusConfig.icon as any}
                  size={36}
                  color={statusConfig.color}
                />
              </View>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '700',
                  color: statusConfig.color,
                  marginBottom: 4,
                }}
              >
                {statusConfig.label}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.text.tertiary,
                }}
              >
                {format(new Date(payment.createdAt), 'dd MMM yyyy, HH:mm')}
              </Text>

              <View
                style={{
                  marginTop: 20,
                  paddingTop: 20,
                  borderTopWidth: 1,
                  borderTopColor: Colors.border.light,
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: Colors.text.tertiary,
                    marginBottom: 4,
                  }}
                >
                  Total Amount
                </Text>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: '700',
                    color: Colors.secondary[600],
                  }}
                >
                  {formatCurrency(appointment?.consultationFee)}
                </Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(200)}>
            <View
              style={{
                backgroundColor: Colors.white,
                borderRadius: 20,
                padding: 18,
                marginBottom: 16,
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
                Appointment Info
              </Text>
              <InfoRow
                icon="person-outline"
                iconColor={Colors.primary[500]}
                label="Doctor"
                value={doctorName}
              />
              {specialty && (
                <InfoRow
                  icon="medical-outline"
                  iconColor={Colors.accent[500]}
                  label="Specialty"
                  value={specialty}
                />
              )}
              {appointment?.appointmentDate && (
                <InfoRow
                  icon="calendar-outline"
                  iconColor={Colors.secondary[500]}
                  label="Date"
                  value={format(
                    new Date(appointment.appointmentDate),
                    'dd MMM yyyy'
                  )}
                />
              )}
              {timeSlotStr && (
                <InfoRow
                  icon="time-outline"
                  iconColor={Colors.info}
                  label="Time"
                  value={timeSlotStr}
                />
              )}
              <View style={{ borderBottomWidth: 0 }}>
                <InfoRow
                  icon={
                    appointment?.examinationType === 'IN_PERSON'
                      ? 'business-outline'
                      : 'videocam-outline'
                  }
                  iconColor={Colors.neutral[600]}
                  label="Examination Type"
                  value={
                    appointment?.examinationType === 'IN_PERSON'
                      ? 'In-Person'
                      : 'Online'
                  }
                />
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(300)}>
            <View
              style={{
                backgroundColor: Colors.white,
                borderRadius: 20,
                padding: 18,
                marginBottom: 16,
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
                Payment Details
              </Text>
              <InfoRow
                icon="card-outline"
                iconColor={Colors.primary[500]}
                label="Payment Method"
                value={
                  payment.method === 'BANK_TRANSFER' ? 'Bank Transfer' : 'Cash'
                }
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.border.light,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: Colors.text.secondary,
                  }}
                >
                  Consultation Fee
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: Colors.text.primary,
                  }}
                >
                  {formatCurrency(appointment?.consultationFee)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: Colors.text.primary,
                  }}
                >
                  Total
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: Colors.secondary[600],
                  }}
                >
                  {formatCurrency(appointment?.consultationFee)}
                </Text>
              </View>
            </View>
          </Animated.View>

          {payment.blockchainTxHash && (
            <Animated.View entering={FadeInDown.duration(400).delay(400)}>
              <View
                style={{
                  backgroundColor: Colors.white,
                  borderRadius: 20,
                  padding: 18,
                  marginBottom: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 12,
                  }}
                >
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={20}
                    color={Colors.info}
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '700',
                      color: Colors.text.primary,
                    }}
                  >
                    Blockchain Verification
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: Colors.background.secondary,
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: Colors.text.tertiary,
                      marginBottom: 4,
                    }}
                  >
                    Transaction Hash
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: Colors.text.secondary,
                      fontFamily: 'monospace',
                    }}
                    numberOfLines={1}
                    ellipsizeMode="middle"
                  >
                    {payment.blockchainTxHash}
                  </Text>
                </View>
                <Pressable
                  onPress={openBlockchainExplorer}
                  style={{
                    backgroundColor: Colors.info,
                    borderRadius: 12,
                    paddingVertical: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons
                    name="open-outline"
                    size={18}
                    color={Colors.white}
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: Colors.white,
                    }}
                  >
                    View on Explorer
                  </Text>
                </Pressable>
              </View>
            </Animated.View>
          )}

          {appointment?.symptoms && (
            <Animated.View entering={FadeInDown.duration(400).delay(500)}>
              <View
                style={{
                  backgroundColor: Colors.white,
                  borderRadius: 20,
                  padding: 18,
                  marginBottom: 16,
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
                    marginBottom: 8,
                  }}
                >
                  Symptoms
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: Colors.text.secondary,
                    lineHeight: 20,
                  }}
                >
                  {appointment.symptoms}
                </Text>
              </View>
            </Animated.View>
          )}

          {appointment?.id && (
            <Animated.View entering={FadeInDown.duration(400).delay(600)}>
              <Pressable
                onPress={() => router.push(`/appointment/${appointment.id}`)}
                style={{
                  backgroundColor: Colors.primary[500],
                  borderRadius: 16,
                  paddingVertical: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 30,
                }}
              >
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={Colors.white}
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: Colors.white,
                  }}
                >
                  View Appointment
                </Text>
              </Pressable>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

