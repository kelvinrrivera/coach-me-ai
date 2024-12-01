import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAuthErrorMessage } from '../utils/authErrors';
import toast from 'react-hot-toast';

interface UseAuthFormProps {
  mode: 'login' | 'signup';
}

export const useAuthForm = ({ mode }: UseAuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const authAction = mode === 'login' ? signIn : signUp;
      const result = await authAction(email, password);
      
      // Check if there's an error in the result
      if (result?.error) {
        toast.error(getAuthErrorMessage(result.error));
        setIsLoading(false);
        return;
      }

      if (mode === 'login') {
        toast.success('Successfully signed in!');
        navigate('/dashboard');
      } else {
        toast.success(
          'Successfully signed up! Please check your email for confirmation.',
          { duration: 6000 }
        );
        navigate('/login');
      }
    } catch (error) {
      console.error(`Error ${mode === 'login' ? 'signing in' : 'signing up'}:`, error);
      toast.error(getAuthErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleSubmit,
  };
};