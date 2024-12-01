import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Lock, User, Globe } from 'lucide-react';

function Settings() {
  const sections = [
    {
      icon: <User className="w-5 h-5" />,
      title: 'Profile Settings',
      description: 'Manage your personal information and preferences',
      fields: [
        { label: 'Name', type: 'text', placeholder: 'Your name' },
        { label: 'Email', type: 'email', placeholder: 'your@email.com' },
        { label: 'Time Zone', type: 'select', options: ['UTC', 'UTC+1', 'UTC-1'] }
      ]
    },
    {
      icon: <Bell className="w-5 h-5" />,
      title: 'Notifications',
      description: 'Configure how you want to receive updates',
      fields: [
        { label: 'Email Notifications', type: 'checkbox' },
        { label: 'Push Notifications', type: 'checkbox' },
        { label: 'Weekly Summary', type: 'checkbox' }
      ]
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: 'Privacy',
      description: 'Control your privacy settings and data usage',
      fields: [
        { label: 'Make Profile Public', type: 'checkbox' },
        { label: 'Share Progress', type: 'checkbox' },
        { label: 'Allow Analytics', type: 'checkbox' }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-400">Manage your account preferences</p>
      </header>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-2xl bg-gray-800 border border-gray-700"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                {section.icon}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{section.title}</h2>
                <p className="text-gray-400 text-sm">{section.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              {section.fields.map((field, fieldIndex) => (
                <div key={fieldIndex} className="flex items-center justify-between">
                  <label className="text-gray-300">{field.label}</label>
                  {field.type === 'checkbox' ? (
                    <div className="relative inline-block w-12 h-6 rounded-full bg-gray-700">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        id={`${section.title}-${field.label}`}
                      />
                      <label
                        htmlFor={`${section.title}-${field.label}`}
                        className="absolute inset-0 rounded-full cursor-pointer transition-colors peer-checked:bg-blue-500"
                      >
                        <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform peer-checked:translate-x-6" />
                      </label>
                    </div>
                  ) : field.type === 'select' ? (
                    <select className="bg-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {field.options.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      className="bg-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-end space-x-4">
        <button className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
          Cancel
        </button>
        <button className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default Settings;