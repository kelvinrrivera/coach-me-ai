import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Target, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      <section className="py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
            Transform Your Goals into Reality
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Your AI-powered personal coach that creates customized roadmaps, tracks your progress,
            and keeps you accountable on your journey to success.
          </p>
          <Link
            to="/goals"
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Start Your Journey
          </Link>
        </motion.div>
      </section>

      <section className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          icon={<Bot className="w-12 h-12 text-blue-400" />}
          title="AI-Powered Coaching"
          description="Get personalized guidance and actionable steps tailored to your specific goals and circumstances."
        />
        <FeatureCard
          icon={<Target className="w-12 h-12 text-purple-400" />}
          title="Smart Progress Tracking"
          description="Upload evidence of your progress and get real-time feedback and adjustments to your roadmap."
        />
        <FeatureCard
          icon={<Clock className="w-12 h-12 text-pink-400" />}
          title="Intelligent Timeline"
          description="Visualize your journey with our interactive timeline that adapts to your pace and achievements."
        />
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="p-6 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
}

export default Home;