import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { MenuItem } from "../../types/rbac/MenuItem";
import { getRouteForCode } from "../../routing/routeRegistry";
import { useMenuItems, useMenuLoading, useMenuError } from "../../state/menuStore";
import {
  FaHome,
  FaUserInjured,
  FaStethoscope,
  FaCalendarAlt,
  FaFileInvoiceDollar,
  FaUsersCog,
} from "react-icons/fa";

/**
 * Props for individual menu node component
 */
interface MenuNodeProps {
  /** Menu item to render */
  item: MenuItem;
  /** Current nesting level (0 = root) */
  level?: number;
  /** Whether to render as horizontal menu */
  isHorizontal?: boolean;
  /** Custom class name for styling */
  className?: string;
  /** Static submenu mappings for fallback */
  staticSubMenus?: Record<string, { label: string; path: string }[]>;
}

/**
 * Get icon for menu code
 */
const getIconForCode = (code: string): React.ReactNode => {
  const iconMapping: Record<string, React.ReactNode> = {
    DASH: <FaHome />,
    dashboard: <FaHome />,
    PAT: <FaUserInjured />,
    patients: <FaUserInjured />,
    PROV: <FaStethoscope />,
    providers: <FaStethoscope />,
    APT: <FaCalendarAlt />,
    appointments: <FaCalendarAlt />,
    BILL: <FaFileInvoiceDollar />,
    billing: <FaFileInvoiceDollar />,
    ADM: <FaUsersCog />,
    admin: <FaUsersCog />,
    USR: <FaUsersCog />,
    users: <FaUsersCog />,
  };
  return iconMapping[code] || <FaUsersCog />;
};

/**
 * Single menu node component with recursive children
 */
