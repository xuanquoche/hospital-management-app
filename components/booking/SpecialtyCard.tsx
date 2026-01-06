import { Colors } from '@/constants/colors';
import { getSpecialtyColor, getSpecialtyIcon } from '@/constants/specialties';
import { Specialty } from '@/types/specialty';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface SpecialtyCardProps {
  specialty: Specialty;
  index: number;
  onPress: () => void;
}

export const SpecialtyCard: React.FC<SpecialtyCardProps> = ({
  specialty,
  index,
  onPress,
}) => {
  const colors = getSpecialtyColor(index);
  const icon = getSpecialtyIcon(specialty.name);

  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        marginBottom: 12,
      }}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          padding: 16,
          borderRadius: 16,
          alignItems: 'center',
          minHeight: 100,
        }}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
          }}
        >
          <Ionicons name={icon as any} size={24} color={Colors.white} />
        </View>
        <Text
          style={{
            color: Colors.white,
            fontSize: 13,
            fontWeight: '600',
            textAlign: 'center',
          }}
          numberOfLines={2}
        >
          {specialty.name}
        </Text>
      </LinearGradient>
    </Pressable>
  );
};

