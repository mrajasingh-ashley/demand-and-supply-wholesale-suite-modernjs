import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
// File: src/components/AuthDisplay.tsx
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from '@azure/msal-react';
import { Avatar, Button, Dropdown, Space } from 'antd';
import type { MenuProps } from 'antd';

export const AuthDisplay = () => {
  const { instance, accounts } = useMsal();
  const userName = accounts[0]?.name || 'User';

  const handleLogin = () => {
    // This triggers the redirect to the Microsoft login page.
    instance.loginRedirect().catch(e => {
      console.error(e);
    });
  };

  const handleLogout = () => {
    instance.logoutRedirect().catch(e => {
      console.error(e);
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
