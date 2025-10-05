import { ExperimentOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Space, Typography } from 'antd';
import React, { useState } from 'react';
import { ErrorTestingPanel } from '../components/ErrorTestingPanel';
import { showSuccessNotification } from '../utils/errorHandler';

const { Title, Paragraph, Text } = Typography;

export default function DeveloperTools() {
  const [loading, setLoading] = useState(false);

  const testSuccessNotification = () => {
    showSuccessNotification(
      'Test Success',
      'This is a test success notification!',
    );
  };

  const testMultipleNotifications = () => {
    showSuccessNotification('Success 1', 'First notification');
    setTimeout(() => {
      showSuccessNotification('Success 2', 'Second notification');
    }, 500);
    setTimeout(() => {
      showSuccessNotification('Success 3', 'Third notification');
    }, 1000);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ marginBottom: 0 }}>
        <ExperimentOutlined /> Developer Tools
      </Title>
      <Paragraph style={{ color: '#666', marginBottom: '24px' }}>
        Testing tools and utilities for development and debugging
      </Paragraph>

      <Alert
        message="Development Environment Only"
        description="This page is only available in development mode and will not appear in production builds."
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        style={{ marginBottom: '24px' }}
      />

      {/* Use the reusable ErrorTestingPanel component */}
      <ErrorTestingPanel loading={loading} onLoadingChange={setLoading} />

      {/* Additional Developer Tools */}
      <Card
        title={
          <Space>
            <ExperimentOutlined />
            <span>Notification Testing</span>
          </Space>
        }
        style={{ marginBottom: '16px' }}
      >
        <Paragraph>
          <Text strong>Purpose:</Text> Test different types of notifications and
          their behavior.
        </Paragraph>

        <Space wrap>
          <Button type="primary" onClick={testSuccessNotification}>
            Test Success Notification
          </Button>
          <Button onClick={testMultipleNotifications}>
            Test Multiple Notifications
          </Button>
        </Space>
      </Card>

      {/* Environment Information */}
      <Card
        title={
          <Space>
            <InfoCircleOutlined />
            <span>Environment Information</span>
          </Space>
        }
      >
        <div
          style={{
            fontFamily: 'monospace',
            backgroundColor: '#f5f5f5',
            padding: '16px',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        >
          <div style={{ marginBottom: '8px' }}>
            <strong>NODE_ENV:</strong> {process.env.NODE_ENV}
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Browser:</strong>{' '}
            {navigator.userAgent.split(' ').slice(-2).join(' ')}
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Viewport:</strong> {window.innerWidth} x{' '}
            {window.innerHeight}
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Timestamp:</strong> {new Date().toISOString()}
          </div>
          <div>
            <strong>Local Storage Available:</strong>{' '}
            {typeof Storage !== 'undefined' ? 'Yes' : 'No'}
          </div>
        </div>
      </Card>

      {/* Performance Tools */}
      <Card
        title={
          <Space>
            <ExperimentOutlined />
            <span>Performance Tools</span>
          </Space>
        }
      >
        <Paragraph>
          <Text strong>Purpose:</Text> Tools for testing performance and
          debugging.
        </Paragraph>

        <Space wrap>
          <Button
            onClick={() => {
              console.time('Performance Test');
              setTimeout(() => {
                console.timeEnd('Performance Test');
                showSuccessNotification(
                  'Performance Test',
                  'Check console for timing results',
                );
              }, 100);
            }}
          >
            Test Console Timing
          </Button>
          <Button
            onClick={() => {
              console.log('Window object:', window);
              console.log('Current URL:', window.location.href);
              console.log('Local storage keys:', Object.keys(localStorage));
              showSuccessNotification(
                'Debug Info',
                'Check console for debug information',
              );
            }}
          >
            Log Debug Info
          </Button>
        </Space>
      </Card>
    </div>
  );
}
