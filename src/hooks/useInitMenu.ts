import { useEffect, useCallback } from "react";
import { clearMenuCache, fetchUserMenu } from "../services/rbac/menuService";
import { useMenuActions, useMenuItems, useMenuLoading } from "../state/menuStore";

/**
 * Custom hook that initializes the menu system after authentication
 * Fixed to prevent infinite loops and only fetch once per session
 */
export function useInitMenu() {
  const { setMenu, setLoading, setError, reset } = useMenuActions();
  const currentMenu = useMenuItems();
  const isLoading = useMenuLoading();

  // Use useCallback to create stable functions
  const initializeMenu = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    
    // If no token, reset menu state and return
    if (!token) {
      reset();
      clearMenuCache();
      return;
    }

    // Skip if we're already loading or have menu data
    if (isLoading) {
      return;
    }

    // Skip if we already have menu data (prevents re-fetching on every navigation)
    if (currentMenu !== null) {
      return;
    }

    // Check if RBAC is enabled
    const rbacEnabled = import.meta.env.VITE_ENABLE_RBAC !== 'false';
    if (!rbacEnabled) {
      setMenu([]);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Set a timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("RBAC_TIMEOUT")), 10000)
      );
      
      const menuPromise = fetchUserMenu(token);
      const menuData = await Promise.race([menuPromise, timeoutPromise]);
      
      setMenu((menuData as any) || []);
      setLoading(false);
    } catch (error) {
      console.error("🚨 useInitMenu - Failed to fetch RBAC menu:", error);
      
      // Handle timeout specifically
      if (error instanceof Error && error.message === "RBAC_TIMEOUT") {
        console.warn("⚠️ RBAC menu fetch timed out - using fallback");
        setError("RBAC service timeout - using fallback permissions");
        setMenu([]);
        setLoading(false);
        return;
      }
      
      // Only clear token for actual authentication failures (401)
      if (error instanceof Error && error.message === "UNAUTHORIZED") {
        console.trace("Token removal call stack:");
        localStorage.removeItem("authToken");
        reset();
        clearMenuCache();
        // This will trigger a redirect to login in the App component
        return;
      }
      
      // Handle 403 Forbidden errors - user is authenticated but lacks permissions
      if (error instanceof Error && error.message === "FORBIDDEN") {
        setError("Access denied: You don't have permission to access RBAC menu");
        setMenu([]); // Empty menu triggers static menu fallback
        setLoading(false);
        return;
      }
      
      // Check for other HTTP errors that shouldn't clear token
      if (error instanceof Error && (error as any).status === 403) {
        setError("Access denied: You don't have permission to access RBAC features");
        setMenu([]); // Empty menu triggers static menu fallback
        setLoading(false);
        return;
      }
      
      // For all other errors (network, service down, etc.), just log and continue
      // This allows the app to fall back to static menu without breaking auth
      console.warn("⚠️ useInitMenu - RBAC service error (not auth related):", error);
      setError(`RBAC service unavailable: ${error instanceof Error ? error.message : "Unknown error"}`);
      setMenu([]); // Empty menu triggers static menu fallback
      setLoading(false);
    }
    
  }, [setMenu, setLoading, setError, reset, currentMenu, isLoading]);

  useEffect(() => {
    initializeMenu();
  }, [initializeMenu]);

  // Listen for storage events to handle cross-tab authentication changes
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "authToken") {
        if (event.newValue === null) {
          reset();
          clearMenuCache();
        } else {
          initializeMenu();
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [reset, initializeMenu]);
}

/**
 * Hook to manually refresh the menu (disabled for debugging)
 */
export function useRefreshMenu() {
  const refreshMenu = async () => {
  };

  return refreshMenu;
}
