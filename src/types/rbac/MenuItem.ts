/**
 * MenuItem interface representing a menu item from the RBAC service
 * Matches the backend contract from /api/v1/rbac/menus/me endpoint
 */
export interface MenuItem {
  /** Unique identifier for the menu item */
  id: number;
  
  /** Display label for the menu item */
  name: string;
  
  /** Stable route key / path segment used for routing */
  code: string;
  
  /** Descriptive text about the menu item */
  description: string;
  
  /** Sort order (primary sort ascending) */
  sequence: number;
  
  /** Parent menu item ID (0 or missing parent => root level) */
  parentId: number;
  
  /** Child menu items (already hierarchical from backend) */
  children: MenuItem[];
}