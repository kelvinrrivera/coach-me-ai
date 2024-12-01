import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Target, TrendingUp, Award } from 'lucide-react';

function Dashboard() {
  const stats = [
    { icon: <Target />, label: 'Active Goals', value: '3' },
    { icon: <Activity />, label: 'Progress Rate', value: '78%' },
    { icon: <TrendingUp />, label: 'Completed Tasks', value: '24' },
    { icon: <Award />, label: 'Achievements', value: '7' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400">Track your progress and achievements</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-2xl bg-gray-800 border border-gray-700"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
                {stat.icon}
              </div>
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 rounded-2xl bg-gray-800 border border-gray-700"
        >
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 rounded-lg bg-gray-700/50"
              >
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <div>
                  <p className="font-medium">Completed Task #{index + 1}</p>
                  <p className="text-sm text-gray-400">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 rounded-2xl bg-gray-800 border border-gray-700"
        >
          <h2 className="text-xl font-semibold mb-4">Upcoming Tasks</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                  <div>
                    <p className="font-medium">Task #{index + 1}</p>
                    <p className="text-sm text-gray-400">Due in 2 days</p>
                  </div>
                </div>
                <button className="px-3 py-1 text-sm bg-purple-500/20 text-purple-400 rounded-full">
                  Start
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;