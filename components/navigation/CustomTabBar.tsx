import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TabConfig {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconFocused: keyof typeof Ionicons.glyphMap;
  label: string;
  badge?: number;
}

const TAB_CONFIG: TabConfig[] = [
  { name: 'home', icon: 'home-outline', iconFocused: 'home', label: 'Home' },
  { name: 'booking', icon: 'calendar-outline', iconFocused: 'calendar', label: 'Book' },
  { name: 'appointments', icon: 'list-outline', iconFocused: 'list', label: 'Appointments' },
  { name: 'chat', icon: 'chatbubble-outline', iconFocused: 'chatbubble', label: 'Chat' },
  { name: 'profile', icon: 'person-outline', iconFocused: 'person', label: 'Profile' },
];

interface TabItemProps {
  route: any;
  index: number;
  state: any;
  descriptors: any;
  navigation: any;
  badge?: number;
}

const TabItem: React.FC<TabItemProps> = ({
  route,
  index,
  state,
  descriptors,
  navigation,
  badge,
}) => {
  const isFocused = state.index === index;
  const scale = useSharedValue(1);
  const tabConfig = TAB_CONFIG.find((t) => t.name === route.name);

  const onPressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
  };

  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const onPress = () => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!tabConfig) return null;

  return (
    <AnimatedPressable
      key={route.key}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[
        {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 8,
        },
        animatedStyle,
      ]}
    >
      <View style={{ position: 'relative' }}>
        {isFocused ? (
          <LinearGradient
            colors={[Colors.primary[500], Colors.primary[600]]}
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: Colors.primary[500],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Ionicons
              name={tabConfig.iconFocused}
              size={24}
              color={Colors.white}
            />
          </LinearGradient>
        ) : (
          <View
            style={{
              width: 48,
              height: 48,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons
              name={tabConfig.icon}
              size={24}
              color={Colors.neutral[400]}
            />
          </View>
        )}
        {badge !== undefined && badge > 0 && (
          <View
            style={{
              position: 'absolute',
              top: isFocused ? 0 : 4,
              right: isFocused ? 0 : 4,
              backgroundColor: Colors.error,
              borderRadius: 10,
              minWidth: 18,
              height: 18,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 4,
              borderWidth: 2,
              borderColor: Colors.white,
            }}
          >
            <Text
              style={{
                color: Colors.white,
                fontSize: 10,
                fontWeight: '700',
              }}
            >
              {badge > 99 ? '99+' : badge}
            </Text>
          </View>
        )}
      </View>
      <Text
        style={{
          marginTop: 4,
          fontSize: 10,
          fontWeight: isFocused ? '600' : '500',
          color: isFocused ? Colors.primary[600] : Colors.neutral[400],
        }}
      >
        {tabConfig.label}
      </Text>
    </AnimatedPressable>
  );
};

interface CustomTabBarProps extends BottomTabBarProps {
  unreadMessages?: number;
}

export const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors,
  navigation,
  unreadMessages = 0,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: Colors.white,
        paddingBottom: Platform.OS === 'ios' ? insets.bottom : 12,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: Colors.border.light,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 10,
      }}
    >
      {state.routes.map((route: any, index: number) => {
        const badge = route.name === 'chat' ? unreadMessages : undefined;
        return (
          <TabItem
            key={route.key}
            route={route}
            index={index}
            state={state}
            descriptors={descriptors}
            navigation={navigation}
            badge={badge}
          />
        );
      })}
    </View>
  );
};

