import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUserInjured,
  FaStethoscope,
  FaCalendarAlt,
  FaPills,
  FaFileInvoiceDollar,
  FaUsersCog,
  FaNotesMedical
} from "react-icons/fa";
import { logout } from "../api/authApi";
import { useInitMenu } from "../hooks/useInitMenu";
import { useMenuItems, useMenuError } from "../state/menuStore";
import { MenuTreeWithState } from "./menu/MenuTree";

const mainMenu = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: <FaHome />,
  },
  {
    key: "patients",
    label: "Patients",
    path: "/patients",
    icon: <FaUserInjured />,
  },
  {
    key: "providers",
    label: "Providers",
    path: "/providers",
    icon: <FaStethoscope />,
  },
  {
    key: "appointments",
    label: "Appointments",
    path: "/appointments",
    icon: <FaCalendarAlt />,
  },

  {
  key: "clinicalrecords",
  label: "Clinical Records",
  path: "/clinicalrecords",
  icon: < FaNotesMedical />,
},

 {
    key: "medications",          // ⬅️ new item
    label: "Medications",
    path: "/medications",
    icon: <FaPills />,
  },
  
 {
  key: "careplans",
  label: "Careplans",
  path: "/careplans",             
  icon: <FaNotesMedical />,
},

{
  key: "laborders",
  label: "Lab Orders & Results",
  path: "/laborders",
  icon: <FaNotesMedical />, // or any icon you prefer
},

 {
    key: "insurance",
    label: "Insurance & Claims Processing",
    path: "/insurance",              // base path for this section
    icon: <FaNotesMedical />,        // reuse NotesMedical icon
  },

  {
    key: "billing",
    label: "Billing",
    path: "/billing",
    icon: <FaFileInvoiceDollar />,
  },
  { key: "admin", label: "Admin", path: "/admin", icon: <FaUsersCog /> },
];

const subMenus: Record<string, { label: string; path: string }[]> = {
  dashboard: [{ label: "Overview", path: "/dashboard" }],
  patients: [
    { label: "View", path: "/patients" },
    { label: "Create", path: "/patients/new" },
    { label: "Delete", path: "/patients/delete" },
  ],
  providers: [
    { label: "View", path: "/providers" },
    { label: "Create", path: "/providers/register-provider" },
    { label: "Delete", path: "/providers/delete" },
  ],
  appointments: [
    { label: "Calendar", path: "/appointments" },
    { label: "Create", path: "/appointments/new" },
    { label: "Events", path: "/appointments/events" },
  ],

  clinicalrecords: [
    { label: "Encounters", path: "/clinicalrecords" },
    { label: "Diagnosis", path: "/clinicalrecords/diagnosis" },

     // ➕ ADD THESE
  { label: "Vitals", path: "/clinicalrecords/vitals" },


  { label: "Procedure Logs", path: "/clinicalrecords/procedure-logs" },

  ],

   medications: [
    { label: "Medications",   path: "/medications" },
    { label: "Prescriptions", path: "/medications/prescriptions" },
  ],

  careplans: [
  { label: "Care Plans",         path: "/careplans" }, // base page
  { label: "Patient Care Plans", path: "/careplans/patient-care-plans" },
  { label: "Subscription Plans", path: "/careplans/subscription-plans" },
  { label: "Subscriptions",      path: "/careplans/subscriptions" },
],

laborders: [
  { label: "Lab Orders", path: "/laborders" },
  { label: "Lab Results", path: "/laborders/results" },
],


insurance: [
    { label: "Insurance Providers", path: "/insurance" },
    // later we can add:
     { label: "Patient Insurance", path: "/insurance/patient-insurance" },
     { label: "Insurance Claims", path: "/insurance/claims" },
  ],

  billing: [
    { label: "Invoices", path: "/billing" },
    { label: "Payments", path: "/billing/payments" },
    { label: "Claims", path: "/billing/claims" },
  ],
  admin: [
    { label: "Users", path: "/admin/users" },
    { label: "Roles", path: "/admin/roles" },
    { label: "Features", path: "/admin/features" },
    { label: "RoleFeatureManager", path: "/admin/role-feature-manager" },
  ],
};

/**
 * Path mapping for RBAC menu codes to actual route paths
 */
