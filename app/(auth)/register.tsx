import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants/colors';
import { RegisterFormData, registerSchema } from '@/constants/validation';
import { useAuthStore } from '@/store/authStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
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
} from 'react-native-reanimated';

export default function RegisterScreen() {
  const { register, isLoading: storeLoading } = useAuthStore();
  const router = useRouter();
  const [agreeTerms, setAgreeTerms] = useState(false);

  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    if (!agreeTerms) {
      setError('root', { message: 'Please agree to the Terms & Conditions' });
      return;
    }

    try {
      await register({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        phone: data.phone,
      });
      router.replace('/(auth)/login');
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err.message ||
        'Registration failed. Please try again.';
      setError('root', { message });
    }
  };

  const loading = isSubmitting || storeLoading;

  return (
    <View className="flex-1 bg-white">
      <LinearGradient
        colors={[
          Colors.secondary[500],
          Colors.secondary[600],
          Colors.primary[600],
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '35%',
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
      />

      <View
        style={{
          position: 'absolute',
          top: 50,
          right: 20,
          opacity: 0.1,
        }}
      >
        <Ionicons name="person-add" size={100} color={Colors.white} />
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
          <View className="flex-1 px-6 pt-12">
            <Animated.View
              entering={FadeInUp.duration(800).springify()}
              className="items-center mb-6"
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 20,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <Ionicons name="person-add-outline" size={40} color={Colors.white} />
              </View>
              <Text className="text-3xl font-bold text-white tracking-tight">
                Create Account
              </Text>
              <Text className="text-white/80 text-base mt-1">
                Join MediCare Today
              </Text>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.duration(600).delay(200).springify()}
              style={{
                backgroundColor: Colors.white,
                borderRadius: 28,
                padding: 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.15,
                shadowRadius: 20,
                elevation: 10,
              }}
            >
              <View className="mb-4">
                <Text className="text-xl font-bold text-neutral-900">
                  Your Information
                </Text>
                <Text className="text-neutral-500 text-sm mt-1">
                  Fill in your details to get started
                </Text>
              </View>

              <Controller
                control={control}
                name="fullName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    leftIcon="person-outline"
                    autoCapitalize="words"
                    autoComplete="name"
                    returnKeyType="next"
                    onSubmitEditing={() => emailRef.current?.focus()}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.fullName?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    ref={emailRef}
                    label="Email Address"
                    placeholder="Enter your email"
                    leftIcon="mail-outline"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    returnKeyType="next"
                    onSubmitEditing={() => phoneRef.current?.focus()}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.email?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    ref={phoneRef}
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    leftIcon="call-outline"
                    keyboardType="phone-pad"
                    returnKeyType="next"
                    onSubmitEditing={() => passwordRef.current?.focus()}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.phone?.message}
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
                    placeholder="Create a password"
                    leftIcon="lock-closed-outline"
                    secureTextEntry
                    returnKeyType="next"
                    onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    ref={confirmPasswordRef}
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    leftIcon="checkmark-circle-outline"
                    secureTextEntry
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit(onSubmit)}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.confirmPassword?.message}
                  />
                )}
              />

              <Pressable
                onPress={() => setAgreeTerms(!agreeTerms)}
                className="flex-row items-start mb-6"
              >
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    borderWidth: 2,
                    borderColor: agreeTerms
                      ? Colors.primary[500]
                      : Colors.neutral[300],
                    backgroundColor: agreeTerms
                      ? Colors.primary[500]
                      : 'transparent',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 10,
                    marginTop: 2,
                  }}
                >
                  {agreeTerms && (
                    <Ionicons name="checkmark" size={14} color={Colors.white} />
                  )}
                </View>
                <Text className="flex-1 text-neutral-600 text-sm leading-5">
                  I agree to the{' '}
                  <Text className="text-primary-600 font-semibold">
                    Terms of Service
                  </Text>{' '}
                  and{' '}
                  <Text className="text-primary-600 font-semibold">
                    Privacy Policy
                  </Text>
                </Text>
              </Pressable>

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
                icon="person-add-outline"
                iconPosition="right"
              >
                Create Account
              </Button>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.duration(600).delay(400)}
              className="flex-row justify-center mt-6 mb-8"
            >
              <Text className="text-neutral-600">
                Already have an account?{' '}
              </Text>
              <Link href="/(auth)/login" asChild>
                <Pressable>
                  <Text className="text-primary-600 font-bold">Sign In</Text>
                </Pressable>
              </Link>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
