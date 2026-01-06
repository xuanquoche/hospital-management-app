import StepDate from '@/components/booking/StepDate';
import StepDoctor from '@/components/booking/StepDoctor';
import StepInfo from '@/components/booking/StepInfo';
import { Colors } from '@/constants/colors';
import { useBookingStore } from '@/store/bookingStore';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const STEPS = [
  { number: 1, title: 'Doctor', icon: 'person' },
  { number: 2, title: 'Schedule', icon: 'calendar' },
  { number: 3, title: 'Confirm', icon: 'checkmark-circle' },
];

export default function BookingScreen() {
  const insets = useSafeAreaInsets();
  const { currentStep, setCurrentStep, resetBooking } = useBookingStore();

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepDoctor />;
      case 2:
        return <StepDate />;
      case 3:
        return <StepInfo />;
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background.secondary }}>
      <Animated.View
        entering={FadeInUp.duration(400)}
        style={{
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 20,
          backgroundColor: Colors.white,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border.light,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          {currentStep > 1 && (
            <Pressable
              onPress={handleBack}
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
              <Ionicons
                name="arrow-back"
                size={22}
                color={Colors.text.primary}
              />
            </Pressable>
          )}
          <View>
            <Text
              style={{
                fontSize: 22,
                fontWeight: '700',
                color: Colors.text.primary,
              }}
            >
              New Appointment
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: Colors.text.tertiary,
                marginTop: 2,
              }}
            >
              Step {currentStep} of 3
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {STEPS.map((step, index) => (
            <View
              key={step.number}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  backgroundColor:
                    currentStep >= step.number
                      ? Colors.primary[500]
                      : Colors.neutral[200],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {currentStep > step.number ? (
                  <Ionicons
                    name="checkmark"
                    size={18}
                    color={Colors.white}
                  />
                ) : (
                  <Ionicons
                    name={step.icon as any}
                    size={18}
                    color={
                      currentStep >= step.number
                        ? Colors.white
                        : Colors.neutral[400]
                    }
                  />
                )}
              </View>
              <Text
                style={{
                  marginLeft: 8,
                  fontSize: 13,
                  fontWeight: '600',
                  color:
                    currentStep >= step.number
                      ? Colors.text.primary
                      : Colors.text.tertiary,
                }}
              >
                {step.title}
              </Text>
              {index < STEPS.length - 1 && (
                <View
                  style={{
                    flex: 1,
                    height: 2,
                    backgroundColor:
                      currentStep > step.number
                        ? Colors.primary[500]
                        : Colors.neutral[200],
                    marginHorizontal: 8,
                    borderRadius: 1,
                  }}
                />
              )}
            </View>
          ))}
        </View>
      </Animated.View>

      <View style={{ flex: 1, padding: 20 }}>{renderStep()}</View>
    </View>
  );
}
