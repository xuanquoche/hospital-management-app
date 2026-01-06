import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Colors } from '@/constants/colors';
import { BLOOD_TYPE_OPTIONS } from '@/constants/options';
import { updatePatientProfile, UpdatePatientData } from '@/services/patient';
import { useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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

interface MedicalFormData {
  height?: string;
  weight?: string;
  bloodType?: string;
  allergies?: string;
  chronicDisease?: string;
  healthInsuranceNumber?: string;
  emergencyContact?: string;
}

export default function EditMedicalScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { patientProfile, fetchUserProfile } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<MedicalFormData>({});

  useEffect(() => {
    const initForm = async () => {
      setLoading(true);
      try {
        if (!patientProfile) {
          await fetchUserProfile();
        }
      } finally {
        setLoading(false);
      }
    };
    initForm();
  }, []);

  useEffect(() => {
    if (patientProfile) {
      setFormData({
        height: patientProfile.height?.toString() || '',
        weight: patientProfile.weight?.toString() || '',
        bloodType: patientProfile.bloodType || '',
        allergies: patientProfile.allergies || '',
        chronicDisease: patientProfile.chronicDisease || '',
        healthInsuranceNumber: patientProfile.healthInsuranceNumber || '',
        emergencyContact: patientProfile.emergencyContact || '',
      });
    }
  }, [patientProfile]);

  const handleChange = (key: keyof MedicalFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data: UpdatePatientData = {
        height: formData.height ? parseFloat(formData.height) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        bloodType: formData.bloodType || undefined,
        allergies: formData.allergies || undefined,
        chronicDisease: formData.chronicDisease || undefined,
        healthInsuranceNumber: formData.healthInsuranceNumber || undefined,
        emergencyContact: formData.emergencyContact || undefined,
      };

      await updatePatientProfile(data);
      await fetchUserProfile();
      Alert.alert('Success', 'Medical information updated successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || 'Failed to update medical information';
      Alert.alert('Error', message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.white,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary[500]} />
      </View>
    );
  }

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
            Medical Information
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: Colors.text.tertiary,
              marginTop: 2,
            }}
          >
            Update your health details
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
              marginBottom: 16,
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
                  backgroundColor: Colors.secondary[100],
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 14,
                }}
              >
                <Ionicons
                  name="fitness-outline"
                  size={22}
                  color={Colors.secondary[600]}
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
                  Body Measurements
                </Text>
                <Text style={{ fontSize: 13, color: Colors.text.tertiary }}>
                  Height, weight & blood type
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Height (cm)"
                  placeholder="170"
                  leftIcon="resize-outline"
                  value={formData.height}
                  onChangeText={(value) => handleChange('height', value)}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="Weight (kg)"
                  placeholder="65"
                  leftIcon="barbell-outline"
                  value={formData.weight}
                  onChangeText={(value) => handleChange('weight', value)}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <Select
              label="Blood Type"
              placeholder="Select blood type"
              value={formData.bloodType}
              options={BLOOD_TYPE_OPTIONS}
              onChange={(value) => handleChange('bloodType', value)}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(400).delay(200)}
            style={{
              backgroundColor: Colors.white,
              borderRadius: 20,
              padding: 20,
              marginBottom: 16,
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
                  backgroundColor: '#FEF3C7',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 14,
                }}
              >
                <Ionicons
                  name="warning-outline"
                  size={22}
                  color="#D97706"
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
                  Medical History
                </Text>
                <Text style={{ fontSize: 13, color: Colors.text.tertiary }}>
                  Allergies & conditions
                </Text>
              </View>
            </View>

            <Input
              label="Allergies"
              placeholder="e.g., Penicillin, Peanuts"
              leftIcon="alert-circle-outline"
              value={formData.allergies}
              onChangeText={(value) => handleChange('allergies', value)}
              multiline
            />

            <Input
              label="Chronic Diseases"
              placeholder="e.g., Diabetes, Hypertension"
              leftIcon="document-text-outline"
              value={formData.chronicDisease}
              onChangeText={(value) => handleChange('chronicDisease', value)}
              multiline
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(400).delay(300)}
            style={{
              backgroundColor: Colors.white,
              borderRadius: 20,
              padding: 20,
              marginBottom: 16,
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
                  name="shield-checkmark-outline"
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
                  Insurance & Emergency
                </Text>
                <Text style={{ fontSize: 13, color: Colors.text.tertiary }}>
                  Important contact details
                </Text>
              </View>
            </View>

            <Input
              label="Health Insurance Number"
              placeholder="Enter insurance number"
              leftIcon="card-outline"
              value={formData.healthInsuranceNumber}
              onChangeText={(value) => handleChange('healthInsuranceNumber', value)}
            />

            <Input
              label="Emergency Contact Phone"
              placeholder="Enter emergency phone"
              leftIcon="call-outline"
              value={formData.emergencyContact}
              onChangeText={(value) => handleChange('emergencyContact', value)}
              keyboardType="phone-pad"
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(400)}>
            <Button onPress={handleSave} loading={saving} size="lg">
              Save Changes
            </Button>
          </Animated.View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
