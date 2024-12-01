import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useGoals } from '../hooks/useGoals';
import { GoalForm } from '../components/goals/GoalForm';
import { GoalCard } from '../components/goals/GoalCard';
import { CoachingInterface } from '../components/CoachingInterface';
import { Goal } from '../types/goal';
import toast from 'react-hot-toast';

export default function Goals() {
  const [showForm, setShowForm] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const { goals, loading, createGoal, updateGoal, deleteGoal } = useGoals();

  const handleStatusChange = async (id: string, status: Goal['status']) => {
    await updateGoal(id, { status });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Goals</h1>
          <p className="text-gray-400">Track and manage your personal goals</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Goal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-400">Loading your goals...</p>
            </div>
          ) : goals.length === 0 ? (
            <div className="text-center py-8 bg-gray-800 rounded-xl border border-gray-700">
              <p className="text-gray-400 mb-4">You haven't created any goals yet</p>
              <button
                onClick={() => setShowForm(true)}
                className="text-blue-400 hover:text-blue-300"
              >
                Create your first goal
              </button>
            </div>
          ) : (
            goals.map((goal) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GoalCard
                  goal={goal}
                  onDelete={deleteGoal}
                  onStatusChange={handleStatusChange}
                  onSelect={() => setSelectedGoal(goal.id)}
                  isSelected={selectedGoal === goal.id}
                />
              </motion.div>
            ))
          )}
        </div>

        <div className="h-[600px]">
          {selectedGoal ? (
            <CoachingInterface
              goalId={selectedGoal}
              initialDescription={goals.find(g => g.id === selectedGoal)?.description}
            />
          ) : (
            <div className="h-full rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center">
              <p className="text-gray-400">Select a goal to start coaching</p>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <GoalForm
          onSubmit={async (goal) => {
            const newGoal = await createGoal(goal);
            if (newGoal) {
              setSelectedGoal(newGoal.id);
            }
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}