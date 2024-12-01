import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Lock, Clock } from 'lucide-react';

function Timeline({ stages }) {
  return (
    <div className="relative">
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-700" />
      
      <div className="space-y-12">
        {stages.map((stage, index) => (
          <TimelineStage
            key={index}
            stage={stage}
            isFirst={index === 0}
            isLast={index === stages.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function TimelineStage({ stage, isFirst, isLast }) {
  const getStatusIcon = () => {
    if (stage.completed) return <CheckCircle className="w-8 h-8 text-green-400" />;
    if (stage.locked) return <Lock className="w-8 h-8 text-gray-500" />;
    return <Clock className="w-8 h-8 text-blue-400 animate-pulse" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${stage.locked ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center">
        <div className="flex-1">
          <div className={`p-6 rounded-xl ${
            stage.locked ? 'bg-gray-800/50' : 'bg-gray-800'
          } border border-gray-700`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold">{stage.title}</h3>
              {getStatusIcon()}
            </div>
            <p className="text-gray-400 mb-4">{stage.description}</p>
            {stage.tasks && (
              <div className="space-y-2">
                {stage.tasks.map((task, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-sm text-gray-300"
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      task.completed ? 'bg-green-400' : 'bg-gray-500'
                    }`} />
                    <span>{task.text}</span>
                  </div>
                ))}
              </div>
            )}
            {!stage.locked && !stage.completed && (
              <button className="mt-4 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
                Upload Evidence
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Timeline;