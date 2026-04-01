import { create } from "zustand";
import { MenuItem } from "../types/rbac/MenuItem";

/**
 * Global menu state interface
 */
interface MenuState {
  /** Current menu items array */
  menu: MenuItem[] | null;
  
  /** Loading state indicator */
  loading: boolean;
  
  /** Error message if menu fetch fails */
  error: string | null;
  
  /** Set the menu items */
  setMenu: (menu: MenuItem[]) => void;
  
  /** Set loading state */
  setLoading: (loading: boolean) => void;
  
  /** Set error message */
  setError: (error: string | null) => void;
  
  /** Reset all state to initial values */
  reset: () => void;
}

/**
 * Zustand store for menu state management with stable action references
 * Fixed to prevent infinite re-renders by ensuring actions are stable
 */
const useMenuStore = create<MenuState>((set) => ({
  menu: null,
  loading: false,
  error: null,
  
  setMenu: (menu: MenuItem[]) => set({ menu, error: null }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error, loading: false }),
  reset: () => set({ 
    menu: null, 
    loading: false, 
    error: null 
  })
}));

// Export the main store
export const useMenu = useMenuStore;

/**
 * Selector hooks for specific state pieces - these are stable
 */
export const useMenuItems = () => useMenuStore((state) => state.menu);
export const useMenuLoading = () => useMenuStore((state) => state.loading);
export const useMenuError = () => useMenuStore((state) => state.error);

// Create a stable selector for actions
export const useMenuActions = () => {
  const store = useMenuStore();
  return {
    setMenu: store.setMenu,
    setLoading: store.setLoading,
    setError: store.setError,
    reset: store.reset
  };
};