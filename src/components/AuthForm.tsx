import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, LogIn } from 'lucide-react';

interface AuthFormProps {
  mode: 'login' | 'signup';
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  email,
  setEmail,
  password,
  setPassword,
  isLoading,
  onSubmit,
}) => {
  const navigate = useNavigate();
  const isLogin = mode === 'login';

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-2xl bg-gray-800 border border-gray-700">
        <div className="flex items-center justify-center mb-8">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            {isLogin ? (
              <LogIn className="w-8 h-8 text-blue-400" />
            ) : (
              <UserPlus className="w-8 h-8 text-blue-400" />
            )}
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-8">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
              minLength={6}
            />
            {!isLogin && (
              <p className="mt-1 text-xs text-gray-400">
                Password must be at least 6 characters long
              </p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading
              ? isLogin ? 'Signing in...' : 'Creating Account...'
              : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            onClick={() => navigate(isLogin ? '/signup' : '/login')}
            className="text-blue-400 hover:text-blue-300"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};