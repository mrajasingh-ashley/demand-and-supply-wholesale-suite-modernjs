import { getConfig } from '../config';

// --- INTERFACES ---

// Interface for the RAW data coming directly from your .NET API
export interface ApiItemDefaultCustomer {
  ItemNumber: string;
  DefaultCustomerNumber: string;
  dtea: string;
  usra: string;
}

// Interface for the data shape that your UI component (ItemAssignmentManager) EXPECTS.
// This acts as our "ViewModel" for the frontend.
export interface UiItemAssignment {
  key: string;
  itemId: string;
  itemName: string;
  customerGroup: string;
  assignedDate: string;
  lastModifiedBy: string;
  // biome-ignore lint/suspicious/noExplicitAny: Required for Ant Design table compatibility
  [key: string]: any;
}

// The generic paginated response interface from your API
export interface PagedResponse<T> {
  Items: T[];
  PageNumber: number;
  TotalPages: number;
  TotalCount: number;
  HasPreviousPage: boolean;
  HasNextPage: boolean;
}

// --- API SERVICE ---

export class ItemAssignmentService {
  private getApiUrl(): string {
    const config = getConfig();

    return `${config.API_BASE_URL}/Integration/DPW/ItemDefaultCustomer/Get`;
  }

  async getAllItemAssignments(): Promise<UiItemAssignment[]> {
    const url = this.getApiUrl();
    const params = new URLSearchParams({
      'entity.pageSize': '1000',
    });

    const fullUrl = `${url}?${params.toString()}`;

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const apiResponse: PagedResponse<ApiItemDefaultCustomer> =
      await response.json();

    const mappedItems: UiItemAssignment[] = apiResponse.Items.map(apiItem => ({
      key: `${apiItem.ItemNumber}-${apiItem.DefaultCustomerNumber}-${apiItem.dtea}`,
      itemId: apiItem.ItemNumber,
      assignedDate: new Date(apiItem.dtea).toLocaleString(),
      lastModifiedBy: apiItem.usra,
      itemName: `Item Name for ${apiItem.ItemNumber}`,
      customerGroup: `${apiItem.DefaultCustomerNumber} - CUST_NAME`,
    }));

    return mappedItems;
  }
}

export const itemAssignmentService = new ItemAssignmentService();
