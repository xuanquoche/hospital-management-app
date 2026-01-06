import { Colors, Shadows } from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';
import { LANGUAGES, LanguageCode, useLanguageStore } from '@/store/languageStore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface LanguageItemProps {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  isSelected: boolean;
  index: number;
  onSelect: () => void;
}

const LanguageItem: React.FC<LanguageItemProps> = ({
  code,
  name,
  nativeName,
  flag,
  isSelected,
  index,
  onSelect,
}) => {
  const { t } = useTranslation();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(index * 100)}>
      <AnimatedPressable
        onPress={onSelect}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          {
            backgroundColor: Colors.white,
            borderRadius: 20,
            padding: 20,
            marginBottom: 14,
            borderWidth: 2,
            borderColor: isSelected ? Colors.primary[500] : Colors.transparent,
            ...Shadows.sm,
          },
          animatedStyle,
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              backgroundColor: isSelected ? Colors.primary[100] : Colors.neutral[100],
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 16,
            }}
          >
            <Text style={{ fontSize: 28 }}>{flag}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: Colors.text.primary,
                marginBottom: 4,
              }}
            >
              {nativeName}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: Colors.text.tertiary,
              }}
            >
              {name}
            </Text>
          </View>

          {isSelected ? (
            <LinearGradient
              colors={[Colors.primary[500], Colors.primary[600]]}
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="checkmark" size={20} color={Colors.white} />
            </LinearGradient>
          ) : (
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: Colors.neutral[300],
              }}
            />
          )}
        </View>

        {isSelected && (
          <View
            style={{
              marginTop: 14,
              backgroundColor: Colors.primary[50],
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Ionicons
              name="checkmark-circle"
              size={18}
              color={Colors.primary[600]}
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: Colors.primary[700],
              }}
            >
              {t('language.current')}
            </Text>
          </View>
        )}
      </AnimatedPressable>
    </Animated.View>
  );
};

export default function LanguageScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguageStore();

  const handleSelectLanguage = async (code: LanguageCode) => {
    if (code !== language) {
      await setLanguage(code);
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
                {t('language.title')}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.75)',
                  marginTop: 4,
                }}
              >
                {t('language.subtitle')}
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
              <Ionicons name="globe-outline" size={26} color={Colors.white} />
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
            {t('language.selectLanguage')}
          </Text>
        </Animated.View>

        {LANGUAGES.map((lang, index) => (
          <LanguageItem
            key={lang.code}
            code={lang.code}
            name={lang.name}
            nativeName={lang.nativeName}
            flag={lang.flag}
            isSelected={language === lang.code}
            index={index}
            onSelect={() => handleSelectLanguage(lang.code)}
          />
        ))}

        <Animated.View
          entering={FadeInDown.duration(400).delay(400)}
          style={{
            marginTop: 10,
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
            {language === 'vi'
              ? 'Thay đổi ngôn ngữ sẽ cập nhật toàn bộ ứng dụng'
              : language === 'ja'
              ? '言語を変更すると、アプリ全体に反映されます'
              : 'Changing language will update the entire app'}
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

