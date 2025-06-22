"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface WithAuthProps {
  requiredRole?: 'admin' | 'user';
  children: React.ReactNode;
}

export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredRole?: 'admin' | 'user'
) => {
  return function WithAuthComponent(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "loading") return;

      if (!session) {
        router.push("/auth/signin");
        return;
      }

      if (requiredRole) {
        const userRole = session.user?.role || 'user';
        
        if (requiredRole === 'admin' && userRole !== 'admin') {
          router.push("/auth/error?error=AccessDenied");
          return;
        }
        
        if (requiredRole === 'user' && !['user', 'admin'].includes(userRole)) {
          router.push("/auth/error?error=AccessDenied");
          return;
        }
      }
    }, [session, status, router, requiredRole]);

    if (status === "loading") {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (!session) {
      return null;
    }

    if (requiredRole) {
      const userRole = session.user?.role || 'user';
      
      if (requiredRole === 'admin' && userRole !== 'admin') {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Erişim Reddedildi</h1>
              <p className="text-gray-600">Bu sayfaya erişim için admin yetkisi gereklidir.</p>
            </div>
          </div>
        );
      }
      
      if (requiredRole === 'user' && !['user', 'admin'].includes(userRole)) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Erişim Reddedildi</h1>
              <p className="text-gray-600">Bu sayfaya erişim için kullanıcı yetkisi gereklidir.</p>
            </div>
          </div>
        );
      }
    }

    return <WrappedComponent {...props} />;
  };
};

export const useAuth = () => {
  const { data: session, status } = useSession();
  
  const isAdmin = session?.user?.role === 'admin';
  const isUser = session?.user?.role === 'user' || session?.user?.role === 'admin';
  const isAuthenticated = !!session;
  
  return {
    session,
    status,
    isAdmin,
    isUser,
    isAuthenticated,
    userRole: session?.user?.role || 'user'
  };
}; 