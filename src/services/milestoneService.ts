import { supabase } from '../lib/supabase';
import { Milestone } from '../types/goal';
import { handleSupabaseError } from '../utils/errorHandling';

export const milestoneService = {
  async getMilestonesByGoalId(goalId: string): Promise<Milestone[]> {
    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .eq('goal_id', goalId)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw handleSupabaseError(error);
    }
  },

  async addMilestone(milestone: Omit<Milestone, 'id' | 'created_at'>): Promise<Milestone> {
    try {
      const { data, error } = await supabase
        .from('milestones')
        .insert([{
          goal_id: milestone.goal_id,
          title: milestone.title,
          description: milestone.description || '',
          due_date: milestone.due_date,
          status: milestone.status,
          evidence_url: milestone.evidence_url
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw handleSupabaseError(error);
    }
  },

  async updateMilestone(id: string, updates: Partial<Milestone>): Promise<Milestone> {
    try {
      const { data, error } = await supabase
        .from('milestones')
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

  async deleteMilestone(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('milestones')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      throw handleSupabaseError(error);
    }
  }
};