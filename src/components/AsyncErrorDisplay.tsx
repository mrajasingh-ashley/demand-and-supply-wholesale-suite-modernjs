import { Button, Result } from 'antd';
import type React from 'react';

interface AsyncErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  title?: string;
  showHomeButton?: boolean;
}

export const AsyncErrorDisplay: React.FC<AsyncErrorDisplayProps> = ({
  error,
  onRetry,
  onGoHome,
  title = 'Something went wrong',
  showHomeButton = true,
}) => {
  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <Result
      status="error"
      title={title}
      subTitle={error}
      extra={[
        onRetry && (
          <Button type="primary" key="retry" onClick={onRetry}>
            Try Again
          </Button>
        ),
        showHomeButton && (
          <Button key="home" onClick={handleGoHome}>
            Go to Home
          </Button>
        ),
      ].filter(Boolean)}
    />
  );
};
