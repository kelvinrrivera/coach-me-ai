import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCoach } from '../hooks/useCoach';
import ChatInterface from './ChatInterface';
import { Brain } from 'lucide-react';

interface CoachingInterfaceProps {
  goalId: string;
  initialDescription?: string;
}

export function CoachingInterface({ goalId, initialDescription }: CoachingInterfaceProps) {
  const {
    coach,
    messages,
    loading,
    isInterviewing,
    startCoaching,
    sendMessage,
  } = useCoach(goalId);

  const [description, setDescription] = useState(initialDescription || '');

  const handleStartCoaching = async () => {
    if (!description.trim()) {
      toast.error('Please describe your goal first');
      return;
    }
    await startCoaching(description);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!coach) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-2xl border border-gray-700"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <Brain className="w-12 h-12 text-blue-400" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-4">
          Let's Find Your Perfect Coach
        </h2>

        <p className="text-gray-400 text-center mb-6">
          Tell us about your goal in detail. Our AI will analyze your needs and match you with
          the perfect coach to guide you on your journey.
        </p>

        <div className="space-y-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your goal, current situation, and what you hope to achieve..."
            className="w-full h-32 px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            disabled={isInterviewing}
          />

          <button
            onClick={handleStartCoaching}
            disabled={isInterviewing || !description.trim()}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isInterviewing ? 'Finding Your Coach...' : 'Start Coaching'}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="h-[600px] rounded-2xl bg-gray-800 border border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-700 flex items-center space-x-4">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <Brain className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h3 className="font-medium">{coach.name}</h3>
          <p className="text-sm text-gray-400">{coach.expertise.join(' • ')}</p>
        </div>
      </div>

      <ChatInterface goalId={goalId} onSendMessage={sendMessage} messages={messages} />
    </div>
  );
}