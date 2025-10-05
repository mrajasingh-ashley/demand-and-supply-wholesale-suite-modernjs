import type { InputRef } from 'antd';
// File: src/hooks/useTableState.ts
import { useRef, useState } from 'react';

export const useTableState = () => {
  const [pageSize, setPageSize] = useState(10);
  const [columnSearchText, setColumnSearchText] = useState<
    Record<string, string>
  >({});
  const [columnSearchedColumn, setColumnSearchedColumn] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const searchInput = useRef<InputRef>(null);

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

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return {
    // State
    pageSize,
    columnSearchText,
    columnSearchedColumn,
    searchTerm,
    searchInput,
    // Setters
    setPageSize,
    setSearchTerm,
    // Handlers
    handleColumnSearch,
    handleColumnReset,
    handleSearch,
    handleSearchChange,
  };
};
