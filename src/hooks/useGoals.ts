import { useState, useEffect } from 'react';
import { Goal } from '../types/goal';
import { goalService } from '../services/goalService';
import { milestoneService } from '../services/milestoneService';
import toast from 'react-hot-toast';

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const loadGoals = async () => {
    try {
      const goalsData = await goalService.getGoals();
      const goalsWithMilestones = await Promise.all(
        goalsData.map(async (goal) => {
          const milestones = await milestoneService.getMilestonesByGoalId(goal.id);
          return { ...goal, milestones };
        })
      );
      setGoals(goalsWithMilestones);
    } catch (error) {
      toast.error(error.message || 'Failed to load goals');
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const createGoal = async (goal: Omit<Goal, 'id' | 'created_at' | 'user_id'>) => {
    try {
      const newGoal = await goalService.createGoal(goal);
      setGoals([{ ...newGoal, milestones: [] }, ...goals]);
      toast.success('Goal created successfully!');
      return newGoal;
    } catch (error) {
      toast.error(error.message || 'Failed to create goal');
      console.error('Error creating goal:', error);
    }
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    try {
      const updatedGoal = await goalService.updateGoal(id, updates);
      const milestones = await milestoneService.getMilestonesByGoalId(id);
      const updatedGoalWithMilestones = { ...updatedGoal, milestones };
      setGoals(goals.map(goal => goal.id === id ? updatedGoalWithMilestones : goal));
      toast.success('Goal updated successfully!');
      return updatedGoalWithMilestones;
    } catch (error) {
      toast.error(error.message || 'Failed to update goal');
      console.error('Error updating goal:', error);
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      await goalService.deleteGoal(id);
      setGoals(goals.filter(goal => goal.id !== id));
      toast.success('Goal deleted successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to delete goal');
      console.error('Error deleting goal:', error);
    }
  };

  return {
    goals,
    loading,
    createGoal,
    updateGoal,
    deleteGoal,
    refreshGoals: loadGoals,
  };
};