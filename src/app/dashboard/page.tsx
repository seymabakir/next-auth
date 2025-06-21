"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

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

  if (!session) {
    return null;
  }
  
  return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {session.user?.name}</span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow">
                <h3 className="font-semibold text-xl text-gray-800 mb-2">Name</h3>
                <p className="text-lg text-blue-500">{session.user?.name}</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow">
                <h3 className="font-semibold text-xl text-gray-800 mb-2">Email</h3>
                <p className="text-lg text-blue-500">{session.user?.email}</p>
              </div>

            <div className="bg-white rounded-xl p-6 shadow">
              <h3 className="font-semibold text-xl text-gray-800 mb-2">Authentication Provider</h3>
              <p className="text-lg text-blue-500">Auth0</p>
            </div> 
    
            <div className="bg-white rounded-xl p-6 shadow">
              <h3 className="font-semibold text-xl text-gray-800 mb-2">Session Status</h3>
              <p className="text-lg text-blue-500">Active</p>
            </div>
          </main>
        </div>
    );
  }
