import { Link, Outlet } from '@modern-js/runtime/router';
import { Layout, Menu } from 'antd';
import 'antd/dist/reset.css';

const { Header, Content } = Layout;

export default function AppLayout() {
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
