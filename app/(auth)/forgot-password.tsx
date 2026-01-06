import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants/colors';
import {
  ForgotPasswordFormData,
  forgotPasswordSchema,
} from '@/constants/validation';
import { api } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await api.post('/auth/forgot-password', { email: data.email });
      setSentEmail(data.email);
      setIsSuccess(true);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        'Failed to send reset email. Please try again.';
      setError('root', { message });
    }
  };

  if (isSuccess) {
    return (
      <View className="flex-1 bg-white">
        <LinearGradient
          colors={[Colors.secondary[500], Colors.secondary[600]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '40%',
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          }}
        />

        <View className="flex-1 px-6 justify-center items-center">
          <Animated.View
            entering={FadeIn.duration(600)}
            style={{
              backgroundColor: Colors.white,
              borderRadius: 28,
              padding: 32,
              width: '100%',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.15,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: Colors.secondary[100],
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 24,
              }}
            >
              <Ionicons
                name="mail-open-outline"
                size={40}
                color={Colors.secondary[600]}
              />
            </View>

            <Text className="text-2xl font-bold text-neutral-900 text-center mb-2">
              Check Your Email
            </Text>
            <Text className="text-neutral-500 text-center mb-6 leading-6">
              We've sent a password reset link to{'\n'}
              <Text className="font-semibold text-neutral-700">{sentEmail}</Text>
            </Text>

            <View className="bg-primary-50 rounded-xl p-4 w-full mb-6">
              <View className="flex-row items-start">
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color={Colors.primary[600]}
                  style={{ marginRight: 8, marginTop: 2 }}
                />
                <Text className="flex-1 text-primary-700 text-sm leading-5">
                  Please check your spam folder if you don't see the email in
                  your inbox.
                </Text>
              </View>
            </View>

            <Button
              onPress={() => router.replace('/(auth)/login')}
              variant="primary"
              size="lg"
              icon="arrow-back"
              iconPosition="left"
            >
              Back to Login
            </Button>

            <Pressable
              onPress={() => {
                setIsSuccess(false);
                setSentEmail('');
              }}
              className="mt-4"
            >
              <Text className="text-neutral-500 text-sm">
                Didn't receive the email?{' '}
                <Text className="text-primary-600 font-semibold">
                  Try again
                </Text>
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <LinearGradient
        colors={[Colors.accent[500], Colors.accent[600], Colors.primary[600]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40%',
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
      />

      <View
        style={{
          position: 'absolute',
          top: 60,
          right: 20,
          opacity: 0.1,
        }}
      >
        <Ionicons name="key" size={100} color={Colors.white} />
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
            <Link href="/(auth)/login" asChild>
              <Pressable
                className="flex-row items-center mb-8"
                hitSlop={10}
              >
                <Ionicons name="arrow-back" size={24} color={Colors.white} />
                <Text className="text-white font-semibold ml-2">Back</Text>
              </Pressable>
            </Link>

            <Animated.View
              entering={FadeInUp.duration(800).springify()}
              className="items-center mb-8"
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 20,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <Ionicons name="key-outline" size={40} color={Colors.white} />
              </View>
              <Text className="text-3xl font-bold text-white tracking-tight">
                Forgot Password?
              </Text>
              <Text className="text-white/80 text-base mt-2 text-center">
                No worries, we'll help you reset it
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
              <View className="mb-6">
                <Text className="text-xl font-bold text-neutral-900">
                  Reset Password
                </Text>
                <Text className="text-neutral-500 text-sm mt-2 leading-5">
                  Enter the email address associated with your account and
                  we'll send you a link to reset your password.
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
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit(onSubmit)}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.email?.message}
                  />
                )}
              />

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
                loading={isSubmitting}
                size="lg"
                icon="send-outline"
                iconPosition="right"
              >
                Send Reset Link
              </Button>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.duration(600).delay(400)}
              className="flex-row justify-center mt-8"
            >
              <Text className="text-neutral-600">Remember your password? </Text>
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

