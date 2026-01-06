import { DoctorCard, SpecialtyCard, TimeSlotPicker } from '@/components/booking';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants/colors';
import { formatConsultationFee, formatDoctorName, getAvailableSlots } from '@/services/doctor';
import { getDoctorsBySpecialty, getSpecialties } from '@/services/specialty';
import { BookingStep, useBookingStore } from '@/store/bookingStore';
import { AvailableSlot, Doctor, ExaminationType, PaymentMethod } from '@/types/doctor';
import { AIDoctorRecommendation } from '@/types/ai';
import { Specialty } from '@/types/specialty';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
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
import Animated, { FadeInDown, FadeInRight, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const STEPS: { key: BookingStep; label: string; icon: string }[] = [
  { key: 'symptoms', label: 'Symptoms', icon: 'medical' },
  { key: 'doctor', label: 'Doctor', icon: 'person' },
  { key: 'schedule', label: 'Schedule', icon: 'calendar' },
  { key: 'confirm', label: 'Confirm', icon: 'checkmark-circle' },
];

const StepIndicator = ({
  currentStep,
  onStepPress,
}: {
  currentStep: BookingStep;
  onStepPress: (step: BookingStep) => void;
}) => {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border.light,
      }}
    >
      {STEPS.map((step, index) => {
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;
        const canPress = index <= currentIndex;

        return (
          <Pressable
            key={step.key}
            onPress={() => canPress && onStepPress(step.key)}
            style={{
              flex: 1,
              alignItems: 'center',
              opacity: canPress ? 1 : 0.4,
            }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: isActive
                  ? Colors.primary[500]
                  : isCompleted
                  ? Colors.secondary[500]
                  : Colors.neutral[200],
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 6,
              }}
            >
              {isCompleted ? (
                <Ionicons name="checkmark" size={20} color={Colors.white} />
              ) : (
                <Ionicons
                  name={step.icon as any}
                  size={18}
                  color={isActive ? Colors.white : Colors.neutral[500]}
                />
              )}
            </View>
            <Text
              style={{
                fontSize: 11,
                fontWeight: isActive ? '600' : '400',
                color: isActive ? Colors.primary[600] : Colors.text.tertiary,
              }}
            >
              {step.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const AIRecommendationCard = ({
  recommendation,
  onPress,
  selected,
}: {
  recommendation: AIDoctorRecommendation;
  onPress: () => void;
  selected: boolean;
}) => {
  const { doctor, matchScore, matchReasons, availableSlots } = recommendation;

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        entering={FadeInDown.duration(400).delay(recommendation.rank * 100)}
        style={{
          backgroundColor: Colors.white,
          borderRadius: 20,
          padding: 20,
          marginBottom: 16,
          borderWidth: 2,
          borderColor: selected ? Colors.primary[500] : Colors.border.light,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          <View
            style={{
              backgroundColor: Colors.accent[100],
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Ionicons name="star" size={14} color={Colors.accent[600]} />
            <Text style={{ marginLeft: 4, fontWeight: '700', color: Colors.accent[700], fontSize: 13 }}>
              {matchScore}% Match
            </Text>
          </View>
          <View
            style={{
              backgroundColor: Colors.primary[100],
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 12,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.primary[700] }}>
              #{recommendation.rank}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 12 }}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              backgroundColor: Colors.primary[100],
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 14,
            }}
          >
            {doctor.avatar ? (
              <Animated.Image
                source={{ uri: doctor.avatar }}
                style={{ width: 56, height: 56, borderRadius: 16 }}
              />
            ) : (
              <Ionicons name="person" size={28} color={Colors.primary[600]} />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.text.primary }}>
              {doctor.professionalTitle} {doctor.fullName}
            </Text>
            <Text style={{ fontSize: 13, color: Colors.text.secondary, marginTop: 2 }}>
              {doctor.specialty}
              {doctor.subSpecialty && ` • ${doctor.subSpecialty}`}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Ionicons name="briefcase-outline" size={14} color={Colors.text.tertiary} />
              <Text style={{ fontSize: 12, color: Colors.text.tertiary, marginLeft: 4 }}>
                {doctor.yearsOfExperience} years experience
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            backgroundColor: Colors.background.secondary,
            borderRadius: 12,
            padding: 12,
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.text.secondary, marginBottom: 6 }}>
            Why recommended:
          </Text>
          {matchReasons.slice(0, 3).map((reason, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
              <Ionicons name="checkmark-circle" size={14} color={Colors.secondary[500]} style={{ marginTop: 2 }} />
              <Text style={{ fontSize: 13, color: Colors.text.primary, marginLeft: 6, flex: 1 }}>
                {reason}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: Colors.primary[600] }}>
            {formatConsultationFee(doctor.consultationFee)}
          </Text>
          {availableSlots.length > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="calendar-outline" size={14} color={Colors.secondary[600]} />
              <Text style={{ fontSize: 12, color: Colors.secondary[600], marginLeft: 4 }}>
                {availableSlots.length} slots available
              </Text>
            </View>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
};

const StepSymptoms = () => {
  const {
    symptoms,
    setSymptoms,
    examinationType,
    setExaminationType,
    fetchAIRecommendations,
    isLoadingAI,
    aiFollowUpQuestion,
    aiSuggestedQuestions,
    error,
    setMode,
    setStep,
  } = useBookingStore();

  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);

  const handleGetRecommendations = async () => {
    if (symptoms.length < 10) {
      Alert.alert('Error', 'Please describe your symptoms (at least 10 characters)');
      return;
    }
    await fetchAIRecommendations();
  };

  const handleSuggestedQuestion = (question: string) => {
    setSelectedSuggestions((prev) => {
      const isSelected = prev.includes(question);
      let newSelected: string[];
      
      if (isSelected) {
        newSelected = prev.filter((q) => q !== question);
      } else {
        newSelected = [...prev, question];
      }
      
      const baseSymptoms = symptoms
        .split('\n')
        .filter((line) => !aiSuggestedQuestions.includes(line.trim()))
        .join('\n')
        .trim();
      
      const newSymptoms = newSelected.length > 0
        ? baseSymptoms
          ? `${baseSymptoms}\n${newSelected.join('\n')}`
          : newSelected.join('\n')
        : baseSymptoms;
      
      setSymptoms(newSymptoms);
      return newSelected;
    });
  };

  const handleSkipAI = () => {
    setMode('manual');
    setStep('doctor');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInDown.duration(400)}>
          <View
            style={{
              backgroundColor: Colors.accent[50],
              borderRadius: 16,
              padding: 16,
              marginBottom: 20,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: Colors.accent[100],
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Ionicons name="sparkles" size={24} color={Colors.accent[600]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.accent[800] }}>
                AI-Powered Recommendations
              </Text>
              <Text style={{ fontSize: 13, color: Colors.accent[700], marginTop: 2 }}>
                Describe your symptoms and we&apos;ll find the best doctor for you
              </Text>
            </View>
          </View>

          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: Colors.text.primary,
              marginBottom: 6,
            }}
          >
            Describe Your Symptoms
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: Colors.text.secondary,
              marginBottom: 20,
            }}
          >
            The more details you provide, the better recommendations you&apos;ll get
          </Text>

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
            }}
          >
            <View style={{ marginBottom: 20 }}>
              <Input
                placeholder="E.g., I've been having headaches for 3 days, with dizziness and nausea..."
                value={symptoms}
                onChangeText={setSymptoms}
                multiline
                style={{ minHeight: 140, textAlignVertical: 'top' }}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: symptoms.length < 10 ? Colors.error : Colors.text.tertiary,
                  marginTop: 8,
                }}
              >
                {symptoms.length}/10 characters minimum
              </Text>
            </View>

            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: Colors.text.secondary,
                marginBottom: 12,
              }}
            >
              Preferred Consultation Type
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {(['IN_PERSON', 'ONLINE'] as ExaminationType[]).map((type) => {
                const isSelected = examinationType === type;
                return (
                  <Pressable
                    key={type}
                    onPress={() => setExaminationType(type)}
                    style={{
                      flex: 1,
                      paddingVertical: 14,
                      borderRadius: 14,
                      borderWidth: 2,
                      borderColor: isSelected ? Colors.primary[500] : Colors.border.light,
                      backgroundColor: isSelected ? Colors.primary[50] : Colors.white,
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons
                      name={type === 'IN_PERSON' ? 'business-outline' : 'videocam-outline'}
                      size={18}
                      color={isSelected ? Colors.primary[600] : Colors.text.tertiary}
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: isSelected ? Colors.primary[600] : Colors.text.primary,
                      }}
                    >
                      {type === 'IN_PERSON' ? 'In-Person' : 'Online'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {aiFollowUpQuestion && (
            <Animated.View
              entering={FadeInUp.duration(300)}
              style={{
                backgroundColor: Colors.primary[50],
                borderRadius: 16,
                padding: 16,
                marginTop: 20,
                borderWidth: 1,
                borderColor: Colors.primary[200],
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Ionicons name="help-circle" size={20} color={Colors.primary[600]} />
                <Text style={{ marginLeft: 8, fontSize: 14, fontWeight: '600', color: Colors.primary[700] }}>
                  Additional Information Needed
                </Text>
              </View>
              <Text style={{ fontSize: 14, color: Colors.text.primary, marginBottom: 12 }}>
                {aiFollowUpQuestion}
              </Text>
              {aiSuggestedQuestions.length > 0 && (
                <View style={{ gap: 10 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.primary[700], marginBottom: 4 }}>
                    Select symptoms that apply:
                  </Text>
                  {aiSuggestedQuestions.map((question, index) => {
                    const isSelected = selectedSuggestions.includes(question);
                    return (
                      <Pressable
                        key={index}
                        onPress={() => handleSuggestedQuestion(question)}
                        style={{
                          backgroundColor: isSelected ? Colors.primary[100] : Colors.white,
                          borderRadius: 12,
                          paddingHorizontal: 14,
                          paddingVertical: 12,
                          borderWidth: 2,
                          borderColor: isSelected ? Colors.primary[500] : Colors.primary[200],
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <View
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: 6,
                            borderWidth: 2,
                            borderColor: isSelected ? Colors.primary[500] : Colors.neutral[300],
                            backgroundColor: isSelected ? Colors.primary[500] : Colors.white,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 12,
                          }}
                        >
                          {isSelected && (
                            <Ionicons name="checkmark" size={14} color={Colors.white} />
                          )}
                        </View>
                        <Text
                          style={{
                            fontSize: 14,
                            color: isSelected ? Colors.primary[700] : Colors.text.primary,
                            fontWeight: isSelected ? '600' : '400',
                            flex: 1,
                          }}
                        >
                          {question}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </Animated.View>
          )}

          {error && (
            <View
              style={{
                backgroundColor: Colors.error + '10',
                borderRadius: 12,
                padding: 14,
                marginTop: 16,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons name="alert-circle" size={20} color={Colors.error} />
              <Text style={{ marginLeft: 8, fontSize: 13, color: Colors.error, flex: 1 }}>
                {error}
              </Text>
            </View>
          )}

          <Pressable
            onPress={handleSkipAI}
            style={{
              marginTop: 20,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 14, color: Colors.text.tertiary }}>
              Or{' '}
              <Text style={{ color: Colors.primary[600], fontWeight: '600' }}>
                browse doctors manually
              </Text>
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>

      <View
        style={{
          padding: 20,
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.border.light,
        }}
      >
        <Button
          onPress={handleGetRecommendations}
          size="lg"
          disabled={symptoms.length < 10}
          loading={isLoadingAI}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="sparkles" size={20} color={Colors.white} style={{ marginRight: 8 }} />
            <Text style={{ color: Colors.white, fontWeight: '600', fontSize: 16 }}>
              Get AI Recommendations
            </Text>
          </View>
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const StepDoctorSelection = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  const {
    mode,
    selectedDoctor,
    setDoctor,
    setDoctorFromAI,
    setStep,
    aiRecommendations,
    aiAnalysis,
    setMode,
  } = useBookingStore();

  useEffect(() => {
    if (mode === 'manual') {
      loadSpecialties();
    } else {
      setLoading(false);
    }
  }, [mode]);

  const loadSpecialties = async () => {
    setLoading(true);
    const data = await getSpecialties();
    setSpecialties(data);
    setLoading(false);
  };

  const loadDoctors = async (specialty: Specialty) => {
    setLoadingDoctors(true);
    setSelectedSpecialty(specialty);
    const { data } = await getDoctorsBySpecialty(specialty.id);
    setDoctors(data);
    setLoadingDoctors(false);
  };

  const handleSelectDoctor = (doctor: Doctor) => {
    setDoctor(doctor);
  };

  const handleSelectAIDoctor = (recommendation: AIDoctorRecommendation) => {
    setDoctorFromAI(recommendation);
  };

  const handleContinue = () => {
    if (selectedDoctor) {
      setStep('schedule');
    }
  };

  const handleBackToSymptoms = () => {
    setStep('symptoms');
  };

  if (loading && mode === 'manual') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary[500]} />
      </View>
    );
  }

  if (mode === 'ai' && aiRecommendations && aiRecommendations.length > 0) {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(400)}>
            <Pressable
              onPress={handleBackToSymptoms}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <Ionicons name="arrow-back" size={20} color={Colors.primary[600]} />
              <Text
                style={{
                  marginLeft: 8,
                  fontSize: 14,
                  fontWeight: '600',
                  color: Colors.primary[600],
                }}
              >
                Edit Symptoms
              </Text>
            </Pressable>

            {aiAnalysis && (
              <View
                style={{
                  backgroundColor: Colors.secondary[50],
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 20,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Ionicons name="analytics" size={20} color={Colors.secondary[600]} />
                  <Text
                    style={{
                      marginLeft: 8,
                      fontSize: 15,
                      fontWeight: '700',
                      color: Colors.secondary[700],
                    }}
                  >
                    Analysis Results
                  </Text>
                </View>
                {aiAnalysis.possibleConditions.length > 0 && (
                  <View style={{ marginBottom: 8 }}>
                    <Text style={{ fontSize: 12, color: Colors.text.secondary, marginBottom: 4 }}>
                      Possible conditions:
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.text.primary }}>
                      {aiAnalysis.possibleConditions.join(', ')}
                    </Text>
                  </View>
                )}
                {aiAnalysis.recommendedSpecialties.length > 0 && (
                  <View>
                    <Text style={{ fontSize: 12, color: Colors.text.secondary, marginBottom: 4 }}>
                      Recommended specialties:
                    </Text>
                    <Text style={{ fontSize: 14, color: Colors.text.primary }}>
                      {aiAnalysis.recommendedSpecialties.join(', ')}
                    </Text>
                  </View>
                )}
                <View
                  style={{
                    marginTop: 10,
                    paddingTop: 10,
                    borderTopWidth: 1,
                    borderTopColor: Colors.secondary[200],
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 12, color: Colors.text.secondary }}>Urgency: </Text>
                  <View
                    style={{
                      backgroundColor:
                        aiAnalysis.urgencyLevel === 'HIGH' || aiAnalysis.urgencyLevel === 'EMERGENCY'
                          ? Colors.error + '20'
                          : aiAnalysis.urgencyLevel === 'MODERATE'
                          ? Colors.accent[100]
                          : Colors.secondary[100],
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color:
                          aiAnalysis.urgencyLevel === 'HIGH' || aiAnalysis.urgencyLevel === 'EMERGENCY'
                            ? Colors.error
                            : aiAnalysis.urgencyLevel === 'MODERATE'
                            ? Colors.accent[700]
                            : Colors.secondary[700],
                      }}
                    >
                      {aiAnalysis.urgencyLevel}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: Colors.text.primary,
                marginBottom: 6,
              }}
            >
              Recommended Doctors
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: Colors.text.secondary,
                marginBottom: 20,
              }}
            >
              {aiRecommendations.length} doctors matched your symptoms
            </Text>

            {aiRecommendations.map((recommendation) => (
              <AIRecommendationCard
                key={recommendation.doctor.id}
                recommendation={recommendation}
                onPress={() => handleSelectAIDoctor(recommendation)}
                selected={selectedDoctor?.id === recommendation.doctor.id}
              />
            ))}

            <Pressable
              onPress={() => setMode('manual')}
              style={{
                marginTop: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 14, color: Colors.text.tertiary }}>
                Not what you&apos;re looking for?{' '}
                <Text style={{ color: Colors.primary[600], fontWeight: '600' }}>
                  Browse all doctors
                </Text>
              </Text>
            </Pressable>
          </Animated.View>
        </ScrollView>

        {selectedDoctor && (
          <View
            style={{
              padding: 20,
              backgroundColor: Colors.white,
              borderTopWidth: 1,
              borderTopColor: Colors.border.light,
            }}
          >
            <Button onPress={handleContinue} size="lg">
              Continue with {formatDoctorName(selectedDoctor)}
            </Button>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {!selectedSpecialty ? (
          <Animated.View entering={FadeInDown.duration(400)}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: Colors.text.primary,
                marginBottom: 6,
              }}
            >
              Select a Specialty
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: Colors.text.secondary,
                marginBottom: 20,
              }}
            >
              Choose the medical specialty you need
            </Text>

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginHorizontal: -6,
              }}
            >
              {specialties.map((specialty, index) => (
                <View key={specialty.id} style={{ width: '50%', paddingHorizontal: 6 }}>
                  <SpecialtyCard
                    specialty={specialty}
                    index={index}
                    onPress={() => loadDoctors(specialty)}
                  />
                </View>
              ))}
            </View>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInRight.duration(400)}>
            <Pressable
              onPress={() => {
                setSelectedSpecialty(null);
                setDoctors([]);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <Ionicons name="arrow-back" size={20} color={Colors.primary[600]} />
              <Text
                style={{
                  marginLeft: 8,
                  fontSize: 14,
                  fontWeight: '600',
                  color: Colors.primary[600],
                }}
              >
                All Specialties
              </Text>
            </Pressable>

            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: Colors.text.primary,
                marginBottom: 6,
              }}
            >
              {selectedSpecialty.name}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: Colors.text.secondary,
                marginBottom: 20,
              }}
            >
              Select a doctor to book an appointment
            </Text>

            {loadingDoctors ? (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Colors.primary[500]} />
              </View>
            ) : doctors.length === 0 ? (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <Ionicons name="person-outline" size={48} color={Colors.neutral[400]} />
                <Text
                  style={{
                    marginTop: 16,
                    fontSize: 16,
                    fontWeight: '600',
                    color: Colors.text.primary,
                  }}
                >
                  No doctors available
                </Text>
                <Text
                  style={{
                    marginTop: 4,
                    fontSize: 14,
                    color: Colors.text.tertiary,
                    textAlign: 'center',
                  }}
                >
                  Please try another specialty
                </Text>
              </View>
            ) : (
              doctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  onPress={() => handleSelectDoctor(doctor)}
                  selected={selectedDoctor?.id === doctor.id}
                />
              ))
            )}
          </Animated.View>
        )}
      </ScrollView>

      {selectedDoctor && (
        <View
          style={{
            padding: 20,
            backgroundColor: Colors.white,
            borderTopWidth: 1,
            borderTopColor: Colors.border.light,
          }}
        >
          <Button onPress={handleContinue} size="lg">
            Continue with {formatDoctorName(selectedDoctor)}
          </Button>
        </View>
      )}
    </View>
  );
};

