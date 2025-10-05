// File: src/services/index.ts
export * from './itemAssignment.service'; // Export all interfaces and classes
import { ItemAssignmentService } from './itemAssignment.service';

// Create a single instance of the service that the whole app can share.
export const itemAssignmentService = new ItemAssignmentService();
