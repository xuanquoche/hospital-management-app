import { Colors, Shadows } from '@/constants/colors';
import { useMessages } from '@/hooks/useConversations';
import { markAsRead } from '@/services/conversation';
import { useAuthStore } from '@/store/authStore';
import { Message } from '@/types/conversation';
import { Ionicons } from '@expo/vector-icons';
import { format, isToday, isYesterday } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
  showAvatar: boolean;
  isFirst: boolean;
  isLast: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isMe,
  showAvatar,
  isFirst,
  isLast,
}) => {
  const formatTime = () => {
    try {
      return format(new Date(message.createdAt), 'HH:mm');
    } catch {
      return '';
    }
  };

  const getBorderRadius = () => {
    const baseRadius = 20;
    if (isMe) {
      return {
        borderTopLeftRadius: baseRadius,
        borderTopRightRadius: isFirst ? baseRadius : 6,
        borderBottomLeftRadius: baseRadius,
        borderBottomRightRadius: isLast ? baseRadius : 6,
      };
    }
    return {
      borderTopLeftRadius: isFirst ? baseRadius : 6,
      borderTopRightRadius: baseRadius,
      borderBottomLeftRadius: isLast ? baseRadius : 6,
      borderBottomRightRadius: baseRadius,
    };
  };

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={{
        flexDirection: 'row',
        justifyContent: isMe ? 'flex-end' : 'flex-start',
        marginBottom: isLast ? 12 : 3,
        paddingHorizontal: 16,
      }}
    >
      {!isMe && (
        <View style={{ width: 32, marginRight: 8 }}>
          {showAvatar && (
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="headset" size={16} color={Colors.white} />
            </LinearGradient>
          )}
        </View>
      )}

      <View
        style={{
          maxWidth: '75%',
          minWidth: 60,
        }}
      >
        {isMe ? (
          <LinearGradient
            colors={[Colors.primary[500], Colors.primary[600]]}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              ...getBorderRadius(),
            }}
          >
            <Text
              style={{
                color: Colors.white,
                fontSize: 15,
                lineHeight: 21,
              }}
            >
              {message.content}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                marginTop: 4,
              }}
            >
              <Text
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: 11,
                  marginRight: 4,
                }}
              >
                {formatTime()}
              </Text>
              <Ionicons
                name={message.isRead ? 'checkmark-done' : 'checkmark'}
                size={14}
                color="rgba(255,255,255,0.7)"
              />
            </View>
          </LinearGradient>
        ) : (
          <View
            style={{
              backgroundColor: Colors.neutral[100],
              paddingHorizontal: 16,
              paddingVertical: 12,
              ...getBorderRadius(),
            }}
          >
            <Text
              style={{
                color: Colors.text.primary,
                fontSize: 15,
                lineHeight: 21,
              }}
            >
              {message.content}
            </Text>
            <Text
              style={{
                color: Colors.text.tertiary,
                fontSize: 11,
                marginTop: 4,
                textAlign: 'right',
              }}
            >
              {formatTime()}
            </Text>
          </View>
        )}
      </View>

      {isMe && <View style={{ width: 8 }} />}
    </Animated.View>
  );
};

interface DateSeparatorProps {
  date: Date;
}

const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => {
  const getDateLabel = () => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMMM d, yyyy');
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
      }}
    >
      <View
        style={{
          backgroundColor: Colors.neutral[200],
          paddingHorizontal: 14,
          paddingVertical: 6,
          borderRadius: 12,
        }}
      >
        <Text
          style={{
            color: Colors.text.tertiary,
            fontSize: 12,
            fontWeight: '600',
          }}
        >
          {getDateLabel()}
        </Text>
      </View>
    </View>
  );
};

