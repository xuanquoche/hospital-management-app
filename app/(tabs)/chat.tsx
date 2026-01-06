import { Colors } from '@/constants/colors';
import { useConversations } from '@/hooks/useConversations';
import { Conversation } from '@/types/conversation';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ChatListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { conversations, loading, refetch } = useConversations();

  const renderItem = ({ item, index }: { item: Conversation; index: number }) => (
    <Animated.View entering={FadeInDown.duration(400).delay(index * 80)}>
      <Pressable
        onPress={() => router.push(`/chat/${item.id}`)}
        style={{
          backgroundColor: Colors.white,
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border.light,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 18,
            backgroundColor: Colors.primary[100],
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 14,
          }}
        >
          <Ionicons
            name="chatbubble-ellipses"
            size={26}
            color={Colors.primary[600]}
          />
        </View>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: Colors.text.primary,
              }}
            >
              Support Chat
            </Text>
            {item.lastMessageAt && (
              <Text
                style={{
                  fontSize: 12,
                  color: Colors.text.tertiary,
                }}
              >
                {formatDistanceToNow(new Date(item.lastMessageAt), {
                  addSuffix: true,
                })}
              </Text>
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: item.unreadCount
                  ? Colors.text.primary
                  : Colors.text.tertiary,
                fontWeight: item.unreadCount ? '500' : '400',
                flex: 1,
                marginRight: 10,
              }}
              numberOfLines={1}
            >
              {item.lastMessage?.content || 'No messages yet'}
            </Text>
            {item.unreadCount ? (
              <View
                style={{
                  backgroundColor: Colors.primary[500],
                  borderRadius: 12,
                  minWidth: 24,
                  height: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 8,
                }}
              >
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: 12,
                    fontWeight: '700',
                  }}
                >
                  {item.unreadCount > 99 ? '99+' : item.unreadCount}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={Colors.neutral[400]}
          style={{ marginLeft: 8 }}
        />
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
          backgroundColor: Colors.white,
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary[500]} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <Animated.View
        entering={FadeInUp.duration(400)}
        style={{
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 16,
          backgroundColor: Colors.white,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border.light,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: Colors.text.primary,
              }}
            >
              Messages
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: Colors.text.tertiary,
                marginTop: 2,
              }}
            >
              Chat with our support team
            </Text>
          </View>
          <Pressable
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              backgroundColor: Colors.primary[500],
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="create-outline" size={22} color={Colors.white} />
          </Pressable>
        </View>
      </Animated.View>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            tintColor={Colors.primary[500]}
          />
        }
        ListEmptyComponent={
          <View
            style={{
              paddingVertical: 80,
              alignItems: 'center',
              paddingHorizontal: 40,
            }}
          >
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 30,
                backgroundColor: Colors.primary[100],
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
              }}
            >
              <Ionicons
                name="chatbubbles-outline"
                size={50}
                color={Colors.primary[500]}
              />
            </View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '700',
                color: Colors.text.primary,
                marginBottom: 8,
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
              }}
            >
              Start a conversation with our support team for any questions or
              assistance
            </Text>
            <Pressable
              style={{
                marginTop: 24,
                backgroundColor: Colors.primary[500],
                paddingHorizontal: 28,
                paddingVertical: 14,
                borderRadius: 14,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons
                name="add"
                size={20}
                color={Colors.white}
                style={{ marginRight: 8 }}
              />
              <Text
                style={{ color: Colors.white, fontWeight: '600', fontSize: 15 }}
              >
                New Conversation
              </Text>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}
