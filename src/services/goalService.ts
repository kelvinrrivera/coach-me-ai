import { supabase } from '../lib/supabase';
import { Goal } from '../types/goal';
import { handleSupabaseError } from '../utils/errorHandling';

export const goalService = {
  async createGoal(goal: Omit<Goal, 'id' | 'created_at' | 'user_id'>) {
    try {
      const user = await supabase.auth.getUser();
      const { data: goalData, error: goalError } = await supabase
        .from('goals')
        .insert([
          {
            title: goal.title,
            description: goal.description,
            category: goal.category,
            target_date: goal.target_date,
            status: goal.status,
            user_id: user.data.user?.id,
          }
        ])
        .select()
        .single();

      if (goalError) throw goalError;
      return goalData;
    } catch (error) {
      throw handleSupabaseError(error);
    }
  },

  async getGoals() {
    try {
      const user = await supabase.auth.getUser();
      const { data: goals, error: goalsError } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.data.user?.id)
        .order('created_at', { ascending: false });

      if (goalsError) throw goalsError;
      return goals;
    } catch (error) {
      throw handleSupabaseError(error);
    }
  },

  async updateGoal(id: string, updates: Partial<Goal>) {
    try {
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw handleSupabaseError(error);
    }
  },

  async deleteGoal(id: string) {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }
};