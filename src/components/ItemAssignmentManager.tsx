import {
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Input,
  Pagination,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type React from 'react';
import { useState } from 'react';

const { Title } = Typography;
const { Search } = Input;

// Define TypeScript interface (similar to C# models)
interface ItemAssignment {
  key: string;
  itemId: string;
  itemName: string;
  customerGroup: string;
  assignedDate: string;
  lastModifiedBy: string;
}

interface ActivityLog {
  key: string;
  type: 'assigned' | 'added' | 'removed';
  itemId: string;
  customerGroup: string;
  userName: string;
  timestamp: string;
}

// Static data (like your screenshot)
const mockData: ItemAssignment[] = [
  {
    key: '1',
    itemId: 'IT001',
    itemName: 'Premium Widget',
    customerGroup: '001 - AFICONS',
    assignedDate: '2023-05-12 09:45:22',
    lastModifiedBy: 'john.doe',
  },
  {
    key: '2',
    itemId: 'IT002',
    itemName: 'Standard Gadget',
    customerGroup: '010 - RHCUST',
    assignedDate: '2023-05-15 14:30:05',
    lastModifiedBy: 'jane.smith',
  },
  {
    key: '3',
    itemId: 'IT003',
    itemName: 'Deluxe Component',
    customerGroup: '011 - HSENT',
    assignedDate: '2023-05-18 11:20:37',
    lastModifiedBy: 'robert.johnson',
  },
  {
    key: '4',
    itemId: 'IT004',
    itemName: 'Basic Accessory',
    customerGroup: '012 - HSLUC',
    assignedDate: '2023-05-20 16:15:42',
    lastModifiedBy: 'sarah.williams',
  },
  {
    key: '5',
    itemId: 'IT005',
    itemName: 'Advanced Tool',
    customerGroup: '014 - MASSRENT',
    assignedDate: '2023-05-22 08:50:15',
    lastModifiedBy: 'michael.brown',
  },
  {
    key: '6',
    itemId: 'IT006',
    itemName: 'Premium Service',
    customerGroup: '015 - ECOMM',
    assignedDate: '2023-05-24 13:40:29',
    lastModifiedBy: 'emily.davis',
  },
  {
    key: '7',
    itemId: 'IT007',
    itemName: 'Enterprise Solution',
    customerGroup: '016 - INT',
    assignedDate: '2023-05-26 10:25:18',
    lastModifiedBy: 'david.wilson',
  },
];

// Static activity log data
const mockActivityLogs: ActivityLog[] = [
  {
    key: '1',
    type: 'assigned',
    itemId: 'IT002',
    customerGroup: '010 - RHCUST',
    userName: 'jane.smith',
    timestamp: '2023-05-15 14:30:05',
  },
  {
    key: '2',
    type: 'added',
    itemId: 'IT007',
    customerGroup: '016 - INT',
    userName: 'david.wilson',
    timestamp: '2023-05-26 10:25:18',
  },
  {
    key: '3',
    type: 'removed',
    itemId: 'IT008',
    customerGroup: '011 - HSENT',
    userName: 'robert.johnson',
    timestamp: '2023-05-24 09:15:33',
  },
];

const ItemAssignmentManager: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(mockData);

  // Handle search functionality
  const handleSearch = (value: string) => {
    setSearchText(value);
    const filtered = mockData.filter(
      item =>
        item.itemName.toLowerCase().includes(value.toLowerCase()) ||
        item.itemId.toLowerCase().includes(value.toLowerCase()) ||
        item.customerGroup.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredData(filtered);
  };

  // Handle edit action
  const handleEdit = (record: ItemAssignment) => {
    console.log('Edit:', record);
    // TODO: Open edit modal/form
  };

  // Handle delete action
  const handleDelete = (record: ItemAssignment) => {
    console.log('Delete:', record);
    // TODO: Show confirmation dialog
  };

  // Table columns definition (similar to Blazor MudTable columns)
  const columns: ColumnsType<ItemAssignment> = [
    {
      title: 'ITEM ID',
      dataIndex: 'itemId',
      key: 'itemId',
      width: 100,
      sorter: (a, b) => a.itemId.localeCompare(b.itemId),
    },
    {
      title: 'ITEM NAME',
      dataIndex: 'itemName',
      key: 'itemName',
      sorter: (a, b) => a.itemName.localeCompare(b.itemName),
    },
    {
      title: 'CUSTOMER GROUP',
      dataIndex: 'customerGroup',
      key: 'customerGroup',
      render: (customerGroup: string) => {
        // Color coding based on customer group (like your screenshot)
        const getTagColor = (group: string) => {
          if (group.includes('AFICONS')) return 'blue';
          if (group.includes('RHCUST')) return 'green';
          if (group.includes('HSENT')) return 'purple';
          if (group.includes('HSLUC')) return 'orange';
          if (group.includes('MASSRENT')) return 'red';
          if (group.includes('ECOMM')) return 'cyan';
          if (group.includes('INT')) return 'geekblue';
          return 'default';
        };

        return <Tag color={getTagColor(customerGroup)}>{customerGroup}</Tag>;
      },
      sorter: (a, b) => a.customerGroup.localeCompare(b.customerGroup),
    },
    {
      title: 'ASSIGNED DATE',
      dataIndex: 'assignedDate',
      key: 'assignedDate',
      width: 180,
      sorter: (a, b) =>
        new Date(a.assignedDate).getTime() - new Date(b.assignedDate).getTime(),
    },
    {
      title: 'LAST MODIFIED BY',
      dataIndex: 'lastModifiedBy',
      key: 'lastModifiedBy',
      width: 150,
      sorter: (a, b) => a.lastModifiedBy.localeCompare(b.lastModifiedBy),
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit Assignment">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          <Tooltip title="Delete Assignment">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
              style={{ color: '#ff4d4f' }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header Section */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, textAlign: 'left' }}>
          Item Assignments
        </Title>
        <p style={{ color: '#666', margin: 0, textAlign: 'left' }}>
          Manage customer group assignments for items
        </p>
      </div>

      {/* Action Bar */}
      <Card style={{ marginBottom: '16px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Space>
            <Search
              placeholder="Search items..."
              allowClear
              style={{ width: 300 }}
              onSearch={handleSearch}
              onChange={e => handleSearch(e.target.value)}
            />
            <Button icon={<FilterOutlined />}>Filter</Button>
          </Space>
          <Button type="primary" icon={<PlusOutlined />}>
            New Assignment
          </Button>
        </div>
      </Card>

      {/* Main Data Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `Showing ${range[0]} of ${total} assignments`,
          }}
          scroll={{ x: 1000 }}
          size="middle"
        />
      </Card>

      {/* Recent Activity Logs Section */}
      <Card title="Recent Activity Logs" style={{ marginTop: '16px' }}>
        <div>
          {mockActivityLogs.map((log, index) => {
            const getActivityIcon = (type: string) => {
              switch (type) {
                case 'assigned':
                  return <EditOutlined style={{ color: '#1890ff' }} />;
                case 'added':
                  return <PlusOutlined style={{ color: '#52c41a' }} />;
                case 'removed':
                  return <DeleteOutlined style={{ color: '#ff4d4f' }} />;
                default:
                  return <EditOutlined />;
              }
            };

            return (
              <div
                key={log.key}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  padding: '8px 0',
                  gap: '12px',
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    fontSize: '16px',
                    marginTop: '2px',
                    minWidth: '16px',
                  }}
                >
                  {getActivityIcon(log.type)}
                </div>

                {/* Main content area - single line with timestamp on right */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    width: '100%',
                  }}
                >
                  {/* Left side - Activity text and user */}
                  <div>
                    {/* Activity description on first line */}
                    <div style={{ marginBottom: '2px' }}>
                      {log.type === 'assigned' && (
                        <>
                          Item <strong>{log.itemId}</strong> assigned to{' '}
                          <Tag color="cyan" style={{ margin: '0 2px' }}>
                            {log.customerGroup}
                          </Tag>
                        </>
                      )}
                      {log.type === 'added' && (
                        <>
                          New Item <strong>{log.itemId}</strong> added to{' '}
                          <Tag color="green" style={{ margin: '0 2px' }}>
                            {log.customerGroup}
                          </Tag>
                        </>
                      )}
                      {log.type === 'removed' && (
                        <>
                          Removed Item <strong>{log.itemId}</strong> from{' '}
                          <Tag color="red" style={{ margin: '0 2px' }}>
                            {log.customerGroup}
                          </Tag>
                        </>
                      )}
                    </div>
                    {/* User info on second line */}
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#8c8c8c',
                        margin: 0,
                        padding: 0,
                        textAlign: 'left',
                      }}
                    >
                      By: {log.userName}
                    </div>
                  </div>

                  {/* Right side - Timestamp */}
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#8c8c8c',
                      whiteSpace: 'nowrap',
                      marginLeft: '16px',
                      alignSelf: 'flex-start',
                    }}
                  >
                    {log.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {/* View All Logs at the bottom */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '16px',
              paddingTop: '8px',
            }}
          >
            <Button type="link" style={{ padding: 0, fontSize: '14px' }}>
              View All Logs
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ItemAssignmentManager;
