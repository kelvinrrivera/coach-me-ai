import { supabase } from '../lib/supabase';
import { handleSupabaseError } from '../utils/errorHandling';
import { openaiService } from './openaiService';

export interface ChatMessage {
  id: string;
  user_id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
  goal_id?: string;
}

export const chatService = {
  async getMessages(goalId?: string) {
    try {
      const user = await supabase.auth.getUser();
      let query = supabase
        .from('messages')
        .select('*')
        .eq('user_id', user.data.user?.id)
        .order('created_at', { ascending: true });

      if (goalId) {
        query = query.eq('goal_id', goalId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ChatMessage[];
    } catch (error) {
      throw handleSupabaseError(error);
    }
  },

  async sendMessage(content: string, goalId?: string): Promise<ChatMessage> {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('User not authenticated');

      const { data: message, error } = await supabase
        .from('messages')
        .insert([
          {
            content,
            role: 'user',
            user_id: user.data.user.id,
            goal_id: goalId,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return message as ChatMessage;
    } catch (error) {
      throw handleSupabaseError(error);
    }
  },

  async sendAIResponse(userMessage: ChatMessage): Promise<ChatMessage> {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('User not authenticated');

      // Get previous messages for context
      const previousMessages = await this.getMessages(userMessage.goal_id);
      const messageHistory = previousMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Generate AI response
      const aiResponseContent = await openaiService.generateResponse(messageHistory);

      // Save AI response to database
      const { data: message, error } = await supabase
        .from('messages')
        .insert([
          {
            content: aiResponseContent,
            role: 'assistant',
            user_id: user.data.user.id,
            goal_id: userMessage.goal_id,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return message as ChatMessage;
    } catch (error) {
      throw handleSupabaseError(error);
    }
  },
};