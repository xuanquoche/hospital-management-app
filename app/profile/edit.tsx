import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Colors } from '@/constants/colors';
import { GENDER_OPTIONS } from '@/constants/options';
import { updateUserProfile, UpdateUserData } from '@/services/user';
import { useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, fetchUserProfile } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateUserData>({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    address: user?.address || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || undefined,
  });

  const handleChange = (key: keyof UpdateUserData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!formData.fullName?.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile(formData);
      await fetchUserProfile();
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || 'Failed to update profile';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
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
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: Colors.background.secondary,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 14,
          }}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.text.primary} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: Colors.text.primary,
            }}
          >
            Edit Profile
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: Colors.text.tertiary,
              marginTop: 2,
            }}
          >
            Update your personal information
          </Text>
        </View>
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ padding: 20 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            entering={FadeInDown.duration(400).delay(100)}
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
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  backgroundColor: Colors.primary[100],
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 14,
                }}
              >
                <Ionicons
                  name="person-outline"
                  size={22}
                  color={Colors.primary[600]}
                />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: Colors.text.primary,
                  }}
                >
                  Personal Information
                </Text>
                <Text style={{ fontSize: 13, color: Colors.text.tertiary }}>
                  Basic details about you
                </Text>
              </View>
            </View>

            <Input
              label="Full Name"
              placeholder="Enter your full name"
              leftIcon="person-outline"
              value={formData.fullName}
              onChangeText={(value) => handleChange('fullName', value)}
              autoCapitalize="words"
            />

            <Input
              label="Phone Number"
              placeholder="Enter your phone number"
              leftIcon="call-outline"
              value={formData.phone}
              onChangeText={(value) => handleChange('phone', value)}
              keyboardType="phone-pad"
            />

            <Input
              label="Address"
              placeholder="Enter your address"
              leftIcon="location-outline"
              value={formData.address}
              onChangeText={(value) => handleChange('address', value)}
              multiline
            />

            <Input
              label="Date of Birth"
              placeholder="YYYY-MM-DD"
              leftIcon="calendar-outline"
              value={formData.dateOfBirth}
              onChangeText={(value) => handleChange('dateOfBirth', value)}
            />

            <Select
              label="Gender"
              placeholder="Select your gender"
              value={formData.gender}
              options={GENDER_OPTIONS}
              onChange={(value) =>
                handleChange('gender', value as UpdateUserData['gender'])
              }
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(200)}>
            <Button onPress={handleSave} loading={loading} size="lg">
              Save Changes
            </Button>
          </Animated.View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
