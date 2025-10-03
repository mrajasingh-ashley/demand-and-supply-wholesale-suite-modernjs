import { Link, Outlet } from '@modern-js/runtime/router';
import { Alert, Layout, Menu, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { loadConfig } from '../config'; // Import our loader function
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

  // This hook runs once when the app first loads.
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
  }, []); // The empty array ensures this runs only once.

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

  // --- THIS IS THE "LOADING GATE" ---
  // If the config is not loaded yet, we ONLY render the spinner.
  // The <Outlet /> (and your HomePage) will not be rendered.
  if (!isConfigLoaded) {
    return <AppLoader />;
  }

  const menuItems = [
    {
      key: '/',
      label: <Link to="/">Home</Link>,
    },
    {
      key: '/item-assignments',
      label: <Link to="/item-assignments">Item Assignments</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header>
        <Menu
          theme="dark"
          mode="horizontal"
          items={menuItems}
          style={{ lineHeight: '64px' }}
        />
      </Header>
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
}
