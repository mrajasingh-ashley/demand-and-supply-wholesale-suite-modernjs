// File: src/utils/errorHandler.ts
import { notification } from 'antd';

export interface ErrorInfo {
  message: string;
  type: 'network' | 'auth' | 'permission' | 'server' | 'validation' | 'unknown';
  originalError?: Error;
}

export const parseError = (error: unknown): ErrorInfo => {
  let message = 'An unexpected error occurred.';
  let type: ErrorInfo['type'] = 'unknown';
  let originalError: Error | undefined;

  if (error instanceof Error) {
    originalError = error;

    // Network errors
    if (
      error.message.includes('fetch') ||
      error.message.includes('NetworkError')
    ) {
      message = 'Network error. Please check your connection and try again.';
      type = 'network';
    }
    // HTTP status errors
    else if (error.message.includes('401')) {
      message =
        'Authentication failed. Please refresh the page and log in again.';
      type = 'auth';
    } else if (error.message.includes('403')) {
      message = 'You do not have permission to access this data.';
      type = 'permission';
    } else if (error.message.includes('404')) {
      message = 'The requested resource was not found.';
      type = 'unknown';
    } else if (error.message.includes('500')) {
      message = 'Server error. Please try again later.';
      type = 'server';
    }
    // CORS errors
    else if (error.message.includes('CORS')) {
      message = 'Connection issue. Please contact support.';
      type = 'network';
    } else {
      message = error.message;
    }
  } else if (typeof error === 'string') {
    message = error;
  }

  return { message, type, originalError };
};

export const showErrorNotification = (error: unknown, context?: string) => {
  const errorInfo = parseError(error);

  notification.error({
    message: context ? `Error ${context}` : 'Error',
    description: errorInfo.message,
    duration: 5,
  });

  // Log for debugging
  console.error(
    `Error ${context ? `in ${context}` : ''}:`,
    errorInfo.originalError || error,
  );

  return errorInfo;
};

export const showSuccessNotification = (
  message: string,
  description?: string,
) => {
  notification.success({
    message,
    description,
    duration: 3,
  });
};
