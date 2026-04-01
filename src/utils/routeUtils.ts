import { MenuItem } from "../types/rbac/MenuItem";
import { fetchUserMenu } from "../services/rbac/menuService";

/**
 * Utility functions for handling user redirects based on RBAC permissions
 */

/**
 * Mapping of RBAC menu codes to actual application routes
 * This ensures that menu codes from the backend map to valid frontend routes
 */
const ROUTE_CODE_MAPPING: Record<string, string> = {
  // Dashboard variations
  'DASH': '/dashboard',
  'dashboard': '/dashboard',
  'Dashboard': '/dashboard',
  'DASHBOARD': '/dashboard',
  
  // Patient variations  
  'PAT': '/patients',
  'PATIENTS': '/patients',
  'patients': '/patients',
  'Patients': '/patients',
  
  // Provider variations
  'PROV': '/providers',
  'PROVIDERS': '/providers', 
  'providers': '/providers',
  'Providers': '/providers',
  
  // Appointment variations
  'APP': '/appointments',
  'APPOINTMENTS': '/appointments',
  'appointments': '/appointments',
  'Appointments': '/appointments',
  
  // Billing variations
  'BILL': '/billing',
  'BILLING': '/billing',
  'billing': '/billing',
  'Billing': '/billing',
  
  // Admin variations
  'ADMIN': '/admin',
  'admin': '/admin',
  'Admin': '/admin',
  
  // Admin sub-modules
  'USERS': '/admin/users',
  'users': '/admin/users',
  'Users': '/admin/users',
  'ROLES': '/admin/roles',
  'roles': '/admin/roles',
  'Roles': '/admin/roles',
  'FEATURES': '/admin/features',
  'features': '/admin/features',
  'Features': '/admin/features',
};

/**
 * List of valid application routes for validation
 */
const VALID_ROUTES = [
  '/dashboard',
  '/patients',
  '/providers', 
  '/appointments',
  '/billing',
  '/admin',
  '/admin/users',
  '/admin/roles', 
  '/admin/features',
  '/admin/role-feature-manager'
];

/**
 * Finds the first accessible route for a user based on their menu permissions
 * @param token JWT token for fetching user permissions
 * @returns Promise resolving to the first accessible route path
 */
export async function getFirstAccessibleRoute(token: string): Promise<string> {
  try {
    console.log('🔍 getFirstAccessibleRoute: Starting...');
    
    // Temporary debug mode - if you want to bypass RBAC completely for testing
    const debugMode = localStorage.getItem('RBAC_DEBUG_BYPASS') === 'true';
    if (debugMode) {
      console.log('🔧 Debug mode: Bypassing RBAC, going to dashboard');
      return '/dashboard';
    }
    
    // Emergency fallback if RBAC is causing issues
    const emergencyMode = localStorage.getItem('RBAC_EMERGENCY_BYPASS') === 'true';
    if (emergencyMode) {
      console.log('🚨 Emergency mode: Complete RBAC bypass, going to dashboard');
      return '/dashboard';
    }
    
    // Check if RBAC is enabled
    const rbacEnabled = import.meta.env.VITE_ENABLE_RBAC !== 'false';
    console.log('🛡️ RBAC enabled:', rbacEnabled);
    
    if (!rbacEnabled) {
      // If RBAC is disabled, default to dashboard
      console.log('📊 RBAC disabled, defaulting to dashboard');
      return '/dashboard';
    }

    // Fetch user's menu permissions
    console.log('📡 Fetching user menu...');
    
    let menuItems: MenuItem[];
    try {
      // Add timeout to prevent hanging
      const menuPromise = fetchUserMenu(token);
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("FETCH_TIMEOUT")), 5000)
      );
      
      menuItems = await Promise.race([menuPromise, timeoutPromise]);
      console.log('📋 Menu items received:', menuItems);
      console.log('📊 Menu items count:', menuItems?.length || 0);
      
      // Log each menu item for debugging
      if (menuItems && menuItems.length > 0) {
        menuItems.forEach((item, index) => {
          console.log(`📋 Menu item ${index + 1}:`, {
            name: item.name,
            code: item.code,
            id: item.id
          });
        });
      }
    } catch (fetchError) {
      console.error('❌ Error fetching menu:', fetchError);
      
      if (fetchError instanceof Error) {
        if (fetchError.message === "FETCH_TIMEOUT") {
          console.warn('⏱️ Menu fetch timed out, using dashboard fallback');
          return '/dashboard';
        }
        
        if (fetchError.message === "UNAUTHORIZED") {
          throw fetchError; // Re-throw auth errors
        }
      }
      
      // For other fetch errors, fallback to dashboard
      console.warn('🔄 Menu fetch failed, using dashboard fallback');
      return '/dashboard';
    }
    
    if (!menuItems || menuItems.length === 0) {
      // If no menu items available, this could be due to:
      // 1. RBAC service being down
      // 2. User having no assigned roles/features
      // 3. Network issues
      
      console.warn('⚠️ No menu items found for user');
      
      // Instead of immediately going to not-authorized, try dashboard first
      // The dashboard route guard will handle the final permission check
      console.log('🎯 Trying dashboard as fallback for user with no menu items');
      return '/dashboard';
    }

    // Find the first accessible route
    console.log('🔍 Finding first accessible path in menu...');
    const firstRoute = findFirstAccessiblePath(menuItems);
    
    if (firstRoute) {
      console.log(`✅ First accessible route found: ${firstRoute}`);
      return firstRoute;
    }

    // If no valid route found in menu, but user has menu items, something is wrong
    // This could happen if menu codes don't map to valid routes
    console.warn('⚠️ User has menu items but no valid routes found');
    console.log('📋 Menu items that failed to map:', menuItems);
    
    // Try dashboard as fallback - let the route guard handle permission check
    console.log('🎯 Falling back to dashboard, route guard will handle permissions');
    return '/dashboard';
    
  } catch (error) {
    console.error('❌ Error getting first accessible route:', error);
    
    // Handle specific RBAC errors
    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") {
        // User is not authenticated, redirect to login
        console.log('🔒 User not authenticated, redirecting to login');
        throw error;
      }
      
      if (error.message === "FORBIDDEN") {
        // User is authenticated but has no permissions
        // Instead of immediately going to not-authorized, try dashboard
        // The route guards will handle the final permission check
        console.warn('🚫 User forbidden but trying dashboard as fallback');
        return '/dashboard';
      }
      
      if (error.message.includes('NETWORK_ERROR') || error.message.includes('SERVICE_ERROR') || error.message === "FETCH_TIMEOUT") {
        // RBAC service is down, check if we should allow dashboard access
        console.warn('⚙️ RBAC service issues, using graceful fallback');
        
        // In case of service issues, we'll be permissive and allow dashboard
        // This prevents users from being locked out due to service problems
        return '/dashboard';
      }
    }
    
    // For other errors, default to dashboard
    console.warn('🔄 Unknown error, defaulting to dashboard');
    return '/dashboard';
  }
}

