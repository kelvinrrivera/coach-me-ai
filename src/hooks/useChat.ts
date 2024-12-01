import { useState, useEffect } from 'react';
import { chatService, ChatMessage } from '../services/chatService';
import toast from 'react-hot-toast';

export const useChat = (goalId?: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, [goalId]);

  const loadMessages = async () => {
    try {
      const data = await chatService.getMessages(goalId);
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    try {
      // Send user message
      const userMessage = await chatService.sendMessage(content, goalId);
      setMessages(prev => [...prev, userMessage]);

      // Get AI response
      const aiMessage = await chatService.sendAIResponse(userMessage);
      setMessages(prev => [...prev, aiMessage]);

      return [userMessage, aiMessage];
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      throw error;
    }
  };

  return {
    messages,
    loading,
    sendMessage,
  };
};