const StepScheduleSelection = () => {
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    selectedDoctor,
    selectedDate,
    selectedSlot,
    setDate,
    setSlot,
    setStep,
    examinationType,
    setExaminationType,
  } = useBookingStore();

  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date;
  });

  const loadSlots = useCallback(async (date: Date) => {
    if (!selectedDoctor) return;
    setLoading(true);
    const dateStr = date.toISOString().split('T')[0];
    setDate(dateStr);
    const data = await getAvailableSlots(selectedDoctor.id, dateStr);
    setSlots(data);
    setLoading(false);
  }, [selectedDoctor, setDate]);

  useEffect(() => {
    if (dates[selectedDateIndex]) {
      loadSlots(dates[selectedDateIndex]);
    }
  }, [selectedDateIndex, loadSlots]);

  const handleContinue = () => {
    if (selectedSlot && selectedDate) {
      setStep('confirm');
    }
  };

  const formatDate = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()],
    };
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(400)}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: Colors.text.primary,
              marginBottom: 6,
            }}
          >
            Select Date & Time
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: Colors.text.secondary,
              marginBottom: 20,
            }}
          >
            Choose your preferred appointment slot
          </Text>

          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: Colors.text.secondary,
              marginBottom: 12,
            }}
          >
            Select Date
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 24 }}
            contentContainerStyle={{ gap: 10 }}
          >
            {dates.map((date, index) => {
              const { day, date: dateNum, month } = formatDate(date);
              const isSelected = index === selectedDateIndex;

              return (
                <Pressable
                  key={index}
                  onPress={() => setSelectedDateIndex(index)}
                  style={{
                    width: 70,
                    paddingVertical: 14,
                    borderRadius: 14,
                    borderWidth: 2,
                    borderColor: isSelected ? Colors.primary[500] : Colors.border.light,
                    backgroundColor: isSelected ? Colors.primary[50] : Colors.white,
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: isSelected ? Colors.primary[600] : Colors.text.tertiary,
                    }}
                  >
                    {day}
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: '700',
                      color: isSelected ? Colors.primary[600] : Colors.text.primary,
                      marginVertical: 4,
                    }}
                  >
                    {dateNum}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: isSelected ? Colors.primary[600] : Colors.text.tertiary,
                    }}
                  >
                    {month}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: Colors.text.secondary,
              marginBottom: 12,
            }}
          >
            Available Time Slots
          </Text>
          <TimeSlotPicker
            slots={slots}
            selectedSlot={selectedSlot}
            onSelectSlot={setSlot}
            loading={loading}
          />

          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: Colors.text.secondary,
              marginTop: 24,
              marginBottom: 12,
            }}
          >
            Examination Type
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {(['IN_PERSON', 'ONLINE'] as ExaminationType[]).map((type) => {
              const isSelected = examinationType === type;
              return (
                <Pressable
                  key={type}
                  onPress={() => setExaminationType(type)}
                  style={{
                    flex: 1,
                    paddingVertical: 16,
                    borderRadius: 14,
                    borderWidth: 2,
                    borderColor: isSelected ? Colors.primary[500] : Colors.border.light,
                    backgroundColor: isSelected ? Colors.primary[50] : Colors.white,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons
                    name={type === 'IN_PERSON' ? 'business-outline' : 'videocam-outline'}
                    size={20}
                    color={isSelected ? Colors.primary[600] : Colors.text.tertiary}
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: isSelected ? Colors.primary[600] : Colors.text.primary,
                    }}
                  >
                    {type === 'IN_PERSON' ? 'In-Person' : 'Online'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>

      <View
        style={{
          padding: 20,
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.border.light,
        }}
      >
        <Button
          onPress={handleContinue}
          size="lg"
          disabled={!selectedSlot || !selectedDate}
        >
          Continue
        </Button>
      </View>
    </View>
  );
};

const StepConfirmation = () => {
  const router = useRouter();
  const {
    selectedDoctor,
    selectedDate,
    selectedSlot,
    examinationType,
    symptoms,
    notes,
    setNotes,
    paymentMethod,
    setPaymentMethod,
    submitBooking,
    isSubmitting,
    error,
    reset,
  } = useBookingStore();

  const handleSubmit = async () => {
    try {
      await submitBooking();
      Alert.alert(
        'Booking Successful!',
        'Your appointment has been booked successfully.',
        [
          {
            text: 'View Appointments',
            onPress: () => {
              reset();
              router.replace('/(tabs)/appointments');
            },
          },
        ]
      );
    } catch {
      Alert.alert('Error', error || 'Failed to create appointment');
    }
  };

  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInDown.duration(400)}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: Colors.text.primary,
              marginBottom: 6,
            }}
          >
            Confirm Booking
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: Colors.text.secondary,
              marginBottom: 20,
            }}
          >
            Review your appointment details
          </Text>

          <View
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
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 16,
                  backgroundColor: Colors.primary[100],
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 14,
                }}
              >
                <Ionicons name="person" size={24} color={Colors.primary[600]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: Colors.text.primary,
                  }}
                >
                  {selectedDoctor ? formatDoctorName(selectedDoctor) : ''}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: Colors.text.secondary,
                  }}
                >
                  {selectedDoctor?.primarySpecialty?.name || 'General'}
                </Text>
              </View>
            </View>

            <View
              style={{
                backgroundColor: Colors.background.secondary,
                borderRadius: 14,
                padding: 16,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={Colors.primary[600]}
                  style={{ marginRight: 10 }}
                />
                <Text style={{ fontSize: 14, color: Colors.text.primary }}>
                  {selectedDate ? formatDateDisplay(selectedDate) : ''}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <Ionicons
                  name="time-outline"
                  size={18}
                  color={Colors.accent[600]}
                  style={{ marginRight: 10 }}
                />
                <Text style={{ fontSize: 14, color: Colors.text.primary }}>
                  {selectedSlot?.startTime} - {selectedSlot?.endTime}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                  name={
                    examinationType === 'IN_PERSON'
                      ? 'business-outline'
                      : 'videocam-outline'
                  }
                  size={18}
                  color={Colors.secondary[600]}
                  style={{ marginRight: 10 }}
                />
                <Text style={{ fontSize: 14, color: Colors.text.primary }}>
                  {examinationType === 'IN_PERSON' ? 'In-Person Visit' : 'Online Consultation'}
                </Text>
              </View>
            </View>
          </View>

          <View
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
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: Colors.text.secondary,
                marginBottom: 12,
              }}
            >
              SYMPTOMS
            </Text>
            <Text style={{ fontSize: 14, color: Colors.text.primary, lineHeight: 20 }}>
              {symptoms}
            </Text>

            <View style={{ marginTop: 16 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: Colors.text.secondary,
                  marginBottom: 8,
                }}
              >
                ADDITIONAL NOTES (Optional)
              </Text>
              <Input
                placeholder="Any additional information..."
                value={notes}
                onChangeText={setNotes}
                multiline
                style={{ minHeight: 60, textAlignVertical: 'top' }}
              />
            </View>
          </View>

          <View
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
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: Colors.text.secondary,
                marginBottom: 12,
              }}
            >
              PAYMENT SUMMARY
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 14, color: Colors.text.secondary }}>
                Consultation Fee
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: Colors.text.primary,
                }}
              >
                {formatConsultationFee(selectedDoctor?.consultationFee)}
              </Text>
            </View>
            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: Colors.border.light,
                paddingTop: 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: Colors.text.primary,
                }}
              >
                Total
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: Colors.primary[600],
                }}
              >
                {formatConsultationFee(selectedDoctor?.consultationFee)}
              </Text>
            </View>
          </View>

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
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: Colors.text.secondary,
                marginBottom: 12,
              }}
            >
              PAYMENT METHOD
            </Text>
            {(['CASH', 'BANK_TRANSFER'] as PaymentMethod[]).map((method) => {
              const isSelected = paymentMethod === method;
              return (
                <Pressable
                  key={method}
                  onPress={() => setPaymentMethod(method)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 14,
                    borderBottomWidth: method !== 'BANK_TRANSFER' ? 1 : 0,
                    borderBottomColor: Colors.border.light,
                  }}
                >
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: isSelected ? Colors.primary[500] : Colors.neutral[300],
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 14,
                    }}
                  >
                    {isSelected && (
                      <View
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 6,
                          backgroundColor: Colors.primary[500],
                        }}
                      />
                    )}
                  </View>
                  <Ionicons
                    name={method === 'CASH' ? 'cash-outline' : 'card-outline'}
                    size={20}
                    color={Colors.text.primary}
                    style={{ marginRight: 12 }}
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      color: Colors.text.primary,
                      fontWeight: isSelected ? '600' : '400',
                    }}
                  >
                    {method === 'CASH' ? 'Cash at Counter' : 'Bank Transfer'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>

      <View
        style={{
          padding: 20,
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.border.light,
        }}
      >
        <Button onPress={handleSubmit} loading={isSubmitting} size="lg">
          Confirm Booking
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

export default function BookingScreen() {
  const insets = useSafeAreaInsets();
  const { currentStep, setStep, reset, mode } = useBookingStore();

  const renderStep = () => {
    switch (currentStep) {
      case 'symptoms':
        return <StepSymptoms />;
      case 'doctor':
        return <StepDoctorSelection />;
      case 'schedule':
        return <StepScheduleSelection />;
      case 'confirm':
        return <StepConfirmation />;
      default:
        return <StepSymptoms />;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background.secondary }}>
      <LinearGradient
        colors={[Colors.primary[500], Colors.primary[600]]}
        style={{
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 16,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Pressable
            onPress={reset}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="close" size={22} color={Colors.white} />
          </Pressable>
          <View style={{ alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: Colors.white,
              }}
            >
              Book Appointment
            </Text>
            {mode === 'ai' && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                <Ionicons name="sparkles" size={12} color={Colors.white} style={{ opacity: 0.8 }} />
                <Text style={{ fontSize: 11, color: Colors.white, opacity: 0.8, marginLeft: 4 }}>
                  AI-Assisted
                </Text>
              </View>
            )}
          </View>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <StepIndicator currentStep={currentStep} onStepPress={setStep} />

      {renderStep()}
    </View>
  );
}
