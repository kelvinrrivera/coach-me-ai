import { supabase } from '../lib/supabase';
import { Coach, CoachMessage } from '../types/coach';
import { handleSupabaseError } from '../utils/errorHandling';
import { openaiService } from './openaiService';

export const coachService = {
  async startCoachingProcess(goalId: string, initialDescription: string) {
    try {
      // Conduct initial interview
      const interviewData = await openaiService.conductInitialInterview(initialDescription);
      
      // Create coach assistant
      const { assistant_id, coach } = await openaiService.createCoachAssistant(
        interviewData,
        { goalId, description: initialDescription }
      );

      // Save coach to database
      const user = await supabase.auth.getUser();
      const { data: coachData, error: coachError } = await supabase
        .from('coaches')
        .insert([{
          user_id: user.data.user?.id,
          goal_id: goalId,
          assistant_id,
          ...coach
        }])
        .select()
        .single();

      if (coachError) throw coachError;

      // Create welcome message
      await this.saveMessage(coachData.id, {
        content: `Hello! I'm ${coach.name}, and I'll be your personal coach on this journey. I've reviewed your goals and the information you've shared. Let's start by creating a detailed roadmap for your success. What specific aspects of your goal would you like to discuss first?`,
        role: 'coach'
      });

      return coachData;
    } catch (error) {
      throw handleSupabaseError(error);
    }
  },

  async getCoachForGoal(goalId: string): Promise<Coach | null> {
    try {
      const { data, error } = await supabase
        .from('coaches')
        .select('*')
        .eq('goal_id', goalId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw handleSupabaseError(error);
    }
  },

  async getMessages(coachId: string): Promise<CoachMessage[]> {
    try {
      const { data, error } = await supabase
        .from('coach_messages')
        .select('*')
        .eq('coach_id', coachId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      throw handleSupabaseError(error);
    }
  },

  async sendMessage(coachId: string, content: string): Promise<[CoachMessage, CoachMessage]> {
    try {
      // Get coach details
      const { data: coach, error: coachError } = await supabase
        .from('coaches')
        .select('*')
        .eq('id', coachId)
        .single();

      if (coachError) throw coachError;

      // Save user message
      const userMessage = await this.saveMessage(coachId, {
        content,
        role: 'user'
      });

      // Get AI coach response
      const coachResponse = await openaiService.interactWithCoach(
        coach.assistant_id,
        content
      );

      // Save coach response
      const coachMessage = await this.saveMessage(coachId, {
        content: coachResponse,
        role: 'coach'
      });

      return [userMessage, coachMessage];
    } catch (error) {
      throw handleSupabaseError(error);
    }
  },

  async saveMessage(coachId: string, message: Omit<CoachMessage, 'id' | 'coach_id' | 'created_at'>): Promise<CoachMessage> {
    try {
      const { data, error } = await supabase
        .from('coach_messages')
        .insert([{
          coach_id: coachId,
          ...message
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }
};