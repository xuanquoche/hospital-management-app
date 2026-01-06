import { Colors, Shadows } from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';
import * as Storage from '@/services/storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Switch, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SETTINGS_STORAGE_KEY = 'notification_settings';

interface NotificationSettings {
  push: boolean;
  email: boolean;
  sms: boolean;
  appointmentReminders: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  push: true,
  email: true,
  sms: false,
  appointmentReminders: true,
};

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconBgColor: string;
  iconColor: string;
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  iconBgColor,
  iconColor,
  title,
  description,
  value,
  onValueChange,
}) => (
  <View
    style={{
      backgroundColor: Colors.white,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      ...Shadows.sm,
    }}
  >
    <View
      style={{
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: iconBgColor,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
      }}
    >
      <Ionicons name={icon} size={24} color={iconColor} />
    </View>

    <View style={{ flex: 1, marginRight: 12 }}>
      <Text
        style={{
          fontSize: 15,
          fontWeight: '600',
          color: Colors.text.primary,
          marginBottom: 4,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 13,
          color: Colors.text.tertiary,
          lineHeight: 18,
        }}
      >
        {description}
      </Text>
    </View>

    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: Colors.neutral[300], true: Colors.primary[400] }}
      thumbColor={value ? Colors.primary[600] : Colors.neutral[100]}
      ios_backgroundColor={Colors.neutral[300]}
    />
  </View>
);

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await Storage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const updateSetting = async (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    try {
      await Storage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background.secondary }}>
      <LinearGradient
        colors={[Colors.primary[500], Colors.primary[600]]}
        style={{
          paddingTop: insets.top,
          paddingBottom: 30,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
        }}
      >
        <Animated.View
          entering={FadeInUp.duration(400)}
          style={{ paddingHorizontal: 20 }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
            }}
          >
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => ({
                width: 42,
                height: 42,
                borderRadius: 14,
                backgroundColor: 'rgba(255,255,255,0.15)',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 14,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Ionicons name="arrow-back" size={22} color={Colors.white} />
            </Pressable>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: Colors.white,
                }}
              >
                {t('settings.title')}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.75)',
                  marginTop: 4,
                }}
              >
                {t('settings.notificationSettings')}
              </Text>
            </View>

            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 16,
                backgroundColor: 'rgba(255,255,255,0.15)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="settings-outline" size={26} color={Colors.white} />
            </View>
          </View>
        </Animated.View>
      </LinearGradient>

      <View style={{ padding: 20, marginTop: -10 }}>
        <Animated.View entering={FadeInDown.duration(400).delay(50)}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: Colors.text.tertiary,
              marginBottom: 14,
              marginLeft: 4,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            {t('settings.notificationSettings')}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(100)}>
          <SettingItem
            icon="notifications"
            iconBgColor={Colors.primary[100]}
            iconColor={Colors.primary[600]}
            title={t('settings.pushNotifications')}
            description={t('settings.pushDesc')}
            value={settings.push}
            onValueChange={(value) => updateSetting('push', value)}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(150)}>
          <SettingItem
            icon="mail"
            iconBgColor={Colors.secondary[100]}
            iconColor={Colors.secondary[600]}
            title={t('settings.emailNotifications')}
            description={t('settings.emailDesc')}
            value={settings.email}
            onValueChange={(value) => updateSetting('email', value)}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(200)}>
          <SettingItem
            icon="chatbubble-ellipses"
            iconBgColor={Colors.accent[100]}
            iconColor={Colors.accent[600]}
            title={t('settings.smsNotifications')}
            description={t('settings.smsDesc')}
            value={settings.sms}
            onValueChange={(value) => updateSetting('sms', value)}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(250)}>
          <SettingItem
            icon="alarm"
            iconBgColor="#E0E7FF"
            iconColor="#4F46E5"
            title={t('settings.appointmentReminders')}
            description={t('settings.reminderDesc')}
            value={settings.appointmentReminders}
            onValueChange={(value) => updateSetting('appointmentReminders', value)}
          />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(400).delay(350)}
          style={{
            marginTop: 20,
            backgroundColor: Colors.white,
            borderRadius: 16,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            ...Shadows.sm,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: Colors.info + '20',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 14,
            }}
          >
            <Ionicons name="information-circle" size={22} color={Colors.info} />
          </View>
          <Text
            style={{
              flex: 1,
              fontSize: 13,
              color: Colors.text.secondary,
              lineHeight: 19,
            }}
          >
            {t('language.languageChanged') === 'Language changed successfully'
              ? 'You can manage your notification preferences here. Some notifications may be required for important updates.'
              : t('language.languageChanged') === 'Thay đổi ngôn ngữ thành công'
              ? 'Bạn có thể quản lý tùy chọn thông báo tại đây. Một số thông báo có thể được yêu cầu cho các cập nhật quan trọng.'
              : 'ここで通知設定を管理できます。一部の通知は重要な更新のために必要な場合があります。'}
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

