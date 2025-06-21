"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, ComponentType } from "react";
import { authService } from "@/services/auth.service";

interface WithAuthProps {
  requiredRole?: string;
  redirectTo?: string;
}

export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  { requiredRole, redirectTo = "/auth/signin" }: WithAuthProps = {}
) {
  return function AuthenticatedComponent(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "loading") return;

      if (!authService.isAuthenticated(session)) {
        router.push(redirectTo);
        return;
      }

      if (requiredRole && !authService.hasRole(session, requiredRole)) {
        router.push("/auth/error?error=AccessDenied");
        return;
      }
    }, [session, status, router, requiredRole, redirectTo]);

    if (status === "loading") {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-lg">Loading...</p>
          </div>
        </div>
      );
    }

    if (!authService.isAuthenticated(session)) {
      return null;
    }

    if (requiredRole && !authService.hasRole(session, requiredRole)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
} 