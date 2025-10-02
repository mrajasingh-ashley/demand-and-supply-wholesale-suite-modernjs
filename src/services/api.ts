// TypeScript interfaces for your data
export interface ItemAssignment {
  key: string;
  itemId: string;
  itemName: string;
  customerGroup: string;
  assignedDate: string;
  lastModifiedBy: string;
}

export interface ActivityLog {
  key: string;
  type: 'assigned' | 'added' | 'removed';
  itemId: string;
  customerGroup: string;
  userName: string;
  timestamp: string;
}

// API service class
export class ApiService {
  private baseURL = 'https://localhost:7001/api'; // Your .NET API URL

  async getItemAssignments(): Promise<ItemAssignment[]> {
    // For now, return mock data
    // Later, replace with: const response = await fetch(`${this.baseURL}/item-assignments`);
    return [
      {
        key: '1',
        itemId: 'IT001',
        itemName: 'Premium Widget',
        customerGroup: '001 - AFICONS',
        assignedDate: '2023-05-12 09:45:22',
        lastModifiedBy: 'john.doe',
      },
      // Add more mock data as needed
    ];
  }

  async getActivityLogs(): Promise<ActivityLog[]> {
    // Mock data for now
    return [
      {
        key: '1',
        type: 'assigned',
        itemId: 'IT002',
        customerGroup: '010 - RHCUST',
        userName: 'jane.smith',
        timestamp: '2023-05-15 14:30:05',
      },
    ];
  }
}

export const apiService = new ApiService();
