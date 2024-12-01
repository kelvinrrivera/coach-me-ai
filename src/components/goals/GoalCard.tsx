import React, { useState } from 'react';
import { Goal, Milestone } from '../../types/goal';
import { Calendar, CheckCircle, Clock, Trash2, Plus } from 'lucide-react';
import { MilestoneList } from './MilestoneList';
import { MilestoneForm } from './MilestoneForm';
import { useMilestones } from '../../hooks/useMilestones';

interface GoalCardProps {
  goal: Goal;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Goal['status']) => void;
  onRefresh: () => void;
}

export function GoalCard({ goal, onDelete, onStatusChange, onRefresh }: GoalCardProps) {
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const { addMilestone, updateMilestone, deleteMilestone } = useMilestones(onRefresh);

  const statusColors = {
    not_started: 'bg-gray-500',
    in_progress: 'bg-blue-500',
    completed: 'bg-green-500',
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleAddEvidence = async (milestoneId: string, file: File) => {
    // TODO: Implement file upload to storage
    console.log('Adding evidence:', milestoneId, file);
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">{goal.title}</h3>
          <p className="text-gray-400">{goal.description}</p>
        </div>
        <button
          onClick={() => onDelete(goal.id)}
          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-2 text-gray-400">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{formatDate(goal.target_date)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${statusColors[goal.status]}`} />
          <span className="text-sm capitalize">{goal.status.replace('_', ' ')}</span>
        </div>
      </div>

      <div className="flex space-x-2 mb-6">
        {goal.status !== 'completed' && (
          <button
            onClick={() => onStatusChange(goal.id, 'in_progress')}
            className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            <Clock className="w-4 h-4 inline-block mr-2" />
            Start
          </button>
        )}
        {goal.status === 'in_progress' && (
          <button
            onClick={() => onStatusChange(goal.id, 'completed')}
            className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
          >
            <CheckCircle className="w-4 h-4 inline-block mr-2" />
            Complete
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Milestones</h4>
          <button
            onClick={() => setShowMilestoneForm(true)}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Milestone</span>
          </button>
        </div>

        <MilestoneList
          milestones={goal.milestones}
          onStatusChange={(id, status) => updateMilestone(id, { status })}
          onDelete={deleteMilestone}
          onAddEvidence={handleAddEvidence}
        />
      </div>

      {showMilestoneForm && (
        <MilestoneForm
          goalId={goal.id}
          onSubmit={async (milestone) => {
            await addMilestone(milestone);
            setShowMilestoneForm(false);
          }}
          onCancel={() => setShowMilestoneForm(false)}
        />
      )}
    </div>
  );
}