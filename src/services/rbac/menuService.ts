import { MenuItem } from "../../types/rbac/MenuItem";

/**
 * RBAC Menu Service
 * Handles fetching and caching of user menu items from the RBAC service
 */

const RBAC_BASE_URL = import.meta.env.VITE_RBAC_BASE_URL; // e.g. http://localhost:8082

let cachedMenu: MenuItem[] | null = null;

/**
 * Fetches the user's accessible menu items from the RBAC service
 * @param token JWT token containing user roles
 * @param forceRefresh Whether to bypass cache and fetch fresh data
 * @returns Promise resolving to array of menu items
 * @throws Error with message "UNAUTHORIZED" for 401/403 responses
 * @throws Error with message "MENU_FETCH_FAILED_{status}" for other failures
 */
export async function fetchUserMenu(token: string, forceRefresh = false): Promise<MenuItem[]> {
  // Return cached data if available and not forcing refresh
  if (!forceRefresh && cachedMenu) {
    return cachedMenu;
  }

  if (!RBAC_BASE_URL) {
    console.warn("RBAC_BASE_URL environment variable not configured, skipping menu fetch");
    return [];
  }

  try {
    const response = await fetch(`${RBAC_BASE_URL}/menus/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Handle authentication errors specifically (401 only)
    if (response.status === 401) {
      // Clear cache on auth failure
      clearMenuCache();
      console.error("🚫 RBAC Menu Service Auth Error (401 Unauthorized):", response.status, response.statusText);
      throw new Error("UNAUTHORIZED");
    }

    // Handle authorization errors (403 Forbidden) - don't clear token
    if (response.status === 403) {
      console.warn("🚫 RBAC Menu Service Permission Error (403 Forbidden):", response.status, response.statusText);
      throw new Error("FORBIDDEN");
    }

    if (!response.ok) {
      // For other HTTP errors, don't treat as unauthorized
      console.error("🚨 RBAC Menu Service HTTP Error:", response.status, response.statusText);
      throw new Error(`HTTP_ERROR_${response.status}: ${response.statusText}`);
    }

    const data = (await response.json()) as MenuItem[];
    
    // Normalize menu data to ensure children arrays exist
    data.forEach(normalizeNode);
    
    // Cache the normalized data
    cachedMenu = data;
    
    // Optional: Persist to localStorage for persistence across page reloads
    try {
      localStorage.setItem('rbac_menu_cache', JSON.stringify(data));
    } catch (e) {
      // Ignore localStorage errors (quota exceeded, disabled, etc.)
      console.warn('Could not persist menu to localStorage:', e);
    }
    
    return data;
  } catch (error) {
    // Re-throw authorization errors as-is
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      throw error;
    }
    
    // For network errors, service unavailable, etc.
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`NETWORK_ERROR: Could not connect to RBAC service at ${RBAC_BASE_URL}`);
    }
    
    // For HTTP errors, keep the specific error
    if (error instanceof Error && error.message.startsWith("HTTP_ERROR_")) {
      throw error;
    }
    
    // Wrap other unknown errors
    throw new Error(`SERVICE_ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Normalizes a menu node to ensure children array exists
 * Recursively processes all child nodes
 * @param node MenuItem to normalize
 */
function normalizeNode(node: MenuItem): void {
  if (!Array.isArray(node.children)) {
    node.children = [];
  }
  node.children.forEach(normalizeNode);
}

/**
 * Clears the in-memory and localStorage menu cache
 * Should be called on logout or when user roles change
 */
export function clearMenuCache(): void {
  cachedMenu = null;
  
  try {
    localStorage.removeItem('rbac_menu_cache');
  } catch (e) {
    // Ignore localStorage errors
    console.warn('Could not clear menu cache from localStorage:', e);
  }
}

/**
 * Attempts to restore menu cache from localStorage
 * Useful for maintaining menu state across page refreshes
 * @returns MenuItem array if found and valid, null otherwise
 */
export function restoreMenuCacheFromStorage(): MenuItem[] | null {
  try {
    const cached = localStorage.getItem('rbac_menu_cache');
    if (cached) {
      const data = JSON.parse(cached) as MenuItem[];
      // Validate structure
      if (Array.isArray(data)) {
        data.forEach(normalizeNode);
        cachedMenu = data;
        return data;
      }
    }
  } catch (e) {
    console.warn('Could not restore menu cache from localStorage:', e);
  }
  
  return null;
}

/**
 * Utility function to check if a route code exists in the menu tree
 * @param menu Array of menu items to search
 * @param code Route code to find
 * @returns True if the code exists in the menu tree
 */
export function isCodeInMenu(menu: MenuItem[], code: string): boolean {
  const stack = [...menu];
  while (stack.length) {
    const node = stack.pop()!;
    if (node.code === code) {
      return true;
    }
    stack.push(...node.children);
  }
  return false;
}

/**
 * Utility function to find a menu item by code
 * @param menu Array of menu items to search
 * @param code Route code to find
 * @returns MenuItem if found, null otherwise
 */
export function findMenuItemByCode(menu: MenuItem[], code: string): MenuItem | null {
  const stack = [...menu];
  while (stack.length) {
    const node = stack.pop()!;
    if (node.code === code) {
      return node;
    }
    stack.push(...node.children);
  }
  return null;
}