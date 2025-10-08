import { BellOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from '@azure/msal-react';
import { Avatar, Badge, Button, Dropdown, Space, Spin, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { useUserProfile } from '../hooks/useUserProfile';
import { logger } from '../services';

const { Text } = Typography;

export const AuthDisplay = () => {
  const { instance, accounts } = useMsal();
  const { profile, loading } = useUserProfile();

  const userName = profile?.displayName || accounts[0]?.name || 'User';
  const userRole =
    profile?.jobTitle || profile?.department || 'Supplier Manager';

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
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => {
        logger.info('User clicked profile', 'Navigation');
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sign Out',
      onClick: handleLogout,
      danger: true,
    },
  ];

  const notificationMenuItems: MenuProps['items'] = [
    {
      key: '1',
      label: 'No new notifications',
    },
  ];

  return (
    <>
      <AuthenticatedTemplate>
        <Space size={20}>
          {/* Notification Bell Icon */}
          <Dropdown
            menu={{ items: notificationMenuItems }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Badge count={0} showZero={false}>
              <BellOutlined
                style={{
                  fontSize: '20px',
                  color: '#595959',
                  cursor: 'pointer',
                }}
              />
            </Badge>
          </Dropdown>

          {/* User Info Section */}
          {loading ? (
            <Spin size="small" />
          ) : (
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Space style={{ cursor: 'pointer' }} size={12}>
                {/* User Avatar */}
                <Avatar
                  style={{
                    backgroundColor: '#f5f5f5',
                    color: '#595959',
                    cursor: 'pointer',
                  }}
                  icon={<UserOutlined />}
                />

                {/* User Name and Role */}
                <div style={{ textAlign: 'left', lineHeight: '1.3' }}>
                  <div>
                    <Text strong style={{ color: '#262626', fontSize: '14px' }}>
                      {userName}
                    </Text>
                  </div>
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {userRole}
                    </Text>
                  </div>
                </div>
              </Space>
            </Dropdown>
          )}
        </Space>
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <Button type="primary" onClick={handleLogin}>
          Sign In
        </Button>
      </UnauthenticatedTemplate>
    </>
  );
};
