import { useAuthStore } from '@/store/authStore';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const { register } = useAuthStore();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    setError('');
    try {
      await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
      });
      // Redirect to login after successful register or auto login?
      // For now redirect to login
      router.replace('/(auth)/login');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <View className="items-center mb-10 mt-10">
          <Text className="text-3xl font-bold text-blue-600">Register</Text>
          <Text className="text-gray-500 mt-2">Create a new account</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-700 mb-1">Full Name</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3"
              placeholder="John Doe"
              value={formData.fullName}
              onChangeText={(t) => handleChange('fullName', t)}
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-1">Email</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(t) => handleChange('email', t)}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-1">Password</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3"
              placeholder="Create a password"
              value={formData.password}
              onChangeText={(t) => handleChange('password', t)}
              secureTextEntry
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-1">Confirm Password</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChangeText={(t) => handleChange('confirmPassword', t)}
              secureTextEntry
            />
          </View>

          {error ? <Text className="text-red-500">{error}</Text> : null}

          <TouchableOpacity
            className="bg-blue-600 p-4 rounded-lg items-center mt-4"
            onPress={handleRegister}
            disabled={loading}
          >
            <Text className="text-white font-bold text-lg">
              {loading ? 'Creating Account...' : 'Register'}
            </Text>
          </TouchableOpacity>
          
          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-600">Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                  <Text className="text-blue-600 font-bold">Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
