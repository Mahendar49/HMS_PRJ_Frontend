# HMS Frontend - Role-Based Access Control (RBAC) Menu System

A React-based Hospital Management System frontend with dynamic, role-filtered navigation using RBAC.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Demo Login Credentials

Use the following demo credentials to sign in locally:

- Email: `test@hms.local`
- Password: `Test@1234`

## Frontend Menu Integration

### Overview

The RBAC menu system provides dynamic, hierarchical navigation based on user permissions. The system fetches menu items from a backend service and renders them according to user roles.

### Architecture

- **Backend Service**: `GET http://<rbac_service_host>:8082/api/v1/rbac/menus/me`
- **Frontend Components**: Hierarchical React components with caching and error handling
- **State Management**: Zustand for global menu state
- **Route Protection**: Automatic route guarding based on menu permissions
- **Caching**: Memory and localStorage caching with cross-tab synchronization

### Backend Contract

**Endpoint**: `GET /api/v1/rbac/menus/me`
**Authentication**: Bearer token with JWT containing roles claim
**Response**: JSON array of MenuItem objects

```typescript
interface MenuItem {
  id: number;              // Unique identifier
  name: string;            // Display label
  code: string;            // Route key/path segment
  description: string;     // Descriptive text
  sequence: number;        // Sort order (ascending)
  parentId: number;        // Parent ID (0 = root level)
  children: MenuItem[];    // Pre-built hierarchy
}
```

### Key Features

#### 1. Automatic Menu Initialization
- Fetches menu immediately after authentication
- Restores from cache on page refresh
- Handles token expiration gracefully

#### 2. Hierarchical Navigation
- Supports unlimited nesting levels
- Responsive horizontal/vertical layouts
- Bootstrap-compatible styling

#### 3. Route Protection
- Automatic route guarding based on menu permissions
- Deep linking validation
- Not-authorized page redirection

#### 4. Caching Strategy
- In-memory caching for performance
- localStorage persistence across sessions
- Cross-tab synchronization
- Cache invalidation on logout/role changes

#### 5. Error Handling
- Network error recovery
- Authentication failure handling
- Graceful degradation with empty states
- User-friendly error messages

### Usage Examples

#### Basic Integration

```tsx
import { LayoutRBAC } from './components/LayoutRBAC';
import { useInitMenu } from './hooks/useInitMenu';

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <LayoutRBAC>
            <Dashboard />
          </LayoutRBAC>
        </ProtectedRoute>
      } />
    </Routes>
  );
}
```

#### Menu Component Usage

```tsx
import { MenuTree } from './components/menu/MenuTree';
import { useMenuItems } from './state/menuStore';

function Sidebar() {
  const menuItems = useMenuItems();
  
  return (
    <MenuTree 
      items={menuItems || []}
      isHorizontal={false}
      className="custom-menu"
    />
  );
}
```

#### Route Protection

```tsx
import { MenuGuard } from './routing/guards/useMenuGuard';

function AdminPanel() {
  return (
    <MenuGuard code="admin" fallback={<div>Access Denied</div>}>
      <AdminContent />
    </MenuGuard>
  );
}
```

### File Structure

```
src/
├── types/rbac/
│   └── MenuItem.ts              # TypeScript interfaces
├── services/rbac/
│   └── menuService.ts           # API calls and caching
├── state/
│   └── menuStore.ts             # Zustand state management
├── hooks/
│   └── useInitMenu.ts           # Initialization logic
├── components/menu/
│   └── MenuTree.tsx             # Recursive menu renderer
├── routing/
│   ├── routeRegistry.ts         # Code-to-path mapping
│   └── guards/useMenuGuard.ts   # Route protection
├── components/
│   └── LayoutRBAC.tsx           # RBAC-enabled layout
└── pages/
    └── NotAuthorized.tsx        # Access denied page
```

### Configuration

#### Environment Variables

```env
# RBAC Service URL
VITE_RBAC_BASE_URL=http://localhost:8082/api/v1/rbac
```

#### Route Registry

Update `src/routing/routeRegistry.ts` to map menu codes to routes:

```typescript
export const routesByCode: Record<string, string> = {
  dashboard: "/dashboard",
  patients: "/patients",
  admin: "/admin",
  // Add your routes here
};
```

### Error States

#### 1. UNAUTHORIZED (401/403)
- Clears cache automatically
- Redirects to login
- Shows session expired message

#### 2. Network Errors
- Displays retry option
- Maintains cached data if available
- Non-blocking error indicators

#### 3. Empty Menu
- Shows "No features available" message
- Maintains application functionality
- Provides support contact information

### Performance Considerations

#### 1. Caching Strategy
- Memory cache for immediate access
- localStorage for session persistence
- 60-day TTL on cached data

#### 2. Network Optimization
- Single fetch per session
- Conditional requests with ETags
- Compressed JSON responses

#### 3. Rendering Optimization
- Memoized components for large trees
- Lazy loading for deep hierarchies
- Virtual scrolling for 100+ items

### Testing

#### Unit Tests
```bash
npm run test
```

#### Test Coverage
- Menu service API calls
- Route guard functionality  
- Component rendering
- Error handling scenarios
- Cache management

#### Example Tests
- ✅ Successful menu fetch and parse
- ✅ Empty list response handling
- ✅ 401/403 error handling
- ✅ Route guard denies unauthorized access
- ✅ Recursive renderer displays correct structure

### Troubleshooting

#### Common Issues

1. **Menu not loading**: Check RBAC service URL and authentication token
2. **Routes not protected**: Ensure `useMenuGuard` is called in layout
3. **Cache issues**: Call `clearMenuCache()` after role changes
4. **Cross-tab sync**: localStorage events handle multi-tab scenarios

#### Debug Tools

```javascript
// Check current menu state
console.log(useMenu.getState());

// Force menu refresh
const refreshMenu = useRefreshMenu();
refreshMenu();

// Clear cache manually
clearMenuCache();
```

### Migration Guide

#### From Static to RBAC Menu

1. Replace static menu arrays with `MenuTree` component
2. Add `useInitMenu()` to your main layout
3. Update route definitions in `routeRegistry.ts`
4. Add `useMenuGuard()` for protection
5. Configure RBAC service URL

#### Backward Compatibility

The system maintains compatibility with existing routes while adding RBAC protection. Static menus can coexist during migration.

### API Integration

#### Request Headers
```http
GET /api/v1/rbac/menus/me HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
```

#### Response Format
```json
[
  {
    "id": 1,
    "name": "Dashboard",
    "code": "dashboard", 
    "description": "Main dashboard",
    "sequence": 1,
    "parentId": 0,
    "children": []
  },
  {
    "id": 2,
    "name": "Administration",
    "code": "admin",
    "description": "Admin tools",
    "sequence": 2, 
    "parentId": 0,
    "children": [
      {
        "id": 3,
        "name": "Users",
        "code": "users",
        "description": "User management",
        "sequence": 1,
        "parentId": 2,
        "children": []
      }
    ]
  }
]
```

### Security Considerations

#### 1. Token Handling
- Secure token storage
- Automatic token refresh
- Cross-site scripting protection

#### 2. Route Protection
- Server-side validation required
- Client-side protection is UI-only
- Deep linking verification

#### 3. Cache Security
- No sensitive data in localStorage
- Automatic cache clearing on logout
- Token-based cache validation

### Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

### Contributing

1. Follow TypeScript strict mode
2. Add unit tests for new features
3. Update documentation
4. Follow existing code patterns

### License

MIT License - see LICENSE file for details.
