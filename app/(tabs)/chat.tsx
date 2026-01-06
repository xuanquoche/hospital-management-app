import { NewConversationModal } from '@/components/chat/NewConversationModal';
import { Colors, Shadows } from '@/constants/colors';
import { useConversations } from '@/hooks/useConversations';
import { Conversation, ConversationStatus } from '@/types/conversation';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const STATUS_CONFIG: Record<ConversationStatus, { color: string; bgColor: string; label: string }> = {
  OPEN: { color: Colors.success, bgColor: '#DCFCE7', label: 'Open' },
  PENDING: { color: Colors.warning, bgColor: '#FEF3C7', label: 'Pending' },
  IN_PROGRESS: { color: Colors.info, bgColor: '#DBEAFE', label: 'In Progress' },
  RESOLVED: { color: Colors.secondary[600], bgColor: '#D1FAE5', label: 'Resolved' },
  CLOSED: { color: Colors.neutral[500], bgColor: Colors.neutral[200], label: 'Closed' },
};

interface ConversationItemProps {
  item: Conversation;
  index: number;
  onPress: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ item, index, onPress }) => {
  const scale = useSharedValue(1);
  const status = STATUS_CONFIG[item.status] || STATUS_CONFIG.OPEN;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const formatTime = () => {
    if (!item.lastMessageAt) return '';
    try {
      return formatDistanceToNow(new Date(item.lastMessageAt), { addSuffix: true });
    } catch {
      return '';
    }
  };

  const getSenderLabel = () => {
    if (!item.lastMessage) return '';
    return item.lastMessage.senderRole === 'PATIENT' ? 'You: ' : 'Support: ';
  };

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(index * 60)}>
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          {
            marginHorizontal: 20,
            marginBottom: 12,
            backgroundColor: Colors.white,
            borderRadius: 20,
            overflow: 'hidden',
            ...Shadows.sm,
          },
          animatedStyle,
        ]}
      >
        <View
          style={{
            flexDirection: 'row',
            padding: 16,
          }}
        >
          <View
            style={{
              width: 54,
              height: 54,
              borderRadius: 16,
              backgroundColor: item.unreadCount
                ? Colors.primary[100]
                : Colors.neutral[100],
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LinearGradient
              colors={
                item.unreadCount
                  ? [Colors.primary[500], Colors.primary[600]]
                  : [Colors.neutral[400], Colors.neutral[500]]
              }
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons
                name="chatbubble-ellipses"
                size={22}
                color={Colors.white}
              />
            </LinearGradient>
          </View>

          <View style={{ flex: 1, marginLeft: 14 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 6,
              }}
            >
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: Colors.text.primary,
                    marginBottom: 2,
                  }}
                  numberOfLines={1}
                >
                  Support Chat
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <View
                    style={{
                      backgroundColor: status.bgColor,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: '600',
                        color: status.color,
                      }}
                    >
                      {status.label}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: Colors.text.tertiary,
                    marginBottom: 4,
                  }}
                >
                  {formatTime()}
                </Text>
                {item.unreadCount ? (
                  <View
                    style={{
                      backgroundColor: Colors.primary[500],
                      borderRadius: 10,
                      minWidth: 20,
                      height: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingHorizontal: 6,
                    }}
                  >
                    <Text
                      style={{
                        color: Colors.white,
                        fontSize: 11,
                        fontWeight: '700',
                      }}
                    >
                      {item.unreadCount > 99 ? '99+' : item.unreadCount}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>

            <Text
              style={{
                fontSize: 14,
                color: item.unreadCount ? Colors.text.primary : Colors.text.tertiary,
                fontWeight: item.unreadCount ? '500' : '400',
                lineHeight: 20,
              }}
              numberOfLines={2}
            >
              {item.lastMessage ? (
                <>
                  <Text style={{ fontWeight: '600', color: Colors.text.secondary }}>
                    {getSenderLabel()}
                  </Text>
                  {item.lastMessage.content}
                </>
              ) : (
                'No messages yet'
              )}
            </Text>
          </View>

          <View style={{ justifyContent: 'center', marginLeft: 8 }}>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={Colors.neutral[400]}
            />
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
};

export default function ChatListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { conversations, loading, refetch } = useConversations();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const query = searchQuery.toLowerCase();
    return conversations.filter(
      (c) =>
        c.lastMessage?.content.toLowerCase().includes(query) ||
        c.status.toLowerCase().includes(query)
    );
  }, [conversations, searchQuery]);

  const handleConversationPress = useCallback(
    (id: string) => {
      router.push(`/chat/${id}`);
    },
    [router]
  );

  const handleNewConversationSuccess = useCallback(
    (conversationId: string) => {
      setShowNewModal(false);
      refetch();
      router.push(`/chat/${conversationId}`);
    },
    [router, refetch]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Conversation; index: number }) => (
      <ConversationItem
        item={item}
        index={index}
        onPress={() => handleConversationPress(item.id)}
      />
    ),
    [handleConversationPress]
  );

  const renderEmpty = () => (
    <Animated.View
      entering={FadeIn.duration(500).delay(200)}
      style={{
        paddingVertical: 60,
        alignItems: 'center',
        paddingHorizontal: 40,
      }}
    >
      <View
        style={{
          width: 120,
          height: 120,
          borderRadius: 40,
          backgroundColor: Colors.primary[50],
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
        }}
      >
        <LinearGradient
          colors={[Colors.primary[400], Colors.primary[500]]}
          style={{
            width: 80,
            height: 80,
            borderRadius: 28,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons
            name="chatbubbles"
            size={40}
            color={Colors.white}
          />
        </LinearGradient>
      </View>
      
      <Text
        style={{
          fontSize: 22,
          fontWeight: '700',
          color: Colors.text.primary,
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        No Conversations Yet
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: Colors.text.tertiary,
          textAlign: 'center',
          lineHeight: 22,
          marginBottom: 28,
        }}
      >
        Start a conversation with our support team for any questions or assistance
      </Text>
      
      <Pressable
        onPress={() => setShowNewModal(true)}
        style={({ pressed }) => ({
          opacity: pressed ? 0.9 : 1,
        })}
      >
        <LinearGradient
          colors={[Colors.primary[500], Colors.primary[600]]}
          style={{
            paddingHorizontal: 28,
            paddingVertical: 14,
            borderRadius: 14,
            flexDirection: 'row',
            alignItems: 'center',
            ...Shadows.md,
          }}
        >
          <Ionicons
            name="add-circle"
            size={20}
            color={Colors.white}
            style={{ marginRight: 8 }}
          />
          <Text
            style={{ color: Colors.white, fontWeight: '600', fontSize: 15 }}
          >
            Start New Conversation
          </Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );

  if (loading && conversations.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Colors.background.secondary,
        }}
      >
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            backgroundColor: Colors.white,
            alignItems: 'center',
            justifyContent: 'center',
            ...Shadows.lg,
          }}
        >
          <ActivityIndicator size="large" color={Colors.primary[500]} />
        </View>
        <Text
          style={{
            marginTop: 20,
            fontSize: 16,
            color: Colors.text.secondary,
            fontWeight: '500',
          }}
        >
          Loading conversations...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background.secondary }}>
      <LinearGradient
        colors={[Colors.primary[500], Colors.primary[600]]}
        style={{
          paddingTop: insets.top,
          paddingBottom: 24,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
        }}
      >
        <Animated.View
          entering={FadeInUp.duration(400)}
          style={{ paddingHorizontal: 20 }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10,
              marginBottom: 20,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 26,
                  fontWeight: '700',
                  color: Colors.white,
                }}
              >
                Messages
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.75)',
                  marginTop: 4,
                }}
              >
                {conversations.length > 0
                  ? `${conversations.length} conversation${conversations.length > 1 ? 's' : ''}`
                  : 'Chat with our support team'}
              </Text>
            </View>
            
            <Pressable
              onPress={() => setShowNewModal(true)}
              style={({ pressed }) => ({
                width: 48,
                height: 48,
                borderRadius: 16,
                backgroundColor: 'rgba(255,255,255,0.2)',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Ionicons name="add" size={26} color={Colors.white} />
            </Pressable>
          </View>

          <View
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: 14,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 14,
            }}
          >
            <Ionicons
              name="search-outline"
              size={20}
              color="rgba(255,255,255,0.7)"
            />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search conversations..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              style={{
                flex: 1,
                paddingVertical: Platform.OS === 'ios' ? 14 : 10,
                paddingHorizontal: 12,
                fontSize: 15,
                color: Colors.white,
              }}
            />
            {searchQuery ? (
              <Pressable onPress={() => setSearchQuery('')}>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color="rgba(255,255,255,0.7)"
                />
              </Pressable>
            ) : null}
          </View>
        </Animated.View>
      </LinearGradient>

      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 100,
          flexGrow: 1,
        }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            tintColor={Colors.primary[500]}
            colors={[Colors.primary[500]]}
          />
        }
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />

      <NewConversationModal
        visible={showNewModal}
        onClose={() => setShowNewModal(false)}
        onSuccess={handleNewConversationSuccess}
      />
    </View>
  );
}
