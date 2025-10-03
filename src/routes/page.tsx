import {
  ApiOutlined,
  AppstoreOutlined,
  CloudServerOutlined,
  CodeOutlined,
  DatabaseOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Helmet } from '@modern-js/runtime/head';
import { Card, Col, Divider, Row, Space, Tag, Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

export default function HomePage() {
  // Access the environment variable from the build process
  const environment = process.env.NODE_ENV || 'unknown';

  console.log('Current Application Environment:', environment);

  const getEnvColor = (env: string) => {
    switch (env.toLowerCase()) {
      case 'production':
        return 'success'; // Green
      case 'staging':
        return 'warning'; // Orange/Yellow
      case 'development':
        return 'processing'; // Blue
      default:
        return 'default'; // Grey
    }
  };

  const envColor = getEnvColor(environment);

  return (
    <>
      <Helmet>
        <title>Demand Planning Web</title>
      </Helmet>

      <div style={{ padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Title level={1}>
            Demand Planning Web
            <Tag
              color={envColor}
              style={{
                marginLeft: '16px',
                verticalAlign: 'middle',
                fontSize: '14px',
              }}
            >
              {environment.toUpperCase()}
            </Tag>
          </Title>

          <Paragraph style={{ fontSize: '18px', color: '#666' }}>
            Modern React application built with enterprise-grade technologies
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card
              title={
                <Space>
                  <AppstoreOutlined style={{ color: '#61dafb' }} />
                  Frontend Stack
                </Space>
              }
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>Modern.js Framework</Text>
                  <br />
                  <Text type="secondary">
                    Enterprise React framework with SSR support
                  </Text>
                </div>
                <div>
                  <Text strong>React 18 + TypeScript</Text>
                  <br />
                  <Text type="secondary">Type-safe component development</Text>
                </div>
                <div>
                  <Text strong>Ant Design</Text>
                  <br />
                  <Text type="secondary">
                    Professional UI component library
                  </Text>
                </div>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              title={
                <Space>
                  <ApiOutlined style={{ color: '#52c41a' }} />
                  Backend Integration
                </Space>
              }
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>.NET Web API</Text>
                  <br />
                  <Text type="secondary">RESTful API services in C#</Text>
                </div>
                <div>
                  <Text strong>Entity Framework</Text>
                  <br />
                  <Text type="secondary">Database ORM and data access</Text>
                </div>
                <div>
                  <Text strong>SQL Server</Text>
                  <br />
                  <Text type="secondary">Enterprise database solution</Text>
                </div>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              title={
                <Space>
                  <CodeOutlined style={{ color: '#722ed1' }} />
                  Development Tools
                </Space>
              }
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>Visual Studio Code</Text>
                  <br />
                  <Text type="secondary">
                    Modern code editor with extensions
                  </Text>
                </div>
                <div>
                  <Text strong>npm Package Manager</Text>
                  <br />
                  <Text type="secondary">Dependency management</Text>
                </div>
                <div>
                  <Text strong>ESLint + Prettier</Text>
                  <br />
                  <Text type="secondary">Code quality and formatting</Text>
                </div>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              title={
                <Space>
                  <SettingOutlined style={{ color: '#fa8c16' }} />
                  Enterprise Features
                </Space>
              }
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>Server-Side Rendering</Text>
                  <br />
                  <Text type="secondary">Improved performance and SEO</Text>
                </div>
                <div>
                  <Text strong>TypeScript Integration</Text>
                  <br />
                  <Text type="secondary">End-to-end type safety</Text>
                </div>
                <div>
                  <Text strong>Micro-Frontend Ready</Text>
                  <br />
                  <Text type="secondary">Scalable architecture for teams</Text>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        <Divider />

        <Card style={{ marginTop: '24px', backgroundColor: '#fafafa' }}>
          <Title level={3}>Application Features</Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Text strong>• Item-Customer Group Management</Text>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Text strong>• Real-time Activity Tracking</Text>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Text strong>• Advanced Search & Filtering</Text>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Text strong>• Professional UI Components</Text>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Text strong>• Responsive Design</Text>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Text strong>• Enterprise Security</Text>
            </Col>
          </Row>
        </Card>
      </div>
    </>
  );
}
