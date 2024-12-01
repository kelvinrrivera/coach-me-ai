import { AuthError } from '@supabase/supabase-js';

export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
  EMAIL_NOT_CONFIRMED: 'Please confirm your email address. Check your inbox for the confirmation link.',
  NETWORK_ERROR: 'Unable to connect to the authentication service. Please check your internet connection.',
  RATE_LIMIT_ERROR: 'Too many attempts. Please try again later.',
  DEFAULT: 'An unexpected error occurred. Please try again.',
};

export const getAuthErrorMessage = (error: AuthError | any): string => {
  if (!error) return AUTH_ERROR_MESSAGES.DEFAULT;

  // Handle specific Supabase error codes
  switch (error.message) {
    case 'Invalid login credentials':
      return AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS;
    case 'Email not confirmed':
      return AUTH_ERROR_MESSAGES.EMAIL_NOT_CONFIRMED;
    case 'Rate limit exceeded':
      return AUTH_ERROR_MESSAGES.RATE_LIMIT_ERROR;
    default:
      if (error.status === 0) {
        return AUTH_ERROR_MESSAGES.NETWORK_ERROR;
      }
      return error.message || AUTH_ERROR_MESSAGES.DEFAULT;
  }
};