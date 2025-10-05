import {
  ExclamationCircleOutlined,
  HomeOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Button, Card, Result, Space, Typography } from 'antd';
import type React from 'react';
import { Component, type ReactNode } from 'react';
import { logger } from '../services';

const { Paragraph, Text } = Typography;

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null | undefined; // Fix: Allow undefined
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state to show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error(
      `React Error Boundary caught an error: ${error.message}`,
      'ErrorBoundary',
      {
        errorType: 'ReactComponentError',
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack,
        componentStack: errorInfo.componentStack,
        errorBoundary: this.constructor.name,
        props: this.props, // Be careful with sensitive data
        state: this.state,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        currentUrl: window.location.href,
      },
    );

    this.setState({
      error,
      errorInfo: errorInfo.componentStack,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div
          style={{
            padding: '50px 24px',
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
          }}
        >
          <Card style={{ maxWidth: 800, margin: '0 auto' }}>
            <Result
              status="error"
              title="Oops! Something went wrong"
              subTitle="We're sorry, but something unexpected happened. Our team has been notified."
              icon={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
              extra={
                <Space direction="vertical" size="middle">
                  <Space>
                    <Button
                      type="primary"
                      icon={<ReloadOutlined />}
                      onClick={this.handleReload}
                    >
                      Reload Page
                    </Button>
                    <Button icon={<HomeOutlined />} onClick={this.handleGoHome}>
                      Go to Home
                    </Button>
                  </Space>

                  {/* Show error details in development */}
                  {(process.env.NODE_ENV === 'development' ||
                    this.props.showDetails) && (
                    <Card
                      title="Error Details (Development Mode)"
                      type="inner"
                      style={{ textAlign: 'left', marginTop: 16 }}
                    >
                      <Paragraph>
                        <Text strong>Error:</Text>
                        <br />
                        <Text code>{this.state.error?.message}</Text>
                      </Paragraph>

                      {this.state.errorInfo && (
                        <Paragraph>
                          <Text strong>Component Stack:</Text>
                          <br />
                          <Text
                            code
                            style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}
                          >
                            {this.state.errorInfo}
                          </Text>
                        </Paragraph>
                      )}
                    </Card>
                  )}
                </Space>
              }
            />
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
