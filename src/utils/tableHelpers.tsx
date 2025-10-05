import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import type { InputRef } from 'antd';
// File: src/utils/tableHelpers.tsx
import type React from 'react';
import type { Key } from 'react';

// Define proper types for Ant Design filter dropdown props
interface FilterDropdownProps {
  setSelectedKeys: (keys: React.Key[]) => void;
  selectedKeys: React.Key[];
  confirm: () => void;
  clearFilters?: () => void;
}

// REUSABLE: Generic function that works with any type that has index signature
// biome-ignore lint/suspicious/noExplicitAny: Required for Ant Design table compatibility
export const createColumnSearchProps = <T extends Record<string, any>>(
  dataIndex: keyof T,
  searchInput: React.RefObject<InputRef>,
  handleSearch: (
    selectedKeys: string[],
    confirm: () => void,
    dataIndex: string,
  ) => void,
  handleReset: (
    clearFilters: (() => void) | undefined,
    dataIndex: string,
  ) => void,
) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }: FilterDropdownProps) => (
    <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
      <Input
        ref={searchInput}
        placeholder={`Search ${String(dataIndex)}`}
        value={selectedKeys[0] as string}
        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() =>
          handleSearch(selectedKeys as string[], confirm, String(dataIndex))
        }
        style={{ marginBottom: 8, display: 'block' }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() =>
            handleSearch(selectedKeys as string[], confirm, String(dataIndex))
          }
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button
          onClick={() => {
            setSelectedKeys([]);
            handleReset(clearFilters, String(dataIndex));
            confirm();
          }}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </Space>
    </div>
  ),
  filterIcon: (filtered: boolean) => (
    <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
  ),
  onFilter: (value: boolean | Key, record: T) =>
    record[dataIndex]
      ?.toString()
      ?.toLowerCase()
      ?.includes(String(value).toLowerCase()) ?? false,

  filterDropdownProps: {
    onOpenChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  },
});

// REUSABLE: Generic search function
// biome-ignore lint/suspicious/noExplicitAny: Required for Ant Design table compatibility
export const searchAcrossColumns = <T extends Record<string, any>>(
  searchTerm: string,
  data: T[],
  searchableFields: (keyof T)[],
): T[] => {
  if (!searchTerm.trim()) {
    return data;
  }

  const lowercaseSearch = searchTerm.toLowerCase();

  return data.filter(item =>
    searchableFields.some(field =>
      item[field]?.toString().toLowerCase().includes(lowercaseSearch),
    ),
  );
};
