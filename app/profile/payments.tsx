import { Colors } from '@/constants/colors';
import { getMyPayments } from '@/services/payment';
import { Payment, PaymentStatus, PaymentStatusConfig } from '@/types/payment';
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

type TabType = 'all' | 'success' | 'pending';

const formatCurrency = (amount?: number) => {
  if (!amount) return '0đ';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export default function PaymentsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const { data } = await getMyPayments({ limit: 100 });
      setPayments(data || []);
    } catch (e) {
      console.error(e);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPayments();
    }, [])
  );

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const status = payment.status as PaymentStatus;
      switch (activeTab) {
        case 'success':
          return status === 'SUCCESS';
        case 'pending':
          return status === 'PENDING';
        default:
          return true;
      }
    });
  }, [payments, activeTab]);

  const tabs = [
    { key: 'all' as TabType, label: 'All', icon: 'list-outline' },
    { key: 'success' as TabType, label: 'Success', icon: 'checkmark-circle-outline' },
    { key: 'pending' as TabType, label: 'Pending', icon: 'time-outline' },
  ];

  const renderItem = ({ item, index }: { item: Payment; index: number }) => {
    const statusConfig = PaymentStatusConfig[item.status];
    const paymentDate = new Date(item.createdAt);
    const doctor = item.appointment?.doctor;
    const doctorName = doctor?.user?.fullName
      ? `${doctor.professionalTitle || ''} ${doctor.user.fullName}`.trim()
      : 'Unknown Doctor';
    const specialty = doctor?.primarySpecialty?.name || '';
    const consultationFee = item.appointment?.consultationFee || 0;

    return (
      <Animated.View entering={FadeInDown.duration(400).delay(index * 100)}>
        <Pressable
          onPress={() => router.push(`/payment/${item.id}`)}
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
              alignItems: 'flex-start',
              marginBottom: 14,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 12,
                  color: Colors.text.tertiary,
                  marginBottom: 4,
                }}
              >
                #{item.paymentCode}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: Colors.text.primary,
                }}
              >
                {doctorName}
              </Text>
              {specialty && (
                <Text
                  style={{
                    fontSize: 13,
                    color: Colors.text.secondary,
                    marginTop: 2,
                  }}
                >
                  {specialty}
                </Text>
              )}
            </View>
            <View
              style={{
                backgroundColor: statusConfig.bgColor,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 20,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons
                name={statusConfig.icon as any}
                size={14}
                color={statusConfig.color}
                style={{ marginRight: 4 }}
              />
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
                {format(paymentDate, 'dd MMM yyyy')}
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
                {format(paymentDate, 'HH:mm')}
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
                name="wallet-outline"
                size={16}
                color={Colors.secondary[600]}
              />
              <Text
                style={{
                  marginLeft: 6,
                  fontSize: 16,
                  fontWeight: '700',
                  color: Colors.secondary[600],
                }}
              >
                {formatCurrency(consultationFee)}
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
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
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
          <Text
            style={{
              fontSize: 24,
              fontWeight: '700',
              color: Colors.text.primary,
            }}
          >
            Payment History
          </Text>
        </View>

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
        data={filteredPayments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchPayments}
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
                name="wallet-outline"
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
              No payments found
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: Colors.text.tertiary,
                textAlign: 'center',
                paddingHorizontal: 40,
              }}
            >
              {activeTab === 'all'
                ? 'Your payment history will appear here after you complete appointments'
                : `No ${activeTab} payments found`}
            </Text>
          </View>
        }
      />
    </View>
  );
}

