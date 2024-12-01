import React from 'react';
import { AuthForm } from '../components/AuthForm';
import { useAuthForm } from '../hooks/useAuthForm';

function Signup() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleSubmit,
  } = useAuthForm({ mode: 'signup' });

  return (
    <AuthForm
      mode="signup"
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      isLoading={isLoading}
      onSubmit={handleSubmit}
    />
  );
}

export default Signup;