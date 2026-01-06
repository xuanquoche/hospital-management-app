import { Colors, Shadows } from '@/constants/colors';
import { cn } from '@/lib/utils';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: { paddingVertical: 10, paddingHorizontal: 16, fontSize: 14 },
  md: { paddingVertical: 14, paddingHorizontal: 20, fontSize: 16 },
  lg: { paddingVertical: 18, paddingHorizontal: 24, fontSize: 18 },
};

const iconSizes = { sm: 16, md: 18, lg: 20 };

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = true,
  disabled,
  className,
  onPressIn,
  onPressOut,
  ...props
}) => {
  const scale = useSharedValue(1);

  const handlePressIn = (e: any) => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    onPressOut?.(e);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isDisabled = disabled || loading;

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return Colors.white;
      case 'secondary':
        return Colors.primary[700];
      case 'outline':
        return Colors.primary[600];
      case 'ghost':
        return Colors.primary[600];
      case 'danger':
        return Colors.white;
      default:
        return Colors.white;
    }
  };

  const renderContent = () => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isDisabled ? 0.7 : 1,
      }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons
              name={icon}
              size={iconSizes[size]}
              color={getTextColor()}
              style={{ marginRight: 8 }}
            />
          )}
          <Text
            style={{
              color: getTextColor(),
              fontSize: sizeStyles[size].fontSize,
              fontWeight: '700',
            }}
          >
            {children}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons
              name={icon}
              size={iconSizes[size]}
              color={getTextColor()}
              style={{ marginLeft: 8 }}
            />
          )}
        </>
      )}
    </View>
  );

  const baseStyle = {
    borderRadius: 14,
    paddingVertical: sizeStyles[size].paddingVertical,
    paddingHorizontal: sizeStyles[size].paddingHorizontal,
    ...(fullWidth && { width: '100%' as const }),
    ...Shadows.md,
  };

  if (variant === 'primary') {
    return (
      <AnimatedPressable
        style={animatedStyle}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        className={cn(fullWidth && 'w-full', className)}
        {...props}
      >
        <LinearGradient
          colors={
            isDisabled
              ? [Colors.neutral[300], Colors.neutral[400]]
              : [Colors.primary[500], Colors.primary[600]]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[baseStyle, { ...Shadows.md }]}
        >
          {renderContent()}
        </LinearGradient>
      </AnimatedPressable>
    );
  }

  const getBackgroundColor = () => {
    if (isDisabled) return Colors.neutral[200];
    switch (variant) {
      case 'secondary':
        return Colors.primary[50];
      case 'outline':
        return 'transparent';
      case 'ghost':
        return 'transparent';
      case 'danger':
        return Colors.error;
      default:
        return Colors.primary[500];
    }
  };

  const getBorderStyle = () => {
    if (variant === 'outline') {
      return {
        borderWidth: 1.5,
        borderColor: isDisabled ? Colors.neutral[300] : Colors.primary[500],
      };
    }
    return {};
  };

  return (
    <AnimatedPressable
      style={[
        animatedStyle,
        baseStyle,
        { backgroundColor: getBackgroundColor() },
        getBorderStyle(),
        variant === 'ghost' && { ...Shadows.sm },
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      className={cn(fullWidth && 'w-full', className)}
      {...props}
    >
      {renderContent()}
    </AnimatedPressable>
  );
};

