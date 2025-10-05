import { Button, Card, Space, Typography } from 'antd';
// File: src/components/ErrorTestingPanel.tsx
import type React from 'react';
import { useState } from 'react';
import { useAsyncError } from '../hooks/useAsyncError';

const { Text } = Typography;

interface ErrorTestingPanelProps {
  loading?: boolean;
  onLoadingChange?: (loading: boolean) => void;
}

export const ErrorTestingPanel: React.FC<ErrorTestingPanelProps> = ({
  loading = false,
  onLoadingChange,
}) => {
  const { handleAsyncError, clearError } = useAsyncError();
  const [triggerError, setTriggerError] = useState(false);

  const setLoading = (isLoading: boolean) => {
    onLoadingChange?.(isLoading);
  };

  // Test functions for different error types
  const testAsyncError = async () => {
    try {
      setLoading(true);
      await new Promise((_, reject) => {
        setTimeout(() => {
          reject(
            new Error('Simulated API failure - testing async error handling'),
          );
        }, 2000);
      });
    } catch (err) {
      handleAsyncError(err, 'testing async functionality');
    } finally {
      setLoading(false);
    }
  };

  const testNetworkError = async () => {
    try {
      setLoading(true);
      await new Promise((_, reject) => {
        setTimeout(() => {
          reject(
            new Error('fetch failed - NetworkError when attempting to fetch'),
          );
        }, 1000);
      });
    } catch (err) {
      handleAsyncError(err, 'testing network connectivity');
    } finally {
      setLoading(false);
    }
  };

  const testAuthError = async () => {
    try {
      setLoading(true);
      await new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('API call failed: 401 Unauthorized'));
        }, 1000);
      });
    } catch (err) {
      handleAsyncError(err, 'testing authentication');
    } finally {
      setLoading(false);
    }
  };

  const testServerError = async () => {
    try {
      setLoading(true);
      await new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Server error: 500 Internal Server Error'));
        }, 1000);
      });
    } catch (err) {
      handleAsyncError(err, 'testing server connection');
    } finally {
      setLoading(false);
    }
  };

  // Render error component
  const CrashingComponent = () => {
    if (triggerError) {
      throw new Error('Test error caught by Error Boundary!');
    }
    return null;
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card
      style={{
        marginBottom: '16px',
        backgroundColor: '#fff7e6',
        border: '1px dashed #faad14',
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Text strong style={{ color: '#fa8c16' }}>
          🧪 Error Handling Tests (Development Only)
        </Text>

        <div>
          <Text strong>1. Error Boundary (Render Errors):</Text>
          <br />
          <Text type="secondary">
            These trigger the Error Boundary component
          </Text>
          <br />
          <Space style={{ marginTop: 8 }}>
            <Button danger size="small" onClick={() => setTriggerError(true)}>
              Trigger Render Error
            </Button>
            <Button size="small" onClick={() => setTriggerError(false)}>
              Reset
            </Button>
          </Space>
          <CrashingComponent />
        </div>

        <div>
          <Text strong>2. Async Errors (API/Network Errors):</Text>
          <br />
          <Text type="secondary">
            These trigger your reusable async error handling
          </Text>
          <br />
          <Space wrap style={{ marginTop: 8 }}>
            <Button
              danger
              size="small"
              onClick={testAsyncError}
              loading={loading}
            >
              Generic API Error
            </Button>
            <Button
              danger
              size="small"
              onClick={testNetworkError}
              loading={loading}
            >
              Network Error
            </Button>
            <Button
              danger
              size="small"
              onClick={testAuthError}
              loading={loading}
            >
              Auth Error (401)
            </Button>
            <Button
              danger
              size="small"
              onClick={testServerError}
              loading={loading}
            >
              Server Error (500)
            </Button>
            <Button size="small" onClick={clearError}>
              Clear Error
            </Button>
          </Space>
        </div>
      </Space>
    </Card>
  );
};
