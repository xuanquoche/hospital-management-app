import { useAuthStore } from '@/store/authStore';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await login({ email, password });
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white justify-center px-6">
      <View className="items-center mb-10">
        <Text className="text-3xl font-bold text-blue-600">MediCare</Text>
        <Text className="text-gray-500 mt-2">Sign in to your account</Text>
      </View>

      <View className="space-y-4">
        <View>
          <Text className="text-gray-700 mb-1">Email</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        <View>
          <Text className="text-gray-700 mb-1">Password</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {error ? <Text className="text-red-500">{error}</Text> : null}

        <TouchableOpacity
          className="bg-blue-600 p-4 rounded-lg items-center"
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className="text-white font-bold text-lg">
            {loading ? 'Signing in...' : 'Sign In'}
          </Text>
        </TouchableOpacity>
        
        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-600">Don&apos;t have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
                <Text className="text-blue-600 font-bold">Register</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
