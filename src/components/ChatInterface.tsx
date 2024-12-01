import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useChat } from '../hooks/useChat';
import { motion } from 'framer-motion';
import { VoiceChat } from './VoiceChat';

interface ChatInterfaceProps {
  goalId?: string;
}

function ChatInterface({ goalId }: ChatInterfaceProps) {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState<string>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, loading, sendMessage } = useChat(goalId);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
    },
    onDrop: acceptedFiles => {
      setFiles([...files, ...acceptedFiles]);
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      try {
        setIsProcessing(true);
        const response = await sendMessage(message);
        setLastResponse(response[1]?.content);
        setMessage('');
        setFiles([]);
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleVoiceMessage = async (transcript: string) => {
    try {
      setIsProcessing(true);
      const response = await sendMessage(transcript);
      setLastResponse(response[1]?.content);
    } catch (error) {
      console.error('Error sending voice message:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : (
          messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-100'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <span className="text-xs opacity-75 mt-1 block">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </span>
              </div>
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-700 space-y-4">
        <VoiceChat
          onMessage={handleVoiceMessage}
          isProcessing={isProcessing}
          lastResponse={lastResponse}
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                >
                  {file.name}
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <div {...getRootProps()} className="cursor-pointer">
              <input {...getInputProps()} />
              <button
                type="button"
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                <Paperclip className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-700 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isProcessing}
            />

            <button
              type="submit"
              className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors disabled:opacity-50"
              disabled={!message.trim() || isProcessing}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatInterface;