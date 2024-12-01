import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, MessageSquare, Award } from 'lucide-react';

const steps = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: "Bienvenido a Coach-me.ai",
    description: "Tu asistente personal de coaching impulsado por IA",
    color: "blue"
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Define tus Objetivos",
    description: "Establece metas claras y alcanzables",
    color: "purple"
  },
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: "Conoce a tu Coach",
    description: "Obtén un coach personalizado basado en tus necesidades",
    color: "pink"
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Alcanza el Éxito",
    description: "Sigue tu plan personalizado y logra tus metas",
    color: "green"
  }
];

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = React.useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-800 rounded-2xl p-8 max-w-lg w-full mx-4"
      >
        <motion.div
          key={currentStep}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          className="space-y-6"
        >
          <div className={`p-4 bg-${steps[currentStep].color}-500/20 rounded-xl w-fit mx-auto`}>
            {steps[currentStep].icon}
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">{steps[currentStep].title}</h2>
            <p className="text-gray-400">{steps[currentStep].description}</p>
          </div>

          <div className="flex justify-center space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-blue-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextStep}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            {currentStep < steps.length - 1 ? 'Continuar' : 'Empezar'}
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}