const TypingIndicator: React.FC = () => {
  const opacity1 = useSharedValue(0.3);
  const opacity2 = useSharedValue(0.3);
  const opacity3 = useSharedValue(0.3);

  useEffect(() => {
    opacity1.value = withRepeat(
      withSequence(withTiming(1, { duration: 400 }), withTiming(0.3, { duration: 400 })),
      -1
    );
    opacity2.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 200 }),
        withTiming(1, { duration: 400 }),
        withTiming(0.3, { duration: 400 })
      ),
      -1
    );
    opacity3.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 400 }),
        withTiming(1, { duration: 400 }),
        withTiming(0.3, { duration: 400 })
      ),
      -1
    );
  }, []);

  const dot1Style = useAnimatedStyle(() => ({ opacity: opacity1.value }));
  const dot2Style = useAnimatedStyle(() => ({ opacity: opacity2.value }));
  const dot3Style = useAnimatedStyle(() => ({ opacity: opacity3.value }));

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 8,
        alignItems: 'center',
      }}
    >
      <LinearGradient
        colors={['#8B5CF6', '#7C3AED']}
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 8,
        }}
      >
        <Ionicons name="headset" size={16} color={Colors.white} />
      </LinearGradient>
      <View
        style={{
          backgroundColor: Colors.neutral[100],
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 20,
          borderTopLeftRadius: 6,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Animated.View
          style={[
            {
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: Colors.neutral[400],
              marginRight: 4,
            },
            dot1Style,
          ]}
        />
        <Animated.View
          style={[
            {
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: Colors.neutral[400],
              marginRight: 4,
            },
            dot2Style,
          ]}
        />
        <Animated.View
          style={[
            {
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: Colors.neutral[400],
            },
            dot3Style,
          ]}
        />
      </View>
    </Animated.View>
  );
};