const pathMapping: Record<string, string> = {
  // Main sections from RBAC service
  DASH: "/dashboard",
  PAT: "/patients",
  PROV: "/providers",
  APT: "/appointments",
  BILL: "/billing",
  ADM: "/admin",
  CLNR: "/clinicalrecords",
  MED: "/medications",
  CP: "/careplans/care-plans",
  LOR:"/laborders",
  IP: "/insurance/providers",
ip: "/insurance/providers",


  // Admin subsections from RBAC service
  USR: "/admin/users",
  RL: "/admin/roles",
  FTR: "/admin/features",
  RFM: "/admin/role-feature-manager",

  // Fallback mappings (lowercase versions)
  dash: "/dashboard",
  pat: "/patients",
  prov: "/providers",
  apt: "/appointments",
  bill: "/billing",
  adm: "/admin",
  usr: "/admin/users",
  rl: "/admin/roles",
  ftr: "/admin/features",
  rfm: "/admin/role-feature-manager",
  clnr: "/clinicalrecords",
  med: "/medications",
  lor:"/laborders",


  // Legacy mappings (just in case)
  dashboard: "/dashboard",
  patients: "/patients",
  providers: "/providers",
  appointments: "/appointments",
  billing: "/billing",
  admin: "/admin",
  users: "/admin/users",
  roles: "/admin/roles",
  features: "/admin/features",
  "role-features": "/admin/role-features",
  "role-feature-manager": "/admin/role-feature-manager",
};

/**
 * Get the correct route path for an RBAC menu code
 */
function getRouteForCode(code: string): string {
  const route = pathMapping[code] || `/${code}`;
  return route;
}

/**
 * Icon mapping for RBAC menu codes
 */
const iconMapping: Record<string, React.ReactNode> = {
  dashboard: <FaHome />,
  patients: <FaUserInjured />,
  providers: <FaStethoscope />,
  appointments: <FaCalendarAlt />,
  billing: <FaFileInvoiceDollar />,
  admin: <FaUsersCog />,
  users: <FaUsersCog />,
  careplans: <FaNotesMedical />,
   insurance: <FaNotesMedical />, // new icon mapping
};

function getIconForCode(code: string): React.ReactNode {
  return iconMapping[code] || <FaUsersCog />;
}

/**
 * Check if user has access to a specific RBAC code
 */
function hasAccessToCode(code: string, rbacMenuItems: any[]): boolean {
  if (!rbacMenuItems || rbacMenuItems.length === 0) return true; // Fallback to static menu behavior

  const hasAccess = rbacMenuItems.some(
    (item) =>
      item.code === code ||
      (item.children && item.children.some((child: any) => child.code === code))
  );

  return hasAccess;
}

