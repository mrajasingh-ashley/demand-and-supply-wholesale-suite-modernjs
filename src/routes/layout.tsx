import '../styles/antd-overrides.css';
import { Link, Outlet } from '@modern-js/runtime/router';
import { Alert, Button, Layout, Menu, Result, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { loadConfig } from '../config';

import {
  AuthenticatedTemplate,
  MsalProvider,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import { msalInstance } from '../services/authService';

// Import our new AuthDisplay component
import { AuthDisplay } from '../components/AuthDisplay';

import 'antd/dist/reset.css';

const { Header, Content } = Layout;

const AppLoader = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    <Spin size="large">
      {/* We've removed the 'tip' prop and are nesting the content instead */}
      <div style={{ marginTop: '70px', color: '#8c8c8c', fontSize: '14px' }}>
        Loading Configuration...
      </div>
    </Spin>
  </div>
);

export default function AppLayout() {
  const [isConfigLoaded, setConfigLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initializeApp() {
      try {
        await loadConfig();
        setConfigLoaded(true);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(String(error));
        }
      }
    }
    initializeApp();
  }, []);

  if (error) {
    return (
      <Alert
        message="Fatal Error"
        description={`Could not initialize application: ${error}`}
        type="error"
        showIcon
      />
    );
  }

  if (!isConfigLoaded) {
    return <AppLoader />;
  }

  const menuItems = [
    { key: '/', label: <Link to="/">Home</Link> },
    {
      key: '/item-assignments',
      label: <Link to="/item-assignments">Item Assignments</Link>,
    },
    {
      key: '/item-location-override',
      label: <Link to="/item-location-override">Item Location Override</Link>,
    },
    {
      key: '/planning-master-control',
      label: <Link to="/planning-master-control">Planning Master Control</Link>,
    },
  ];

  return (
    <MsalProvider instance={msalInstance}>
      <Layout style={{ minHeight: '100vh' }}>
        <Header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* We only show the menu if the user is authenticated */}
          <AuthenticatedTemplate>
            <Menu
              theme="dark"
              mode="horizontal"
              items={menuItems}
              style={{ lineHeight: '64px', flex: 1, border: 'none' }}
            />
          </AuthenticatedTemplate>

          {/* This component handles showing the login/logout UI */}
          <AuthDisplay />
        </Header>
        <Content>
          {/* This is the main content protection */}
          <AuthenticatedTemplate>
            <Outlet />{' '}
            {/* The actual pages are only rendered if the user is logged in */}
          </AuthenticatedTemplate>

          <UnauthenticatedTemplate>
            <Result
              status="403"
              title="Authentication Required"
              subTitle="Please sign in to access the Demand Planning Web application."
              extra={<AuthDisplay />} // We can reuse the AuthDisplay here for a nice UI
            />
          </UnauthenticatedTemplate>
        </Content>
      </Layout>
    </MsalProvider>
  );
}
