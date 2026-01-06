import { Colors } from '@/constants/colors';
import { HealthMetrics } from '@/types/patient';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface HealthMetricsCardProps {
  metrics: HealthMetrics;
}

const getBMIStatusConfig = (status?: HealthMetrics['bmiStatus']) => {
  switch (status) {
    case 'underweight':
      return { label: 'Underweight', color: Colors.accent[500] };
    case 'normal':
      return { label: 'Normal', color: Colors.secondary[500] };
    case 'overweight':
      return { label: 'Overweight', color: Colors.accent[500] };
    case 'obese':
      return { label: 'Obese', color: Colors.error };
    default:
      return { label: 'Unknown', color: Colors.neutral[400] };
  }
};

interface MetricItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconBgColor: string;
  iconColor: string;
  label: string;
  value: string | number | undefined;
  unit?: string;
}

const MetricItem: React.FC<MetricItemProps> = ({
  icon,
  iconBgColor,
  iconColor,
  label,
  value,
  unit,
}) => (
  <View style={{ flex: 1, alignItems: 'center' }}>
    <View
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: iconBgColor,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
      }}
    >
      <Ionicons name={icon} size={22} color={iconColor} />
    </View>
    <Text
      style={{
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text.primary,
      }}
    >
      {value ?? '--'}
      {unit && (
        <Text style={{ fontSize: 12, fontWeight: '400', color: Colors.text.tertiary }}>
          {unit}
        </Text>
      )}
    </Text>
    <Text style={{ fontSize: 12, color: Colors.text.tertiary, marginTop: 2 }}>
      {label}
    </Text>
  </View>
);

export const HealthMetricsCard: React.FC<HealthMetricsCardProps> = ({
  metrics,
}) => {
  const bmiConfig = getBMIStatusConfig(metrics.bmiStatus);

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
          marginBottom: 20,
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: Colors.secondary[100],
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          <Ionicons name="fitness-outline" size={22} color={Colors.secondary[600]} />
        </View>
        <View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: Colors.text.primary,
            }}
          >
            Health Metrics
          </Text>
          <Text style={{ fontSize: 12, color: Colors.text.tertiary }}>
            Your body measurements
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <MetricItem
          icon="resize-outline"
          iconBgColor={Colors.primary[100]}
          iconColor={Colors.primary[600]}
          label="Height"
          value={metrics.height}
          unit=" cm"
        />
        <MetricItem
          icon="barbell-outline"
          iconBgColor={Colors.accent[100]}
          iconColor={Colors.accent[600]}
          label="Weight"
          value={metrics.weight}
          unit=" kg"
        />
        <MetricItem
          icon="water-outline"
          iconBgColor="#FEE2E2"
          iconColor={Colors.error}
          label="Blood"
          value={metrics.bloodType}
        />
      </View>

      {metrics.bmi && (
        <View
          style={{
            backgroundColor: Colors.background.secondary,
            borderRadius: 14,
            padding: 14,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons
              name="analytics-outline"
              size={20}
              color={Colors.text.secondary}
              style={{ marginRight: 8 }}
            />
            <Text style={{ fontSize: 14, color: Colors.text.secondary }}>
              BMI Index
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: Colors.text.primary,
                marginRight: 8,
              }}
            >
              {metrics.bmi}
            </Text>
            <View
              style={{
                backgroundColor: bmiConfig.color,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <Text
                style={{ color: Colors.white, fontSize: 12, fontWeight: '600' }}
              >
                {bmiConfig.label}
              </Text>
            </View>
          </View>
        </View>
      )}

      {metrics.allergies && (
        <View
          style={{
            marginTop: 12,
            backgroundColor: '#FEF3C7',
            borderRadius: 12,
            padding: 12,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Ionicons
            name="warning-outline"
            size={18}
            color="#D97706"
            style={{ marginRight: 8 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, color: '#92400E', fontWeight: '600' }}>
              Allergies
            </Text>
            <Text style={{ fontSize: 13, color: '#78350F' }}>
              {metrics.allergies}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

