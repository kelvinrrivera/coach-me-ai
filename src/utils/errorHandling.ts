import { PostgrestError } from '@supabase/supabase-js';

export class ServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

export function handleSupabaseError(error: any): ServiceError {
  if (error?.code) {
    const pgError = error as PostgrestError;
    return new ServiceError(
      getErrorMessage(pgError),
      pgError.code,
      error
    );
  }
  return new ServiceError(
    error?.message || 'An unexpected error occurred',
    'UNKNOWN_ERROR',
    error
  );
}

function getErrorMessage(error: PostgrestError): string {
  switch (error.code) {
    case '23503':
      return 'This operation failed because a related record does not exist';
    case '23505':
      return 'A record with this information already exists';
    case '42P01':
      return 'The requested data table does not exist. Please ensure the database is properly initialized.';
    case '42703':
      return 'Invalid column name in the request';
    default:
      return error.message || 'An unexpected database error occurred';
  }
}