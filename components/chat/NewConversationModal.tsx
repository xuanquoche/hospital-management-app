import { Colors, Shadows } from '@/constants/colors';
import { createConversation } from '@/services/conversation';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface NewConversationModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (conversationId: string) => void;
}

const QUICK_TOPICS = [
  { icon: 'calendar', label: 'Appointment Help', subject: 'Help with appointments' },
  { icon: 'medical', label: 'Medical Question', subject: 'Medical question' },
  { icon: 'receipt', label: 'Billing & Payment', subject: 'Billing inquiry' },
  { icon: 'document-text', label: 'Records Request', subject: 'Medical records request' },
];

export const NewConversationModal: React.FC<NewConversationModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const insets = useSafeAreaInsets();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleQuickTopic = (topic: typeof QUICK_TOPICS[0]) => {
    setSubject(topic.subject);
  };

  const handleCreate = async () => {
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const conversation = await createConversation({
        subject: subject.trim() || 'Support Request',
        initialMessage: message.trim(),
      });
      setSubject('');
      setMessage('');
      onSuccess(conversation.id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create conversation');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSubject('');
    setMessage('');
    setError('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {visible && (
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'flex-end',
            }}
          >
            <Pressable style={{ flex: 1 }} onPress={handleClose} />
            
            <Animated.View
              entering={SlideInDown.duration(300).springify()}
              exiting={SlideOutDown.duration(200)}
              style={{
                backgroundColor: Colors.white,
                borderTopLeftRadius: 28,
                borderTopRightRadius: 28,
                paddingBottom: insets.bottom + 16,
                maxHeight: '90%',
              }}
            >
              <View
                style={{
                  alignItems: 'center',
                  paddingTop: 12,
                  paddingBottom: 8,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 4,
                    backgroundColor: Colors.neutral[300],
                    borderRadius: 2,
                  }}
                />
              </View>

              <View style={{ paddingHorizontal: 24 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: '700',
                      color: Colors.text.primary,
                    }}
                  >
                    New Conversation
                  </Text>
                  <Pressable
                    onPress={handleClose}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 12,
                      backgroundColor: Colors.neutral[100],
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="close" size={20} color={Colors.neutral[500]} />
                  </Pressable>
                </View>

                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: Colors.text.secondary,
                    marginBottom: 12,
                  }}
                >
                  Quick Topics
                </Text>
                
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 10,
                    marginBottom: 20,
                  }}
                >
                  {QUICK_TOPICS.map((topic) => (
                    <Pressable
                      key={topic.label}
                      onPress={() => handleQuickTopic(topic)}
                      style={({ pressed }) => ({
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 14,
                        paddingVertical: 10,
                        borderRadius: 12,
                        backgroundColor: subject === topic.subject
                          ? Colors.primary[100]
                          : Colors.neutral[100],
                        borderWidth: 1.5,
                        borderColor: subject === topic.subject
                          ? Colors.primary[500]
                          : Colors.transparent,
                        opacity: pressed ? 0.7 : 1,
                      })}
                    >
                      <Ionicons
                        name={topic.icon as any}
                        size={16}
                        color={
                          subject === topic.subject
                            ? Colors.primary[600]
                            : Colors.neutral[500]
                        }
                      />
                      <Text
                        style={{
                          marginLeft: 6,
                          fontSize: 13,
                          fontWeight: '600',
                          color: subject === topic.subject
                            ? Colors.primary[700]
                            : Colors.text.secondary,
                        }}
                      >
                        {topic.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: Colors.text.secondary,
                    marginBottom: 8,
                  }}
                >
                  Subject (Optional)
                </Text>
                <TextInput
                  value={subject}
                  onChangeText={setSubject}
                  placeholder="What do you need help with?"
                  placeholderTextColor={Colors.neutral[400]}
                  style={{
                    backgroundColor: Colors.neutral[50],
                    borderRadius: 14,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    fontSize: 15,
                    color: Colors.text.primary,
                    borderWidth: 1,
                    borderColor: Colors.border.light,
                    marginBottom: 16,
                  }}
                />

                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: Colors.text.secondary,
                    marginBottom: 8,
                  }}
                >
                  Your Message
                </Text>
                <TextInput
                  value={message}
                  onChangeText={(text) => {
                    setMessage(text);
                    if (error) setError('');
                  }}
                  placeholder="Describe your issue or question..."
                  placeholderTextColor={Colors.neutral[400]}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  style={{
                    backgroundColor: Colors.neutral[50],
                    borderRadius: 14,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    fontSize: 15,
                    color: Colors.text.primary,
                    borderWidth: 1,
                    borderColor: error ? Colors.error : Colors.border.light,
                    height: 120,
                    marginBottom: 8,
                  }}
                />
                
                {error ? (
                  <Text
                    style={{
                      fontSize: 13,
                      color: Colors.error,
                      marginBottom: 16,
                    }}
                  >
                    {error}
                  </Text>
                ) : (
                  <View style={{ height: 24 }} />
                )}

                <Pressable
                  onPress={handleCreate}
                  disabled={loading}
                  style={({ pressed }) => ({
                    opacity: pressed || loading ? 0.8 : 1,
                  })}
                >
                  <LinearGradient
                    colors={[Colors.primary[500], Colors.primary[600]]}
                    style={{
                      borderRadius: 14,
                      paddingVertical: 16,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      ...Shadows.md,
                    }}
                  >
                    {loading ? (
                      <ActivityIndicator color={Colors.white} />
                    ) : (
                      <>
                        <Ionicons
                          name="send"
                          size={18}
                          color={Colors.white}
                          style={{ marginRight: 8 }}
                        />
                        <Text
                          style={{
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: '600',
                          }}
                        >
                          Start Conversation
                        </Text>
                      </>
                    )}
                  </LinearGradient>
                </Pressable>
              </View>
            </Animated.View>
          </Animated.View>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
};

