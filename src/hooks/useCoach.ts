import { useState, useEffect } from 'react';
import { Coach, CoachMessage } from '../types/coach';
import { coachService } from '../services/coachService';
import toast from 'react-hot-toast';

export const useCoach = (goalId?: string) => {
  const [coach, setCoach] = useState<Coach | null>(null);
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInterviewing, setIsInterviewing] = useState(false);

  useEffect(() => {
    if (goalId) {
      loadCoach();
    }
  }, [goalId]);

  const loadCoach = async () => {
    try {
      setLoading(true);
      const coachData = await coachService.getCoachForGoal(goalId!);
      
      if (coachData) {
        setCoach(coachData);
        const messagesData = await coachService.getMessages(coachData.id);
        setMessages(messagesData);
      }
    } catch (error) {
      console.error('Error loading coach:', error);
      toast.error('Failed to load coach data');
    } finally {
      setLoading(false);
    }
  };

  const startCoaching = async (initialDescription: string) => {
    try {
      setIsInterviewing(true);
      const newCoach = await coachService.startCoachingProcess(goalId!, initialDescription);
      setCoach(newCoach);
      await loadCoach(); // Reload to get welcome message
      return newCoach;
    } catch (error) {
      console.error('Error starting coaching:', error);
      toast.error('Failed to start coaching process');
    } finally {
      setIsInterviewing(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!coach) return;
    
    try {
      const [userMessage, coachMessage] = await coachService.sendMessage(coach.id, content);
      setMessages(prev => [...prev, userMessage, coachMessage]);
      return [userMessage, coachMessage];
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  return {
    coach,
    messages,
    loading,
    isInterviewing,
    startCoaching,
    sendMessage,
  };
};