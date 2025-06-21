import { Session } from "next-auth";

export interface IAuthService {
  isAuthenticated(session: Session | null): boolean;
  hasRole(session: Session | null, role: string): boolean;
  getUserId(session: Session | null): string | null;
  getUserEmail(session: Session | null): string | null;
  getUserName(session: Session | null): string | null;
}

export class AuthService implements IAuthService {
  isAuthenticated(session: Session | null): boolean {
    return session !== null && session.user !== undefined;
  }

  hasRole(session: Session | null, role: string): boolean {
    if (!this.isAuthenticated(session)) {
      return false;
    }
    
    const token = session as any;
    const roles = token?.accessToken?.roles || [];
    return roles.includes(role);
  }

  getUserId(session: Session | null): string | null {
    if (!this.isAuthenticated(session) || !session) {
      return null;
    }
    return session.user?.id || null;
  }

  getUserEmail(session: Session | null): string | null {
    if (!this.isAuthenticated(session) || !session) {
      return null;
    }
    return session.user?.email || null;
  }

  getUserName(session: Session | null): string | null {
    if (!this.isAuthenticated(session) || !session) {
      return null;
    }
    return session.user?.name || null;
  }
}

export const authService = new AuthService(); 