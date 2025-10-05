// Main data model (like your C# entity/model classes)
export interface ItemAssignment {
  id: string;
  itemNumber: string;
  description: string;
  category: string;
  defaultCustomer: string;
  status: string;
}

// Sorting configuration (like SortDescription in .NET)
export interface SortConfig {
  field: keyof ItemAssignment; // keyof ensures we can only sort by actual properties
  direction: 'asc' | 'desc';
}

// Pagination configuration (like PagedList in .NET)
export interface PaginationConfig {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
