import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceChatProps {
  onMessage: (message: string) => Promise<void>;
  isProcessing: boolean;
  lastResponse?: string;
}

export function VoiceChat({ onMessage, isProcessing, lastResponse }: VoiceChatProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    setSpeechSynthesis(window.speechSynthesis);
  }, []);

  useEffect(() => {
    if (lastResponse && !isProcessing && isSpeaking) {
      speak(lastResponse);
    }
  }, [lastResponse, isProcessing]);

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      if (transcript.trim()) {
        onMessage(transcript);
      }
      resetTranscript();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
    if (isSpeaking) {
      speechSynthesis?.cancel();
    }
  };

  const speak = (text: string) => {
    if (!speechSynthesis || !isSpeaking) return;

    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get available voices
    const voices = speechSynthesis.getVoices();
    // Try to find a natural-sounding voice
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Natural') || voice.name.includes('Premium')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.rate = 1;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  };

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <div className="flex items-center space-x-4">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={toggleListening}
        className={`p-3 rounded-full transition-colors ${
          listening
            ? 'bg-red-500 text-white'
            : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
        }`}
      >
        {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={toggleSpeaking}
        className={`p-3 rounded-full transition-colors ${
          isSpeaking
            ? 'bg-blue-500 text-white'
            : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
        }`}
      >
        {isSpeaking ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </motion.button>

      <AnimatePresence>
        {listening && transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex-1 p-2 bg-gray-700 rounded-lg text-sm text-gray-200"
          >
            {transcript}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}