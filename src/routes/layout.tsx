import { ErrorBoundary } from '../components/ErrorBoundary';
import '../styles/antd-overrides.css';
import { Link, Outlet, useLocation } from '@modern-js/runtime/router';
import { Alert, Breadcrumb, Layout, Menu, Result, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { loadConfig } from '../config';

import {
  AuthenticatedTemplate,
  MsalProvider,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import { msalInstance } from '../services/authService';

// Import icons for menu
import {
  AppstoreOutlined,
  ControlOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  ToolOutlined,
} from '@ant-design/icons';

// Import our new AuthDisplay component
import { AuthDisplay } from '../components/AuthDisplay';

import 'antd/dist/reset.css';

const { Header, Content, Sider } = Layout;

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
      <div style={{ marginTop: '70px', color: '#8c8c8c', fontSize: '14px' }}>
        Loading Configuration...
      </div>
    </Spin>
  </div>
);

export default function AppLayout() {
  const [isConfigLoaded, setConfigLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

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

  // Menu items for sidebar
  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">Home</Link>,
    },
    {
      key: '/item-assignments',
      icon: <AppstoreOutlined />,
      label: <Link to="/item-assignments">Item Assignments</Link>,
    },
    {
      key: '/item-location-override',
      icon: <EnvironmentOutlined />,
      label: <Link to="/item-location-override">Item Location Override</Link>,
    },
    {
      key: '/planning-master-control',
      icon: <ControlOutlined />,
      label: <Link to="/planning-master-control">Planning Master Control</Link>,
    },
    // Developer tools (only in development)
    ...(process.env.NODE_ENV === 'development'
      ? [
          {
            key: '/developer-tools',
            icon: <ToolOutlined />,
            label: <Link to="/developer-tools">Developer Tools</Link>,
          },
        ]
      : []),
  ];

  // Generate breadcrumb items based on current path
  const generateBreadcrumbs = () => {
    const pathSnippets = location.pathname.split('/').filter(i => i);

    const breadcrumbItems = [
      {
        title: <Link to="/">Home</Link>,
      },
    ];

    pathSnippets.forEach((snippet, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      const label = snippet
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbItems.push({
        title: <Link to={url}>{label}</Link>,
      });
    });

    return breadcrumbItems;
  };

  return (
    <MsalProvider instance={msalInstance}>
      <Layout style={{ minHeight: '100vh' }}>
        {/* Top Header */}
        <Header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#fff',
            padding: '0 24px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          {/* Logo/Brand Area */}
          <div
            style={{ display: 'flex', alignItems: 'center', color: '#001529' }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                background: '#ff6b35',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
                fontWeight: 'bold',
                color: '#fff',
              }}
            >
              A
            </div>
            <span
              style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff6b35' }}
            >
              One Ashley
            </span>
          </div>

          {/* Top Navigation Tabs (like your prototype) */}
          <AuthenticatedTemplate>
            <div style={{ flex: 1, marginLeft: 48 }}>
              {/* You can add top-level tabs here if needed */}
            </div>
          </AuthenticatedTemplate>

          {/* User Area */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <AuthDisplay />
          </div>
        </Header>

        {/* Main Layout with Sidebar */}
        <Layout>
          <AuthenticatedTemplate>
            {/* Left Sidebar */}
            <Sider
              collapsible
              collapsed={collapsed}
              onCollapse={setCollapsed}
              width={240}
              style={{
                background: '#001529',
                borderRight: 'none',
              }}
            >
              <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname]}
                items={menuItems}
                style={{
                  height: '100%',
                  borderRight: 0,
                  background: '#001529',
                }}
              />
            </Sider>
          </AuthenticatedTemplate>

          {/* Content Area */}
          <Layout style={{ padding: '0' }}>
            <AuthenticatedTemplate>
              {/* Breadcrumb */}
              <Breadcrumb
                items={generateBreadcrumbs()}
                style={{
                  margin: '10px 14px',
                  padding: '8px 16px',
                  background: '#fff',
                  borderRadius: '4px',
                }}
              />
            </AuthenticatedTemplate>

            <Content
              style={{
                padding: '0 15px 24px',
                minHeight: 280,
              }}
            >
              <ErrorBoundary>
                <AuthenticatedTemplate>
                  <Outlet />
                </AuthenticatedTemplate>

                <UnauthenticatedTemplate>
                  <Result
                    status="403"
                    title="Authentication Required"
                    subTitle="Please sign in to access the Demand Planning Web application."
                    extra={<AuthDisplay />}
                  />
                </UnauthenticatedTemplate>
              </ErrorBoundary>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </MsalProvider>
  );
}
