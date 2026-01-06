import { Colors } from '@/constants/colors';
import { Consultation } from '@/types/patient';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface RecentHistoryCardProps {
  consultations: Consultation[];
  onViewAll?: () => void;
  onItemPress?: (consultation: Consultation) => void;
}

export const RecentHistoryCard: React.FC<RecentHistoryCardProps> = ({
  consultations,
  onViewAll,
  onItemPress,
}) => {
  if (consultations.length === 0) {
    return (
      <View
        style={{
          backgroundColor: Colors.white,
          borderRadius: 20,
          padding: 20,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
          borderWidth: 1,
          borderColor: Colors.border.light,
        }}
      >
        <Ionicons
          name="document-text-outline"
          size={48}
          color={Colors.neutral[300]}
        />
        <Text
          style={{
            marginTop: 12,
            fontSize: 14,
            color: Colors.text.tertiary,
          }}
        >
          No consultation history yet
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: Colors.border.light,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: Colors.primary[100],
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            <Ionicons
              name="document-text-outline"
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
              Recent History
            </Text>
            <Text style={{ fontSize: 12, color: Colors.text.tertiary }}>
              Past consultations
            </Text>
          </View>
        </View>
        {onViewAll && (
          <Pressable onPress={onViewAll}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: Colors.primary[600],
              }}
            >
              View All
            </Text>
          </Pressable>
        )}
      </View>

      {consultations.map((consultation, index) => (
        <Pressable
          key={consultation.id}
          onPress={() => onItemPress?.(consultation)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 14,
            borderBottomWidth: index < consultations.length - 1 ? 1 : 0,
            borderBottomColor: Colors.border.light,
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: Colors.background.secondary,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 14,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: Colors.primary[600],
              }}
            >
              {consultation.doctor.user.fullName.charAt(0)}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: Colors.text.primary,
                marginBottom: 2,
              }}
            >
              {consultation.doctor.user.fullName}
            </Text>
            <Text style={{ fontSize: 12, color: Colors.text.tertiary }}>
              {consultation.doctor.primarySpecialty.name}
            </Text>
            {consultation.diagnosis && (
              <Text
                style={{
                  fontSize: 12,
                  color: Colors.text.secondary,
                  marginTop: 4,
                }}
                numberOfLines={1}
              >
                {consultation.diagnosis}
              </Text>
            )}
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text
              style={{
                fontSize: 12,
                color: Colors.text.tertiary,
              }}
            >
              {format(new Date(consultation.createdAt), 'dd MMM')}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={Colors.neutral[400]}
              style={{ marginTop: 4 }}
            />
          </View>
        </Pressable>
      ))}
    </View>
  );
};

