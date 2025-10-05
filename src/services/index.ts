/**
 * This is a "barrel" file. Its purpose is to re-export all the public members
 * from the other service files in this directory. This allows other parts of
 * the application to import any service from a single, clean path, like:
 * `import { logger, msalInstance, itemAssignmentService } from '../services';`
 */

// --- Authentication Service ---
// Re-exports the `msalConfig` and `msalInstance` from authService.ts
export * from './authService';

// --- Item Assignment Service ---
// Re-exports the `itemAssignmentService` instance and any interfaces
// (like UiItemAssignment, PagedResponse) from itemAssignment.service.ts
export * from './itemAssignment.service';

// --- Item Location Override Service ---
// Re-exports the `itemLocationoverride` instance and any interfaces
export * from './itemLocationoverride.service';

// --- Logger Service ---
// Re-exports the `logger` singleton instance from logger.ts
export * from './logger';
