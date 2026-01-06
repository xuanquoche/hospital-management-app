import {
  AIChatInput,
  AIChatResponse,
  AIRecommendationResponse,
  AISymptomInput,
} from '@/types/ai';
import { api } from './api';

interface ApiWrapper<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export const recommendDoctor = async (
  input: AISymptomInput
): Promise<AIRecommendationResponse> => {
  try {
    console.log('🤖 AI Request:', JSON.stringify(input, null, 2));
    const response = await api.post<ApiWrapper<AIRecommendationResponse>>(
      '/ai/recommend-doctor',
      input
    );
    console.log('🤖 AI Response:', JSON.stringify(response.data, null, 2));

    const aiResponse = response.data.data;
    console.log('🤖 AI Parsed Response:', {
      responseType: aiResponse.responseType,
      hasFollowUp: !!aiResponse.followUpQuestion,
      suggestedQuestions: aiResponse.suggestedQuestions,
    });

    return aiResponse;
  } catch (error: any) {
    console.error('🤖 AI Error:', error?.response?.data || error.message);
    throw error;
  }
};

export const chatWithAI = async (
  input: AIChatInput
): Promise<AIChatResponse> => {
  const response = await api.post<ApiWrapper<AIChatResponse>>('/ai/chat', input);
  return response.data.data;
};
