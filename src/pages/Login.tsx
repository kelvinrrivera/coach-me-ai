import React from 'react';
import { AuthForm } from '../components/AuthForm';
import { useAuthForm } from '../hooks/useAuthForm';

function Login() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleSubmit,
  } = useAuthForm({ mode: 'login' });

  return (
    <AuthForm
      mode="login"
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      isLoading={isLoading}
      onSubmit={handleSubmit}
    />
  );
}

export default Login;