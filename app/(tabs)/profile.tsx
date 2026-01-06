import { Colors } from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuthStore } from '@/store/authStore';
import { LANGUAGES, useLanguageStore } from '@/store/languageStore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconBgColor: string;
  iconColor: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
  danger?: boolean;
  rightElement?: React.ReactNode;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  iconBgColor,
  iconColor,
  title,
  subtitle,
  onPress,
  showArrow = true,
  danger = false,
  rightElement,
}) => (
  <Pressable
    onPress={onPress}
    style={{
      backgroundColor: Colors.white,
      paddingVertical: 16,
      paddingHorizontal: 18,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 6,
      elevation: 2,
    }}
  >
    <View
      style={{
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: iconBgColor,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
      }}
    >
      <Ionicons name={icon} size={22} color={iconColor} />
    </View>
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: 15,
          fontWeight: '600',
          color: danger ? Colors.error : Colors.text.primary,
        }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          style={{
            fontSize: 13,
            color: Colors.text.tertiary,
            marginTop: 2,
          }}
          numberOfLines={1}
        >
          {subtitle}
        </Text>
      )}
    </View>
    {rightElement}
    {showArrow && !rightElement && (
      <Ionicons name="chevron-forward" size={20} color={Colors.neutral[400]} />
    )}
  </Pressable>
);

