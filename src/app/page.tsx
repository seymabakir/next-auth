"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/hoc/withAuth";

export default function Home() {
  const { data: session, status } = useSession();
  const { isAdmin, userRole } = useAuth();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            NextAuth
          </h1>
        </div>

        {session ? (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                ) : (
                  <span className="text-2xl text-gray-500">
                    {session.user?.name?.charAt(0) || "U"}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Hoş geldin, {session.user?.name}!
              </h2>
              <p className="text-gray-600 mt-1">{session.user?.email}</p>
              
              <div className="mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isAdmin 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {userRole}
                </span>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800">
                    Auth0 ile başarıyla kimlik doğrulaması yapıldı!
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/dashboard"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
              >
                Dashboard'a Git
              </Link>
              
              {isAdmin && (
                <Link
                  href="/admin"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                >
                  Admin Paneli
                </Link>
              )}
              
              
              <button
                onClick={() => signOut()}
                className="w-full bg-red-500 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
              >
                Çıkış Yap
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Rol Bilgileri:</h3>
              <div className="text-xs text-gray-600 space-y-1">
                {isAdmin ? (
                  <>
                    <p>• 🛡️ Admin yetkilerine sahipsiniz</p>
                    <p>• Tüm kullanıcıları yönetebilirsiniz</p>
                    <p>• Sistem ayarlarına erişebilirsiniz</p>
                    <p>• Admin paneline erişebilirsiniz</p>
                  </>
                ) : (
                  <>
                    <p>• 👤 Standart kullanıcı yetkilerine sahipsiniz</p>
                    <p>• Dashboard'a erişebilirsiniz</p>
                    <p>• Kişisel bilgilerinizi yönetebilirsiniz</p>
                    <p>• Admin yetkisi için yönetici ile iletişime geçin</p>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Hoş Geldiniz
              </h2>
              <p className="text-gray-600 mt-1">
                Devam etmek için giriş yapın
              </p>
            </div>

            <button
              onClick={() => signIn("auth0", { prompt: "login" })}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              <span>Auth0 ile Giriş Yap</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
