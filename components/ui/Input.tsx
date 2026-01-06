import { Colors } from '@/constants/colors';
import { cn } from '@/lib/utils';
import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useState } from 'react';
import {
  Pressable,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerClassName?: string;
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      onRightIconPress,
      containerClassName,
      secureTextEntry,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const borderColor = useSharedValue(Colors.border.light);
    const scale = useSharedValue(1);

    const isPasswordField = secureTextEntry !== undefined;

    const handleFocus = (e: any) => {
      setIsFocused(true);
      borderColor.value = withTiming(
        error ? Colors.error : Colors.primary[500],
        { duration: 200 }
      );
      scale.value = withSpring(1.02, { damping: 15, stiffness: 400 });
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      borderColor.value = withTiming(
        error ? Colors.error : Colors.border.light,
        { duration: 200 }
      );
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
      onBlur?.(e);
    };

    const animatedContainerStyle = useAnimatedStyle(() => ({
      borderColor: borderColor.value,
      transform: [{ scale: scale.value }],
    }));

    return (
      <View className={cn('mb-4', containerClassName)}>
        {label && (
          <Text className="text-sm font-semibold text-neutral-700 mb-2">
            {label}
          </Text>
        )}
        <Animated.View
          style={[
            {
              borderWidth: 1.5,
              borderRadius: 14,
              backgroundColor: Colors.white,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
            },
            animatedContainerStyle,
          ]}
        >
          {leftIcon && (
            <Ionicons
              name={leftIcon}
              size={20}
              color={isFocused ? Colors.primary[500] : Colors.neutral[400]}
              style={{ marginRight: 12 }}
            />
          )}
          <AnimatedTextInput
            ref={ref}
            className="flex-1 py-4 text-base text-neutral-900"
            placeholderTextColor={Colors.neutral[400]}
            onFocus={handleFocus}
            onBlur={handleBlur}
            secureTextEntry={isPasswordField && !showPassword}
            {...props}
          />
          {isPasswordField && (
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={10}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={Colors.neutral[400]}
              />
            </Pressable>
          )}
          {rightIcon && !isPasswordField && (
            <Pressable onPress={onRightIconPress} hitSlop={10}>
              <Ionicons
                name={rightIcon}
                size={20}
                color={Colors.neutral[400]}
              />
            </Pressable>
          )}
        </Animated.View>
        {error && (
          <View className="flex-row items-center mt-1.5">
            <Ionicons
              name="alert-circle"
              size={14}
              color={Colors.error}
              style={{ marginRight: 4 }}
            />
            <Text className="text-xs text-red-500">{error}</Text>
          </View>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