const MenuNode: React.FC<MenuNodeProps> = ({ 
  item, 
  level = 0, 
  isHorizontal = false,
  className,
  staticSubMenus 
}) => {
  const path = getRouteForCode(item.code);
  const [isHovered, setIsHovered] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  
  // Check for static submenus if no RBAC children
  const getStaticKey = (code: string, name: string): string => {
    // Map RBAC codes to static menu keys
    const codeToKeyMap: Record<string, string> = {
      'DASH': 'dashboard',
      'PAT': 'patients', 
      'PROV': 'providers',
      'APT': 'appointments',
      'BILL': 'billing',
      'ADM': 'admin',
      'CR' : 'ClinicalRecords'
    };
    return codeToKeyMap[code] || code.toLowerCase() || name.toLowerCase();
  };
  
  const staticKey = getStaticKey(item.code, item.name);
  const staticChildren = staticSubMenus?.[staticKey];
  const hasStaticChildren = !hasChildren && staticChildren && staticChildren.length > 0;
  const shouldShowDropdown = hasChildren || hasStaticChildren;
  
  // Debug logging for development
  if (isHorizontal && level === 0) {
    console.log(`🎯 [MENU-HOVER] Menu item: ${item.name}`, {
      code: item.code,
      staticKey,
      hasChildren,
      hasStaticChildren,
      shouldShowDropdown,
      staticChildrenCount: staticChildren?.length || 0
    });
  }
  
  if (isHorizontal) {
    return (
      <div 
        className="nav-item" 
        style={{ position: "relative", display: "inline-block" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="menuitem"
      >
        <NavLink 
          to={path}
          className={({ isActive }) => 
            `nav-link ${isActive ? 'active' : ''}`
          }
          title={item.description}
        >
          {getIconForCode(item.code)}
          <span style={{ marginLeft: 8 }}>{item.name}</span>
        </NavLink>
        {shouldShowDropdown && isHovered && (
          <div className="hover-dropdown">
            <div className="hover-dropdown-title">{item.name}</div>
            {hasChildren ? (
              // Render RBAC children
              item.children!.map((child) => (
                <NavLink
                  key={child.id}
                  to={getRouteForCode(child.code)}
                  className="hover-dropdown-item"
                  onClick={() => setIsHovered(false)}
                  title={child.description}
                >
                  {child.name}
                </NavLink>
              ))
            ) : (
              // Render static children
              staticChildren!.map((child) => (
                <NavLink
                  key={child.path}
                  to={child.path}
                  className="hover-dropdown-item"
                  onClick={() => setIsHovered(false)}
                >
                  {child.label}
                </NavLink>
              ))
            )}
          </div>
        )}
      </div>
    );
  }

  // Vertical menu (sidebar)
  return (
    <>
      <NavLink 
        to={path}
        className={({ isActive }) => 
          "d-block py-2 px-3 text-decoration-none " +
          (isActive ? "fw-bold text-primary bg-light" : "text-dark")
        }
        title={item.description}
      >
        {item.name}
      </NavLink>
      {hasChildren && (
        <div className="ms-3">
          {item.children!.map((child) => (
            <MenuNode 
              key={child.id}
              item={child}
              level={level + 1}
              isHorizontal={false}
              className={className}
              staticSubMenus={staticSubMenus}
            />
          ))}
        </div>
      )}
    </>
  );
};

/**
 * Props for the main menu tree component
 */
interface MenuTreeProps {
  /** Array of root menu items */
  items: MenuItem[];
  /** Whether to render as horizontal menu */
  isHorizontal?: boolean;
  /** Custom class name for the menu container */
  className?: string;
  /** Custom class name for individual menu items */
  itemClassName?: string;
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
  /** Custom empty state component */
  emptyComponent?: React.ReactNode;
  /** Custom error component */
  errorComponent?: (error: string) => React.ReactNode;
  /** Static submenu mappings for fallback */
  staticSubMenus?: Record<string, { label: string; path: string }[]>;
}

/**
 * Main menu tree component that renders a hierarchical menu
 * Supports both horizontal and vertical layouts
 */
export const MenuTree: React.FC<MenuTreeProps> = ({
  items,
  isHorizontal = false,
  className = "",
  itemClassName = "",
  loadingComponent,
  emptyComponent,
  errorComponent,
  staticSubMenus
}) => {
  // Default loading component
  const defaultLoading = (
    <div className="d-flex justify-content-center p-3">
      <div className="spinner-border spinner-border-sm" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <span className="ms-2">Loading menu...</span>
    </div>
  );

  // Default empty state
  const defaultEmpty = (
    <div className="text-center text-muted p-3">
      <i className="bi bi-exclamation-circle"></i>
      <div className="mt-2">No features available</div>
    </div>
  );

  // Default error state
  const defaultError = (error: string) => (
    <div className="text-center text-danger p-3">
      <i className="bi bi-exclamation-triangle"></i>
      <div className="mt-2">Error loading menu</div>
      <small>{error}</small>
    </div>
  );

  // If no items, show empty state
  if (!items || items.length === 0) {
    return <>{emptyComponent || defaultEmpty}</>;
  }

  // Base classes for the container
  const containerClasses = isHorizontal 
    ? `d-flex ${className}` 
    : `nav nav-pills flex-column ${className}`;

  if (isHorizontal) {
    return (
      <div className={containerClasses} role="navigation" aria-label="Main menu">
        {items.map((item) => (
          <MenuNode
            key={item.id}
            item={item}
            level={0}
            isHorizontal={isHorizontal}
            className={itemClassName}
            staticSubMenus={staticSubMenus}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={containerClasses} role="navigation" aria-label="Main menu">
      {items.map((item) => (
        <MenuNode
          key={item.id}
          item={item}
          level={0}
          isHorizontal={isHorizontal}
          className={itemClassName}
          staticSubMenus={staticSubMenus}
        />
      ))}
    </div>
  );
};

/**
 * Menu tree wrapper with built-in loading, error, and empty states
 * Integrates with the menu store for automatic state management
 */
interface MenuTreeWithStateProps extends Omit<MenuTreeProps, 'items'> {
  /** Override menu items (if not provided, uses store state) */
  menuItems?: MenuItem[];
}

export const MenuTreeWithState: React.FC<MenuTreeWithStateProps> = ({
  menuItems,
  loadingComponent,
  errorComponent,
  emptyComponent,
  ...menuTreeProps
}) => {
  const storeItems = useMenuItems();
  const loading = useMenuLoading();
  const error = useMenuError();

  const items = menuItems || storeItems;

  // Show loading state
  if (loading && (!items || items.length === 0)) {
    return <>{loadingComponent || <div className="d-flex justify-content-center p-3">
      <div className="spinner-border spinner-border-sm" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <span className="ms-2">Loading menu...</span>
    </div>}</>;
  }

  // Show error state
  if (error) {
    const defaultError = (
      <div className="text-center text-danger p-3">
        <i className="bi bi-exclamation-triangle"></i>
        <div className="mt-2">Error loading menu</div>
        <small>{error}</small>
      </div>
    );
    return <>{errorComponent ? errorComponent(error) : defaultError}</>;
  }

  return <MenuTree items={items || []} {...menuTreeProps} />;
};

export default MenuTree;