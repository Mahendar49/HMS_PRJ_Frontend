# RBAC Backend Configuration Guide

## Issue Identified
The HMS frontend is working correctly, but the backend HMS service needs to grant RBAC admin permissions to users.

## Current Status
- ✅ HMS service has RBAC endpoints at `localhost:8081/api/v1/rbac/*`
- ✅ Authentication is working (JWT tokens are valid)
- ❌ User accounts (including superadmin) don't have RBAC permissions
- ❌ All RBAC endpoints return 403 Forbidden

## Backend Configuration Needed

### 1. User Role Assignment
The backend needs to assign RBAC admin permissions to users. This typically involves:

**Option A: Database Role Assignment**
```sql
-- Example SQL to grant RBAC permissions
UPDATE users 
SET roles = JSON_ARRAY_APPEND(roles, '$', 'RBAC_ADMIN') 
WHERE username = 'superadmin';

-- Or add RBAC permissions to existing roles
UPDATE roles 
SET permissions = JSON_ARRAY_APPEND(permissions, '$', 'RBAC_MANAGE') 
WHERE role_name IN ('ROLE_SUPER_ADMIN', 'ROLE_ADMIN');
```

**Option B: Application Configuration**
```properties
# application.properties or application.yml
rbac.admin.users=superadmin,admin
rbac.admin.roles=ROLE_SUPER_ADMIN,ROLE_ADMIN
```

### 2. Security Configuration
The RBAC endpoints need to be configured to accept users with appropriate roles:

**Spring Security Example:**
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/v1/rbac/**")
            .hasAnyAuthority("RBAC_ADMIN", "ROLE_SUPER_ADMIN")
            .anyRequest().authenticated()
        );
        return http.build();
    }
}
```

### 3. Service Layer Permissions
The RBAC service methods need to check for appropriate permissions:

```java
@Service
public class RoleService {
    
    @PreAuthorize("hasAuthority('RBAC_ADMIN') or hasRole('SUPER_ADMIN')")
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }
}
```

## Testing the Fix

After backend changes, test with frontend:

1. **Login** as superadmin/admin
2. **Click "⚡ Quick HMS Test"** - should show success
3. **Click "Test Roles API (HMS)"** - should return role data
4. **Click "Test Features API (HMS)"** - should return feature data

## Frontend Changes Made

The frontend now includes:

1. **Permission Guards**: RBAC pages show permission messages instead of errors
2. **Graceful Degradation**: Non-RBAC features continue working
3. **HMS Integration**: All RBAC calls now use HMS service endpoints
4. **Better Error Messages**: Clear indication of permission vs authentication issues

## Next Steps

1. **Backend Developer**: Implement user role/permission assignment
2. **Database Admin**: Grant RBAC permissions to appropriate users  
3. **System Admin**: Configure RBAC security settings
4. **Test**: Verify frontend RBAC functionality after backend changes

## Temporary Workaround

If RBAC features are not immediately needed, the frontend will gracefully show permission messages instead of errors, allowing other HMS features to work normally.