export default function ChatRoomScreen() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { messages, loading, sendMessage } = useMessages(conversationId!);
  const { user } = useAuthStore();
  const flatListRef = useRef<FlatList>(null);

  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (conversationId) {
      markAsRead(conversationId).catch(console.error);
    }
  }, [conversationId]);

  const groupedMessages = useMemo(() => {
    const groups: Array<{ type: 'date'; date: Date } | { type: 'message'; message: Message; isFirst: boolean; isLast: boolean }> = [];
    let lastDate: string | null = null;
    let lastSenderRole: string | null = null;

    const sortedMessages = [...messages].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    sortedMessages.forEach((msg, idx) => {
      const msgDate = format(new Date(msg.createdAt), 'yyyy-MM-dd');
      const nextMsg = sortedMessages[idx + 1];
      const prevMsg = sortedMessages[idx - 1];

      if (msgDate !== lastDate) {
        groups.push({ type: 'date', date: new Date(msg.createdAt) });
        lastDate = msgDate;
        lastSenderRole = null;
      }

      const isFirst = lastSenderRole !== msg.senderRole;
      const isLast = !nextMsg || nextMsg.senderRole !== msg.senderRole ||
        format(new Date(nextMsg.createdAt), 'yyyy-MM-dd') !== msgDate;

      groups.push({
        type: 'message',
        message: msg,
        isFirst,
        isLast,
      });

      lastSenderRole = msg.senderRole;
    });

    return groups.reverse();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || sending) return;
    
    setSending(true);
    const text = inputText.trim();
    setInputText('');

    try {
      await sendMessage(text);
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }, 100);
    } catch (e) {
      setInputText(text);
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: typeof groupedMessages[0] }) => {
      if (item.type === 'date') {
        return <DateSeparator date={item.date} />;
      }

      const isMe = item.message.senderRole === 'PATIENT';
      return (
        <MessageBubble
          message={item.message}
          isMe={isMe}
          showAvatar={!isMe && item.isFirst}
          isFirst={item.isFirst}
          isLast={item.isLast}
        />
      );
    },
    []
  );

  const keyExtractor = useCallback(
    (item: typeof groupedMessages[0], index: number) => {
      if (item.type === 'date') {
        return `date-${item.date.toISOString()}`;
      }
      return item.message.id;
    },
    []
  );

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Colors.white,
        }}
      >
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            backgroundColor: Colors.neutral[50],
            alignItems: 'center',
            justifyContent: 'center',
            ...Shadows.lg,
          }}
        >
          <ActivityIndicator size="large" color={Colors.primary[500]} />
        </View>
        <Text
          style={{
            marginTop: 16,
            fontSize: 15,
            color: Colors.text.secondary,
          }}
        >
          Loading messages...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <LinearGradient
        colors={[Colors.primary[500], Colors.primary[600]]}
        style={{
          paddingTop: insets.top,
          paddingBottom: 16,
        }}
      >
        <Animated.View
          entering={FadeInUp.duration(300)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({
              width: 42,
              height: 42,
              borderRadius: 14,
              backgroundColor: 'rgba(255,255,255,0.15)',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </Pressable>

          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: Colors.white,
              }}
            >
              Support Team
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: Colors.success,
                  marginRight: 6,
                }}
              />
              <Text
                style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                Online • Usually replies instantly
              </Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => ({
              width: 42,
              height: 42,
              borderRadius: 14,
              backgroundColor: 'rgba(255,255,255,0.15)',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Ionicons name="ellipsis-vertical" size={20} color={Colors.white} />
          </Pressable>
        </Animated.View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={groupedMessages}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          inverted
          contentContainerStyle={{
            paddingVertical: 16,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={isTyping ? <TypingIndicator /> : null}
          ListEmptyComponent={
            <Animated.View
              entering={FadeIn.duration(500)}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 40,
                paddingVertical: 60,
              }}
            >
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 32,
                  backgroundColor: Colors.primary[50],
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}
              >
                <Ionicons
                  name="chatbubbles"
                  size={48}
                  color={Colors.primary[400]}
                />
              </View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: Colors.text.primary,
                  marginBottom: 8,
                  textAlign: 'center',
                }}
              >
                Start the conversation
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.text.tertiary,
                  textAlign: 'center',
                  lineHeight: 20,
                }}
              >
                Send a message to begin chatting with our support team
              </Text>
            </Animated.View>
          }
        />

        <Animated.View
          entering={FadeInDown.duration(300)}
          style={{
            borderTopWidth: 1,
            borderTopColor: Colors.border.light,
            backgroundColor: Colors.white,
            paddingBottom: Platform.OS === 'ios' ? insets.bottom : 8,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              padding: 12,
              paddingBottom: 8,
            }}
          >
            <Pressable
              style={({ pressed }) => ({
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: Colors.neutral[100],
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Ionicons name="add" size={24} color={Colors.neutral[500]} />
            </Pressable>

            <View
              style={{
                flex: 1,
                backgroundColor: Colors.neutral[100],
                borderRadius: 22,
                flexDirection: 'row',
                alignItems: 'flex-end',
                paddingHorizontal: 16,
                paddingVertical: 8,
                minHeight: 44,
                maxHeight: 120,
              }}
            >
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type a message..."
                placeholderTextColor={Colors.neutral[400]}
                multiline
                style={{
                  flex: 1,
                  fontSize: 15,
                  color: Colors.text.primary,
                  maxHeight: 100,
                  paddingVertical: Platform.OS === 'ios' ? 6 : 2,
                }}
              />
            </View>

            <Pressable
              onPress={handleSend}
              disabled={!inputText.trim() || sending}
              style={({ pressed }) => ({
                marginLeft: 10,
                opacity: !inputText.trim() || sending ? 0.5 : pressed ? 0.8 : 1,
              })}
            >
              <LinearGradient
                colors={
                  inputText.trim()
                    ? [Colors.primary[500], Colors.primary[600]]
                    : [Colors.neutral[300], Colors.neutral[400]]
                }
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {sending ? (
                  <ActivityIndicator color={Colors.white} size="small" />
                ) : (
                  <Ionicons name="send" size={20} color={Colors.white} />
                )}
              </LinearGradient>
            </Pressable>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}
