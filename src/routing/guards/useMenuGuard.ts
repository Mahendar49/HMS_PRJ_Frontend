import * as React from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MenuItem } from "../../types/rbac/MenuItem";
import { useMenu } from "../../state/menuStore";
import { isCodeInMenu } from "../../services/rbac/menuService";

/**
 * Custom hook that guards routes based on user's menu permissions
 * Automatically redirects unauthorized users to a not-authorized page
 * 
 * Usage: Call this hook in your main layout or route components
 * to enable automatic route protection based on RBAC menu permissions
 */
export function useMenuGuard() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const menu = useMenu((state) => state.menu);

  useEffect(() => {
    // Don't check if menu hasn't loaded yet
    if (!menu) return;
    
    // Extract code from pathname (remove leading slash)
    const code = pathname.replace(/^\//, "");
    
    // Allow empty path (home/root)
    if (code === "") return;
    
    // Allow specific paths that don't require menu permissions
    const allowedWithoutPermission = [
      "login",
      "register", 
      "forgot-password",
      "reset-password",
      "not-authorized",
      "404"
    ];
    
    if (allowedWithoutPermission.includes(code)) {
      return;
    }
    
    // For nested paths, check the root segment
    const rootCode = code.split("/")[0];
    
    // Check if user has permission for this route
    if (!isCodeInMenu(menu, code) && !isCodeInMenu(menu, rootCode)) {
      console.warn(`Access denied to route: ${pathname}. Code "${code}" not found in menu.`);
      navigate("/not-authorized", { replace: true });
    }
  }, [pathname, menu, navigate]);
}

/**
 * Hook to check if a specific route code is accessible
 * @param code Menu code to check
 * @returns Boolean indicating if user has access to the code
 */
export function useHasMenuAccess(code: string): boolean {
  const menu = useMenu((state) => state.menu);
  
  if (!menu) return false;
  
  return isCodeInMenu(menu, code);
}

/**
 * Hook to get accessible menu items for a specific parent
 * @param parentCode Parent menu code (optional, returns root items if not specified)
 * @returns Array of accessible menu items
 */
export function useAccessibleMenuItems(parentCode?: string): MenuItem[] {
  const menu = useMenu((state) => state.menu);
  
  if (!menu) return [];
  
  if (!parentCode) {
    return menu; // Return root level items
  }
  
  // Find parent and return its children
  const stack = [...menu];
  while (stack.length) {
    const node = stack.pop()!;
    if (node.code === parentCode) {
      return node.children;
    }
    stack.push(...node.children);
  }
  
  return [];
}

/**
 * Component wrapper that conditionally renders children based on menu access
 */
interface MenuGuardProps {
  /** Menu code required for access */
  code: string;
  /** Content to render if access is granted */
  children: React.ReactNode;
  /** Optional fallback content if access is denied */
  fallback?: React.ReactNode;
  /** If true, hides the component instead of showing fallback */
  hideIfDenied?: boolean;
}

export function MenuGuard({ 
  code, 
  children, 
  fallback = null, 
  hideIfDenied = false 
}: MenuGuardProps) {
  const hasAccess = useHasMenuAccess(code);
  
  if (hasAccess) {
    return React.createElement(React.Fragment, null, children);
  }
  
  if (hideIfDenied) {
    return null;
  }
  
  return React.createElement(React.Fragment, null, fallback);
}