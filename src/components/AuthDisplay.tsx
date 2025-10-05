import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from '@azure/msal-react';
import { Avatar, Button, Dropdown, Space } from 'antd';
import type { MenuProps } from 'antd';
import { logger } from '../services';

export const AuthDisplay = () => {
  const { instance, accounts } = useMsal();
  const userName = accounts[0]?.name || 'User';

  const handleLogin = () => {
    logger.info('User initiated login process', 'Authentication');

    instance.loginRedirect().catch(e => {
      logger.error(
        `Microsoft login redirect failed: ${e.message || 'Unknown error'}`,
        'Authentication',
        {
          errorType: 'LoginRedirectFailure',
          errorCode: e.errorCode,
          errorMessage: e.errorMessage,
          correlationId: e.correlationId,
          stack: e.stack,
          currentUrl: window.location.href,
        },
      );
    });
  };

  const handleLogout = () => {
    logger.info('User initiated logout process', 'Authentication');

    instance.logoutRedirect().catch(e => {
      logger.error(
        `Microsoft logout redirect failed: ${e.message || 'Unknown error'}`,
        'Authentication',
        {
          errorType: 'LogoutRedirectFailure',
          errorCode: e.errorCode,
          errorMessage: e.errorMessage,
          correlationId: e.correlationId,
          stack: e.stack,
          currentUrl: window.location.href,
        },
      );
    });
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sign Out',
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <>
      <AuthenticatedTemplate>
        {/* This content is shown ONLY if the user IS authenticated */}
        <Space>
          <span style={{ color: 'white' }}>Welcome, {userName}</span>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Avatar
              style={{ backgroundColor: '#1890ff', cursor: 'pointer' }}
              icon={<UserOutlined />}
            />
          </Dropdown>
        </Space>
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        {/* This content is shown ONLY if the user IS NOT authenticated */}
        <Button type="primary" onClick={handleLogin}>
          Sign In
        </Button>
      </UnauthenticatedTemplate>
    </>
  );
};