const calculateBMI = (height?: number, weight?: number) => {
  if (!height || !weight) return null;
  const heightInMeters = height / 100;
  return (weight / (heightInMeters * heightInMeters)).toFixed(1);
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const { logout, user, patientProfile, fetchUserProfile } = useAuthStore();
  const { language, loadLanguage } = useLanguageStore();
  const [loading, setLoading] = useState(false);

  const currentLanguage = LANGUAGES.find((l) => l.code === language);

  useEffect(() => {
    loadLanguage();
  }, []);

  const fetchData = async (force = false) => {
    setLoading(true);
    try {
      await fetchUserProfile(force);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleLogout = () => {
    Alert.alert(
      t('profile.logout'),
      t('profile.logoutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.logout'),
          style: 'destructive',
          onPress: () => logout(),
        },
      ],
      { cancelable: true }
    );
  };

  const bmi = calculateBMI(patientProfile?.height, patientProfile?.weight);

  const getDisplayName = () => {
    if (user?.fullName) return user.fullName;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const getInitial = () => {
    if (user?.fullName) return user.fullName.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background.secondary }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => fetchData(true)}
            tintColor={Colors.primary[500]}
          />
        }
      >
        <LinearGradient
          colors={[Colors.primary[500], Colors.primary[600]]}
          style={{
            paddingTop: insets.top + 20,
            paddingBottom: 60,
            alignItems: 'center',
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}
        >
          <Animated.View
            entering={FadeInUp.duration(500)}
            style={{ alignItems: 'center' }}
          >
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 30,
                backgroundColor: Colors.white,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 10,
                elevation: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 40,
                  fontWeight: '700',
                  color: Colors.primary[600],
                }}
              >
                {getInitial()}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: Colors.white,
                marginBottom: 4,
              }}
            >
              {getDisplayName()}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              {user?.email}
            </Text>
            <Pressable
              onPress={() => router.push('/profile/edit')}
              style={{
                marginTop: 16,
                backgroundColor: 'rgba(255,255,255,0.2)',
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 20,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons name="create-outline" size={16} color={Colors.white} />
              <Text
                style={{
                  color: Colors.white,
                  fontWeight: '600',
                  marginLeft: 8,
                  fontSize: 14,
                }}
              >
                {t('profile.editProfile')}
              </Text>
            </Pressable>
          </Animated.View>
        </LinearGradient>

        <View style={{ padding: 20, marginTop: -30 }}>
          <Animated.View entering={FadeInDown.duration(400).delay(100)}>
            <Pressable
              onPress={() => router.push('/profile/medical')}
              style={{
                backgroundColor: Colors.white,
                borderRadius: 20,
                padding: 20,
                marginBottom: 20,
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
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: Colors.text.primary,
                  }}
                >
                  {t('profile.healthOverview')}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                    style={{
                      fontSize: 13,
                      color: Colors.primary[600],
                      fontWeight: '600',
                      marginRight: 4,
                    }}
                  >
                    {t('common.edit')}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={Colors.primary[600]}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ alignItems: 'center' }}>
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      backgroundColor: Colors.primary[100],
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <Ionicons
                      name="resize-outline"
                      size={22}
                      color={Colors.primary[600]}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      color: Colors.text.primary,
                    }}
                  >
                    {patientProfile?.height || '--'}
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '400',
                        color: Colors.text.tertiary,
                      }}
                    >
                      {' '}
                      cm
                    </Text>
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: Colors.text.tertiary,
                    }}
                  >
                    {t('profile.height')}
                  </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      backgroundColor: Colors.accent[100],
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <Ionicons
                      name="barbell-outline"
                      size={22}
                      color={Colors.accent[600]}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      color: Colors.text.primary,
                    }}
                  >
                    {patientProfile?.weight || '--'}
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '400',
                        color: Colors.text.tertiary,
                      }}
                    >
                      {' '}
                      kg
                    </Text>
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: Colors.text.tertiary,
                    }}
                  >
                    {t('profile.weight')}
                  </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      backgroundColor: '#FEE2E2',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <Ionicons
                      name="water-outline"
                      size={22}
                      color={Colors.error}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      color: Colors.text.primary,
                    }}
                  >
                    {patientProfile?.bloodType || '--'}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: Colors.text.tertiary,
                    }}
                  >
                    {t('profile.bloodType')}
                  </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      backgroundColor: Colors.secondary[100],
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <Ionicons
                      name="analytics-outline"
                      size={22}
                      color={Colors.secondary[600]}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      color: Colors.text.primary,
                    }}
                  >
                    {bmi || '--'}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: Colors.text.tertiary,
                    }}
                  >
                    {t('profile.bmi')}
                  </Text>
                </View>
              </View>
              {patientProfile?.allergies && (
                <View
                  style={{
                    marginTop: 16,
                    backgroundColor: '#FEF3C7',
                    borderRadius: 12,
                    padding: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Ionicons
                    name="warning-outline"
                    size={18}
                    color="#D97706"
                    style={{ marginRight: 8 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, color: '#92400E', fontWeight: '600' }}>
                      {t('profile.allergies')}
                    </Text>
                    <Text style={{ fontSize: 13, color: '#78350F' }}>
                      {patientProfile.allergies}
                    </Text>
                  </View>
                </View>
              )}
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(200)}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: Colors.text.tertiary,
                marginBottom: 12,
                marginLeft: 4,
              }}
            >
              {t('profile.personalInfo')}
            </Text>
            <MenuItem
              icon="call-outline"
              iconBgColor={Colors.secondary[100]}
              iconColor={Colors.secondary[600]}
              title={t('profile.phoneNumber')}
              subtitle={user?.phone || t('common.notSet')}
              onPress={() => router.push('/profile/edit')}
            />
            <MenuItem
              icon="location-outline"
              iconBgColor={Colors.accent[100]}
              iconColor={Colors.accent[600]}
              title={t('profile.address')}
              subtitle={user?.address || t('common.notSet')}
              onPress={() => router.push('/profile/edit')}
            />
            <MenuItem
              icon="calendar-outline"
              iconBgColor={Colors.primary[100]}
              iconColor={Colors.primary[600]}
              title={t('profile.dateOfBirth')}
              subtitle={user?.dateOfBirth || t('common.notSet')}
              onPress={() => router.push('/profile/edit')}
            />
            <MenuItem
              icon="shield-checkmark-outline"
              iconBgColor="#E0E7FF"
              iconColor="#4F46E5"
              title={t('profile.insuranceNumber')}
              subtitle={patientProfile?.healthInsuranceNumber || t('common.notSet')}
              onPress={() => router.push('/profile/medical')}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(400).delay(300)}
            style={{ marginTop: 10 }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: Colors.text.tertiary,
                marginBottom: 12,
                marginLeft: 4,
              }}
            >
              {t('profile.emergencyContact')}
            </Text>
            <MenuItem
              icon="people-outline"
              iconBgColor="#FEE2E2"
              iconColor={Colors.error}
              title={t('profile.emergencyContact')}
              subtitle={patientProfile?.emergencyContact || t('common.notSet')}
              onPress={() => router.push('/profile/medical')}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(400).delay(400)}
            style={{ marginTop: 10 }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: Colors.text.tertiary,
                marginBottom: 12,
                marginLeft: 4,
              }}
            >
              {t('profile.paymentsSettings')}
            </Text>
            <MenuItem
              icon="wallet-outline"
              iconBgColor={Colors.secondary[100]}
              iconColor={Colors.secondary[600]}
              title={t('profile.paymentHistory')}
              subtitle={t('profile.viewTransactions')}
              onPress={() => router.push('/profile/payments')}
            />
            <MenuItem
              icon="language-outline"
              iconBgColor={Colors.primary[100]}
              iconColor={Colors.primary[600]}
              title={t('profile.language')}
              onPress={() => router.push('/profile/language')}
              rightElement={
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 14, marginRight: 4 }}>
                    {currentLanguage?.flag}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: Colors.text.secondary,
                      fontWeight: '500',
                      marginRight: 8,
                    }}
                  >
                    {currentLanguage?.nativeName}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color={Colors.neutral[400]} />
                </View>
              }
            />
            <MenuItem
              icon="notifications-outline"
              iconBgColor="#E0E7FF"
              iconColor="#4F46E5"
              title={t('profile.notifications')}
              subtitle={t('profile.enabled')}
              onPress={() => router.push('/profile/settings')}
            />
            <MenuItem
              icon="help-circle-outline"
              iconBgColor={Colors.accent[100]}
              iconColor={Colors.accent[600]}
              title={t('profile.helpSupport')}
              onPress={() => router.push('/(tabs)/chat')}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(400).delay(500)}
            style={{ marginTop: 10, marginBottom: 40 }}
          >
            <MenuItem
              icon="log-out-outline"
              iconBgColor="#FEE2E2"
              iconColor={Colors.error}
              title={t('profile.logout')}
              showArrow={false}
              danger
              onPress={handleLogout}
            />
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}
