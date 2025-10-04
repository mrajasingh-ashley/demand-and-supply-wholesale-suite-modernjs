import { Typography } from 'antd';
const { Title } = Typography;
export default function ItemLocationOverride() {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Item Location Override</Title>
      <p>This page will be used to manage item location overrides.</p>
      {/* The real component logic, table, and forms will go here. */}
    </div>
  );
}
