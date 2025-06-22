import { Session } from "next-auth";
import { environmentConfig } from "../config/environment.config";


export interface IAuthService {
  isAuthenticated(session: Session | null): boolean;
  hasRole(session: Session | null, requiredRole: string): boolean;
  getUserRole(session: Session | null): string;
  isAdmin(session: Session | null): boolean;
  isUser(session: Session | null): boolean;
}

class AuthService implements IAuthService {
  isAuthenticated(session: Session | null): boolean {
    return !!session && !!session.user;
  }

  hasRole(session: Session | null, requiredRole: string): boolean {
    if (!this.isAuthenticated(session)) {
      return false;
    }

    const userRole = this.getUserRole(session);
    
    if (requiredRole === 'admin') {
      return userRole === 'admin';
    }
    
    if (requiredRole === 'user') {
      return ['user', 'admin'].includes(userRole);
    }
    
    return userRole === requiredRole;
  }

  getUserRole(session: Session | null): string {
    if (!this.isAuthenticated(session)) {
      return 'guest';
    }
    
    return session?.user?.role || 'user';
  }

  isAdmin(session: Session | null): boolean {
    return this.getUserRole(session) === 'admin';
  }

  isUser(session: Session | null): boolean {
    const role = this.getUserRole(session);
    return role === 'user' || role === 'admin';
  }

  parseAuth0Roles(payload: any): any[] {
    const possibleNamespaces = [
      'https://your-app.com/roles',
      'https://your-app.com/isAdmin',
      'https://your-namespace/roles',
      'https://your-domain/roles',
      'roles',
      'https://your-tenant.auth0.com/roles'
    ];

    console.log('🔍 Checking namespaces for roles...');
    
    for (const namespace of possibleNamespaces) {
      if (payload[namespace] !== undefined) {
        console.log(`Found claim in namespace: ${namespace}`, payload[namespace]);
        
        if (namespace.includes('isAdmin')) {
          const isAdmin = payload[namespace];
          console.log(`isAdmin claim found: ${isAdmin}`);
          const adminRoleId = environmentConfig.get().AUTH0_ADMIN_ROLE_ID;
          const adminRoleName = environmentConfig.get().AUTH0_ADMIN_ROLE_NAME;
          return isAdmin ? [{ id: adminRoleId, name: adminRoleName }] : [];        }
        
        if (namespace.includes('roles')) {
          const roles = Array.isArray(payload[namespace]) ? payload[namespace] : [];
          console.log(`roles claim found:`, roles);
          return roles;
        }
      }
    }

    console.log('No roles found in common namespaces');
    console.log('Available payload keys:', Object.keys(payload));
    return [];
  }

  checkAdminRole(roles: any[]): boolean {
    const adminRoleId = '';
    
    console.log('Checking for admin role...');
    console.log('Admin role ID to check:', adminRoleId);
    console.log('Roles to check:', roles);
    
    const isAdmin = roles.some((role: any) => {
      if (typeof role === 'string') {
        const match = role === adminRoleId || role === 'admin';
        console.log(`String role check: ${role} === ${adminRoleId} or 'admin' = ${match}`);
        return match;
      }
      
      if (typeof role === 'object') {
        const match = role.id === adminRoleId || 
                     role.name === 'admin' || 
                     role.value === adminRoleId ||
                     role.role_id === adminRoleId;
        console.log(`Object role check:`, role, `= ${match}`);
        return match;
      }
      
      return false;
    });
    
    console.log('Final admin check result:', isAdmin);
    return isAdmin;
  }
}

export const authService = new AuthService(); 