/**
 * Recursively finds the first path in menu items
 * @param menuItems Array of menu items
 * @returns First accessible path or null
 */
function findFirstAccessiblePath(menuItems: MenuItem[]): string | null {
  console.log('🔍 findFirstAccessiblePath: Searching through menu items:', menuItems);
  
  for (const item of menuItems) {
    console.log('📋 Checking menu item:', item.name, 'code:', item.code);
    
    // If this item has a code (route), try to map it to a real route
    if (item.code && item.code !== '#' && item.code !== '') {
      
      // First try direct mapping
      let path = ROUTE_CODE_MAPPING[item.code];
      
      if (!path) {
        // If no direct mapping, try to construct path
        path = item.code.startsWith('/') ? item.code : `/${item.code.toLowerCase()}`;
      }
      
      // Validate that the path exists in our application
      if (VALID_ROUTES.includes(path)) {
        console.log('✅ Found valid accessible path:', path);
        return path;
      } else {
        console.warn('⚠️ Invalid route found, skipping:', path);
      }
    }
    
    // If this item has children, search recursively
    if (item.children && item.children.length > 0) {
      console.log('🔄 Checking children of:', item.name);
      const childPath = findFirstAccessiblePath(item.children);
      if (childPath) {
        return childPath;
      }
    }
  }
  
  console.log('❌ No valid accessible path found in menu items');
  return null;
}

/**
 * Smart redirect function that redirects users based on their permissions
 * This should be called after successful login instead of hardcoding dashboard redirect
 * @param token JWT token for the authenticated user
 * @param navigate React Router navigate function
 */
export async function smartRedirectAfterLogin(
  token: string, 
  navigate: (path: string) => void
): Promise<void> {
  try {
    console.log('🚀 smartRedirectAfterLogin: Starting...');
    const route = await getFirstAccessibleRoute(token);
    console.log(`🎯 smartRedirectAfterLogin: Redirecting user to: ${route}`);
    navigate(route);
  } catch (error) {
    console.error('❌ smartRedirectAfterLogin: Error during redirect:', error);
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      // Token is invalid, redirect to login
      console.error('🔒 Token invalid during redirect, going to login');
      navigate('/login');
    } else {
      // Other errors, fallback to dashboard
      console.log('🏠 Falling back to dashboard due to error');
      navigate('/dashboard');
    }
  }
}

/**
 * Checks if a user has access to a specific path
 * @param menuItems User's menu items
 * @param path Path to check
 * @returns boolean indicating access
 */
export function hasAccessToPath(menuItems: MenuItem[], path: string): boolean {
  if (!menuItems || menuItems.length === 0) {
    return false;
  }
  
  return checkPathInMenuItems(menuItems, path);
}

/**
 * Recursively checks if a path exists in menu items
 * @param menuItems Array of menu items
 * @param path Path to check
 * @returns boolean indicating if path exists
 */
function checkPathInMenuItems(menuItems: MenuItem[], path: string): boolean {
  for (const item of menuItems) {
    // Try direct mapping first
    let itemPath = ROUTE_CODE_MAPPING[item.code];
    
    if (!itemPath) {
      // Fallback to constructed path
      itemPath = item.code.startsWith('/') ? item.code : `/${item.code.toLowerCase()}`;
    }
    
    if (itemPath === path) {
      return true;
    }
    
    if (item.children && item.children.length > 0) {
      if (checkPathInMenuItems(item.children, path)) {
        return true;
      }
    }
  }
  
  return false;
}