export default function LayoutHorizontalHybrid({
  children,
}: {
  children: React.ReactNode;
}) {
  const loc = useLocation();
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  // Initialize RBAC menu
  useInitMenu();
  const rbacMenuItems = useMenuItems();
  const rbacMenuError = useMenuError();

  // Use RBAC menu if available, otherwise fallback to static menu
  const useRBACMenu =
    rbacMenuItems && rbacMenuItems.length > 0 && !rbacMenuError;

  const active = useRBACMenu
    ? rbacMenuItems.find((item) => loc.pathname.startsWith(`/${item.code}`))
        ?.code || "dashboard"
    : mainMenu.find((m) => loc.pathname.startsWith(m.path))?.key || "dashboard";

  const handleLogout = () => {
    logout();
  };

  // Render RBAC menu items using MenuTreeWithState (only show accessible items)
  const renderRBACMenu = () => (
    <MenuTreeWithState
      isHorizontal={true}
      className="d-flex"
      staticSubMenus={subMenus}
      loadingComponent={<span className="text-muted">Loading menu...</span>}
      errorComponent={(error) => (
        <div className="text-warning me-3">
          <i className="bi bi-exclamation-triangle me-1"></i>
          <small>RBAC offline: {error}</small>
        </div>
      )}
      emptyComponent={
        <span className="text-muted">No menu items available</span>
      }
    />
  );

  // Render static menu items
  const renderStaticMenu = () => (
    <>
      {mainMenu.map((m) => (
        <div
          key={m.key}
          style={{ position: "relative", display: "inline-block" }}
          onMouseEnter={() => setHoveredMenu(m.key)}
          onMouseLeave={() => setHoveredMenu(null)}
        >
          <NavLink
            to={m.path}
            className={({ isActive }) =>
              "nav-link " + (isActive ? "active" : "")
            }
          >
            {m.icon}
            <span style={{ marginLeft: 8 }}>{m.label}</span>
          </NavLink>

          {hoveredMenu === m.key && subMenus[m.key] && (
            <div className="hover-dropdown">
              <div className="hover-dropdown-title">Actions</div>
              {subMenus[m.key].map((s) => (
                <NavLink
                  key={s.path}
                  to={s.path}
                  className="hover-dropdown-item"
                  onClick={() => setHoveredMenu(null)}
                >
                  {s.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  );

  // Render sidebar content
  const renderSidebarContent = () => {
    if (useRBACMenu) {
      // Find the active menu based on current path using proper route mapping
      const activeRBACMenu = rbacMenuItems!.find((item) => {
        const itemPath = getRouteForCode(item.code);
        return (
          loc.pathname.startsWith(itemPath) ||
          (item.children &&
            item.children.some((child) => {
              const childPath = getRouteForCode(child.code);
              return loc.pathname === childPath;
            }))
        );
      });

      // Use MenuTreeWithState for sidebar if we have an active menu with children
      if (
        activeRBACMenu &&
        activeRBACMenu.children &&
        activeRBACMenu.children.length > 0
      ) {
        return (
          <>
            <div className="submenu-title">{activeRBACMenu.name}</div>
            <MenuTreeWithState
              isHorizontal={false}
              className="sidebar-menu"
              menuItems={activeRBACMenu.children}
              loadingComponent={
                <div className="p-3 text-muted">Loading submenu...</div>
              }
              errorComponent={() => (
                <div className="p-3 text-muted">Error loading submenu</div>
              )}
              emptyComponent={
                <div className="p-3 text-muted">No submenu items</div>
              }
            />
          </>
        );
      }

      // Fallback to static submenus if no RBAC children or no access to them
      const staticMenuKey = mainMenu.find((m) =>
        loc.pathname.startsWith(m.path)
      )?.key;

      if (staticMenuKey && subMenus[staticMenuKey]) {
        return (
          <>
            <div className="submenu-title">Actions</div>
            {subMenus[staticMenuKey].map(
              (s: { label: string; path: string }) => (
                <NavLink
                  key={s.path}
                  to={s.path}
                  className={({ isActive }) =>
                    "d-block py-2 px-3 text-decoration-none " +
                    (isActive ? "fw-bold text-primary bg-light" : "text-dark")
                  }
                >
                  {s.label}
                </NavLink>
              )
            )}
          </>
        );
      }

      // Show message when no accessible children available
      return (
        <div className="p-3">
          <div className="text-muted">
            <small>
              {activeRBACMenu
                ? `No accessible sub-items for ${activeRBACMenu.name}`
                : "Select a menu item to see options"}
            </small>
          </div>
        </div>
      );
    } else {
      // Static menu sidebar logic (when RBAC is disabled)
      if (subMenus[active]) {
        return (
          <>
            <div className="submenu-title">Actions</div>
            {subMenus[active].map((s: { label: string; path: string }) => (
              <NavLink
                key={s.path}
                to={s.path}
                className={({ isActive }) =>
                  "d-block py-2 px-3 text-decoration-none " +
                  (isActive ? "fw-bold text-primary bg-light" : "text-dark")
                }
              >
                {s.label}
              </NavLink>
            ))}
          </>
        );
      }
    }

    return (
      <div className="p-3">
        <div className="text-muted">
          <small>No accessible menu items</small>
        </div>
      </div>
    );
  };

  return (
    <div>
      <header className="topbar">
        <div className="d-flex align-items-center">
          <div className="brand me-4">HMS</div>
          <nav className="mainmenu" style={{ position: "relative" }}>
            {rbacMenuError && (
              <div className="text-warning me-3">
                <i className="bi bi-exclamation-triangle me-1"></i>
                <small>RBAC offline, using fallback menu</small>
              </div>
            )}
            {useRBACMenu ? renderRBACMenu() : renderStaticMenu()}
          </nav>
        </div>
        <div>
          <button className="btn btn-outline-primary btn-sm me-2">Help</button>
          <button className="btn btn-primary btn-sm" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </header>

      <div className="app-shell">
        <aside className="left-submenu">{renderSidebarContent()}</aside>
        <main className="content">
          {children ? (
            children
          ) : (
            <div className="p-4">
              <div className="alert alert-warning">
                <h5>🔍 Debug Info</h5>
                <p>
                  <strong>Current Path:</strong> {loc.pathname}
                </p>
                <p>
                  <strong>Children Present:</strong> {children ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Using RBAC Menu:</strong> {useRBACMenu ? "Yes" : "No"}
                </p>
                <p>
                  <strong>RBAC Error:</strong> {rbacMenuError || "None"}
                </p>
                <p>
                  If you're seeing this, the route might not be properly
                  configured.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
