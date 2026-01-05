import { useMessages } from '@/hooks/useConversations';
import { useAuthStore } from '@/store/authStore';
import { Message } from '@/types/conversation';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ChatRoomScreen() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  const router = useRouter();
  const { messages, loading, sendMessage } = useMessages(conversationId!);
  const { user } = useAuthStore();
  
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    setSending(true);
    try {
        await sendMessage(inputText);
        setInputText('');
    } catch (e) {
        console.error(e);
    } finally {
        setSending(false);
    }
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isMe = item.senderRole === 'PATIENT'; // OR check senderId === user.id
    return (
      <View className={`mb-3 flex-row ${isMe ? 'justify-end' : 'justify-start'}`}>
        {!isMe && (
           <View className="h-8 w-8 bg-gray-200 rounded-full mr-2 items-center justify-center">
              <Text className="text-xs font-bold text-gray-600">D</Text>
           </View>
        )}
        <View className={`px-4 py-2 rounded-2xl max-w-[75%] ${isMe ? 'bg-blue-600 rounded-tr-none' : 'bg-gray-200 rounded-tl-none'}`}>
             <Text className={isMe ? 'text-white' : 'text-gray-800'}>{item.content}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
      return (
          <View className="flex-1 items-center justify-center">
              <ActivityIndicator />
          </View>
      );
  }

  return (
    <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 bg-white"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View className="px-4 py-3 border-b border-gray-200 flex-row items-center bg-white shadow-sm z-10">
         <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="#333" />
         </TouchableOpacity>
         <View>
            <Text className="font-bold text-lg text-gray-800">Doctor Support</Text>
            <Text className="text-xs text-green-600">Online</Text>
         </View>
      </View>

      <FlatList
        data={[...messages].reverse()} // messages from hook are reversed (oldest first), we want inverted list (newest first)?
        // Wait, useMessages returns `res.data.data.reverse()`. API usually returns newest first or oldest first?
        // If API returns desc (newest first), reverse makes it oldest first (normal chat order: top to bottom).
        // If we use inverted FlatList, we need Newest First.
        // Let's check hook: `setMessages(res.data.data.reverse())`. 
        // If API is typical, it returns paginated recent messages.
        // I'll assume standard top-to-bottom list for now (no inverted prop) to match `reverse()` in hook.
        // Wait, hook reverses it. So `messages` is Oldest -> Newest.
        // So standard FlatList renders Top -> Bottom.
        // But for Chat, we usually want to start at bottom.
        // I'll use `inverted` and `[...messages].reverse()` (which makes it Newest -> Oldest).
        // hook messages: [Old, ..., New].
        // reversed: [New, ..., Old].
        // inverted FlatList with [New, ..., Old] puts New at bottom. Correct.
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        className="flex-1"
        inverted
      />

      <View className="p-4 border-t border-gray-100 flex-row items-center bg-white">
         <TextInput
            className="flex-1 bg-gray-100 rounded-full px-4 py-3 mr-3 text-base"
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
            multiline
         />
         <TouchableOpacity 
            className={`h-12 w-12 bg-blue-600 rounded-full items-center justify-center ${!inputText.trim() ? 'opacity-50' : ''}`}
            disabled={!inputText.trim() || sending}
            onPress={handleSend}
         >
             {sending ? <ActivityIndicator color="white" size="small" /> : <Ionicons name="send" size={20} color="white" />}
         </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
