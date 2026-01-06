import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants/colors';
import { LoginFormData, loginSchema } from '@/constants/validation';
import { useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const { login, isLoading: storeLoading } = useAuthStore();
  const passwordRef = useRef<TextInput>(null);

  const floatAnim = useSharedValue(0);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    floatAnim.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 2000 }),
        withTiming(0, { duration: 2000 })
      ),
      -1,
      true
    );
  }, []);

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatAnim.value }],
  }));

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message || 'Login failed. Please try again.';
      setError('root', { message });
    }
  };

  const loading = isSubmitting || storeLoading;

  return (
    <View className="flex-1 bg-white">
      <LinearGradient
        colors={[Colors.primary[500], Colors.primary[600], Colors.primary[700]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '45%',
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
      />

      <View
        style={{
          position: 'absolute',
          top: 60,
          left: 20,
          opacity: 0.1,
        }}
      >
        <Ionicons name="medical" size={120} color={Colors.white} />
      </View>
      <View
        style={{
          position: 'absolute',
          top: 100,
          right: 30,
          opacity: 0.08,
        }}
      >
        <Ionicons name="heart" size={80} color={Colors.white} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 pt-16">
            <Animated.View
              entering={FadeInUp.duration(800).springify()}
              className="items-center mb-8"
            >
              <Animated.View
                style={[
                  {
                    width: 90,
                    height: 90,
                    borderRadius: 24,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 16,
                  },
                  floatingStyle,
                ]}
              >
                <Ionicons
                  name="medical-outline"
                  size={50}
                  color={Colors.white}
                />
              </Animated.View>
              <Text className="text-4xl font-bold text-white tracking-tight">
                MediCare
              </Text>
              <Text className="text-white/80 text-base mt-2">
                Your Health, Our Priority
              </Text>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.duration(600).delay(300).springify()}
              style={{
                backgroundColor: Colors.white,
                borderRadius: 28,
                padding: 24,
                marginTop: 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.15,
                shadowRadius: 20,
                elevation: 10,
              }}
            >
              <View className="mb-6">
                <Text className="text-2xl font-bold text-neutral-900">
                  Welcome Back!
                </Text>
                <Text className="text-neutral-500 mt-1">
                  Sign in to continue to your account
                </Text>
              </View>

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Email Address"
                    placeholder="Enter your email"
                    leftIcon="mail-outline"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    returnKeyType="next"
                    onSubmitEditing={() => passwordRef.current?.focus()}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.email?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    ref={passwordRef}
                    label="Password"
                    placeholder="Enter your password"
                    leftIcon="lock-closed-outline"
                    secureTextEntry
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit(onSubmit)}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                  />
                )}
              />

              <Link href="/(auth)/forgot-password" asChild>
                <Pressable className="self-end mb-6">
                  <Text className="text-primary-600 font-semibold text-sm">
                    Forgot Password?
                  </Text>
                </Pressable>
              </Link>

              {errors.root && (
                <Animated.View
                  entering={FadeIn.duration(300)}
                  className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex-row items-center"
                >
                  <Ionicons
                    name="alert-circle"
                    size={20}
                    color={Colors.error}
                  />
                  <Text className="text-red-600 ml-2 flex-1 text-sm">
                    {errors.root.message}
                  </Text>
                </Animated.View>
              )}

              <Button
                onPress={handleSubmit(onSubmit)}
                loading={loading}
                size="lg"
                icon="log-in-outline"
                iconPosition="right"
              >
                Sign In
              </Button>

              <View className="flex-row items-center my-6">
                <View className="flex-1 h-px bg-neutral-200" />
                <Text className="mx-4 text-neutral-400 text-sm">
                  or continue with
                </Text>
                <View className="flex-1 h-px bg-neutral-200" />
              </View>

              <View className="flex-row gap-3">
                <Pressable
                  className="flex-1 flex-row items-center justify-center py-3.5 border border-neutral-200 rounded-xl active:bg-neutral-50"
                >
                  <Ionicons
                    name="logo-google"
                    size={22}
                    color={Colors.neutral[700]}
                  />
                  <Text className="ml-2 font-semibold text-neutral-700">
                    Google
                  </Text>
                </Pressable>
                <Pressable
                  className="flex-1 flex-row items-center justify-center py-3.5 border border-neutral-200 rounded-xl active:bg-neutral-50"
                >
                  <Ionicons
                    name="logo-apple"
                    size={22}
                    color={Colors.neutral[700]}
                  />
                  <Text className="ml-2 font-semibold text-neutral-700">
                    Apple
                  </Text>
                </Pressable>
              </View>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.duration(600).delay(500)}
              className="flex-row justify-center mt-8 mb-8"
            >
              <Text className="text-neutral-600">
                Don't have an account?{' '}
              </Text>
              <Link href="/(auth)/register" asChild>
                <Pressable>
                  <Text className="text-primary-600 font-bold">
                    Sign Up
                  </Text>
                </Pressable>
              </Link>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
