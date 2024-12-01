import React from 'react';
import { Milestone } from '../../types/goal';
import { CheckCircle, Clock, Paperclip } from 'lucide-react';

interface MilestoneListProps {
  milestones: Milestone[];
  onStatusChange: (id: string, status: Milestone['status']) => void;
  onDelete: (id: string) => void;
  onAddEvidence: (id: string, file: File) => void;
}

export function MilestoneList({
  milestones,
  onStatusChange,
  onDelete,
  onAddEvidence,
}: MilestoneListProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {milestones.map((milestone) => (
        <div
          key={milestone.id}
          className="p-4 bg-gray-700/50 rounded-lg space-y-3"
        >
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium">{milestone.title}</h4>
              <p className="text-sm text-gray-400">{milestone.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">
                Due: {formatDate(milestone.due_date)}
              </span>
              <div
                className={`px-2 py-1 rounded-full text-xs ${
                  milestone.status === 'completed'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-blue-500/20 text-blue-400'
                }`}
              >
                {milestone.status}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {milestone.status === 'pending' ? (
              <button
                onClick={() => onStatusChange(milestone.id, 'completed')}
                className="flex items-center space-x-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Complete</span>
              </button>
            ) : (
              <button
                onClick={() => onStatusChange(milestone.id, 'pending')}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
              >
                <Clock className="w-4 h-4" />
                <span>Reopen</span>
              </button>
            )}

            <label className="flex items-center space-x-1 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors text-sm cursor-pointer">
              <Paperclip className="w-4 h-4" />
              <span>Add Evidence</span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onAddEvidence(milestone.id, file);
                  }
                }}
                accept="image/*,application/pdf"
              />
            </label>

            <button
              onClick={() => onDelete(milestone.id)}
              className="px-3 py-1 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}