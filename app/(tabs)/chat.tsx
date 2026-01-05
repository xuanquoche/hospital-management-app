import { useConversations } from '@/hooks/useConversations';
import { Conversation } from '@/types/conversation';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';

export default function ChatListScreen() {
  const router = useRouter();
  const { conversations, loading, refetch } = useConversations();

  const renderItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      className="bg-white p-4 border-b border-gray-100 flex-row items-center"
      onPress={() => router.push(`/chat/${item.id}`)}
    >
      <View className="h-12 w-12 bg-blue-100 rounded-full items-center justify-center mr-3">
        <Text className="text-blue-600 font-bold text-lg">
            {item.patient.name?.[0] || 'D'}
        </Text>
      </View>
      <View className="flex-1">
        <View className="flex-row justify-between mb-1">
             <Text className="font-bold text-gray-800 text-base">Doctor Support</Text>
             {item.lastMessageAt && (
                 <Text className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(item.lastMessageAt), { addSuffix: true })}
                 </Text>
             )}
        </View>
        <Text className="text-gray-500 text-sm" numberOfLines={1}>
            {item.lastMessage?.content || 'No messages yet'}
        </Text>
      </View>
      {item.unreadCount ? (
          <View className="bg-red-500 rounded-full h-5 w-5 items-center justify-center ml-2">
              <Text className="text-white text-xs font-bold">{item.unreadCount}</Text>
          </View>
      ) : null}
    </TouchableOpacity>
  );

  if (loading) {
      return (
          <View className="flex-1 items-center justify-center">
              <ActivityIndicator />
          </View>
      );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="p-4 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-800">Messages</Text>
      </View>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshing={loading}
        onRefresh={refetch}
        ListEmptyComponent={
            <View className="p-10 items-center">
                <Text className="text-gray-400">No conversations yet.</Text>
            </View>
        }
      />
    </View>
  );
}
