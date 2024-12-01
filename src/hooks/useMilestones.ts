import { useState } from 'react';
import { Milestone } from '../types/goal';
import { milestoneService } from '../services/milestoneService';
import toast from 'react-hot-toast';

export const useMilestones = (onUpdate: () => void) => {
  const [loading, setLoading] = useState(false);

  const addMilestone = async (milestone: Omit<Milestone, 'id'>) => {
    setLoading(true);
    try {
      const newMilestone = await milestoneService.addMilestone(milestone);
      toast.success('Milestone added successfully!');
      onUpdate();
      return newMilestone;
    } catch (error) {
      toast.error(error.message || 'Failed to add milestone');
      console.error('Error adding milestone:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateMilestone = async (id: string, updates: Partial<Milestone>) => {
    setLoading(true);
    try {
      const updatedMilestone = await milestoneService.updateMilestone(id, updates);
      toast.success('Milestone updated successfully!');
      onUpdate();
      return updatedMilestone;
    } catch (error) {
      toast.error(error.message || 'Failed to update milestone');
      console.error('Error updating milestone:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMilestone = async (id: string) => {
    setLoading(true);
    try {
      await milestoneService.deleteMilestone(id);
      toast.success('Milestone deleted successfully!');
      onUpdate();
    } catch (error) {
      toast.error(error.message || 'Failed to delete milestone');
      console.error('Error deleting milestone:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    addMilestone,
    updateMilestone,
    deleteMilestone,
  };
};