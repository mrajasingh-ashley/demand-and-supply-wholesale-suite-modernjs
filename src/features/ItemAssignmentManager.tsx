import {
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Input,
  type InputRef,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { itemAssignmentService } from '../services';
import type { UiItemAssignment } from '../services/itemAssignment.service';
import {
  createColumnSearchProps,
  searchAcrossColumns,
} from '../utils/tableHelpers';

const { Title } = Typography;
const { Search } = Input;

interface ActivityLog {
  key: string;
  type: 'assigned' | 'added' | 'removed';
  itemId: string;
  customerGroup: string;
  userName: string;
  timestamp: string;
}

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

export default function ItemAssignmentManager() {
  const [data, setData] = useState<UiItemAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [columnSearchText, setColumnSearchText] = useState<
    Record<string, string>
  >({});
  const [columnSearchedColumn, setColumnSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<UiItemAssignment[]>([]);

  // Wrap fetchData in useCallback to make it stable for useEffect
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const allData = await itemAssignmentService.getAllItemAssignments();
      setData(allData);
      console.log(`Loaded ${allData.length} records`);
    } catch (err) {
      setError('Failed to fetch item assignments.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since it doesn't depend on any props/state

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      // If no search term, show all data
      setFilteredData(data);
    } else {
      // Filter data using our utility function
      const searchableFields: (keyof UiItemAssignment)[] = [
        'itemId',
        'itemName',
        'customerGroup',
        'assignedDate',
        'lastModifiedBy',
      ];
      const filtered = searchAcrossColumns(searchTerm, data, searchableFields);
      setFilteredData(filtered);
    }
  }, [searchTerm, data]); // Re-run when search term or data changes

  const handleSearch = (value: string) => {
    console.log('Search button clicked with value:', value);
    setSearchTerm(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Search input changed:', e.target.value);
    setSearchTerm(e.target.value);
  };

  // --- ACTIONS ---
  const handleEdit = (record: UiItemAssignment) => console.log('Edit:', record);
  const handleDelete = (record: UiItemAssignment) =>
    console.log('Delete:', record);

  const handleColumnSearch = (
    selectedKeys: string[],
    confirm: () => void,
    dataIndex: string,
  ) => {
    confirm();
    setColumnSearchText(prev => ({
      ...prev,
      [dataIndex]: selectedKeys[0] || '',
    }));
    setColumnSearchedColumn(dataIndex);
  };

  const handleColumnReset = (
    clearFilters: (() => void) | undefined,
    dataIndex: string,
  ) => {
    if (clearFilters) {
      clearFilters();
    }
    setColumnSearchText(prev => ({
      ...prev,
      [dataIndex]: '',
    }));
    setColumnSearchedColumn('');
  };

  // Create the reusable column search props function
  const getColumnSearchProps = (dataIndex: keyof UiItemAssignment) =>
    createColumnSearchProps(
      dataIndex,
      searchInput,
      handleColumnSearch,
      handleColumnReset,
    );

  // --- COLUMNS ---
  // Update your columns in ItemAssignmentManager.tsx
  const columns: ColumnsType<UiItemAssignment> = [
    {
      title: 'ITEM ID',
      dataIndex: 'itemId',
      sorter: (a, b) => (a.itemId || '').localeCompare(b.itemId || ''),
      sortDirections: ['ascend', 'descend'],
      ...getColumnSearchProps('itemId'),
    },
    {
      title: 'ITEM NAME',
      dataIndex: 'itemName',
      sorter: (a, b) => (a.itemName || '').localeCompare(b.itemName || ''),
      sortDirections: ['ascend', 'descend'],
      ...getColumnSearchProps('itemName'),
    },
    {
      title: 'CUSTOMER GROUP',
      dataIndex: 'customerGroup',
      render: text => <Tag color="blue">{text}</Tag>,
      sorter: (a, b) =>
        (a.customerGroup || '').localeCompare(b.customerGroup || ''),
      sortDirections: ['ascend', 'descend'],
      ...getColumnSearchProps('customerGroup'),
    },
    {
      title: 'ASSIGNED DATE',
      dataIndex: 'assignedDate',
      sorter: (a, b) => {
        const dateA = a.assignedDate ? new Date(a.assignedDate).getTime() : 0;
        const dateB = b.assignedDate ? new Date(b.assignedDate).getTime() : 0;
        return dateA - dateB;
      },
      sortDirections: ['ascend', 'descend'],
      ...getColumnSearchProps('assignedDate'),
    },
    {
      title: 'LAST MODIFIED BY',
      dataIndex: 'lastModifiedBy',
      sorter: (a, b) =>
        (a.lastModifiedBy || '').localeCompare(b.lastModifiedBy || ''),
      sortDirections: ['ascend', 'descend'],
      ...getColumnSearchProps('lastModifiedBy'),
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          <Tooltip title="Delete">
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
      <Title level={2} style={{ marginBottom: 0 }}>
        Item Assignments
      </Title>
      <p style={{ color: '#666', marginBottom: '24px' }}>
        Manage customer group assignments for items
      </p>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          style={{ marginBottom: '16px' }}
        />
      )}

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
              placeholder="Search across all columns..."
              onSearch={handleSearch} // When user presses Enter or clicks search icon
              onChange={handleSearchChange} // When user types (real-time)
              value={searchTerm} // Controlled input
              style={{ width: 300 }}
              allowClear // Adds X button to clear
            />
            <Button icon={<FilterOutlined />}>Filter</Button>
          </Space>
          <Button type="primary" icon={<PlusOutlined />}>
            New Assignment
          </Button>
        </div>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          rowKey="key"
          scroll={{
            x: 1000, // Horizontal scroll for wide tables
            y: 500, // Fixed height with vertical scroll
          }}
          pagination={{
            pageSize: pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            onShowSizeChange: (current, size) => {
              console.log('Page size changed to:', size);
              setPageSize(size);
            },
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            position: ['bottomRight'], // Move pagination to bottom center
          }}
          size="small" // Makes rows more compact
        />{' '}
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
}
