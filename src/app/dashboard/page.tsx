"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { withAuth, useAuth } from "@/components/hoc/withAuth";

function DashboardContent() {
  const { data: session, status } = useSession();
  const { isAdmin, isUser, userRole } = useAuth();
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
              <div className="flex items-center space-x-2">
                <span className="text-gray-700">Hoşgeldiniz, {session.user?.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isAdmin 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {userRole}
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800">
                  <strong>Bilgilendirme:</strong> Bu sayfadaki tüm veriler ve istatistikler örnek amaçlı hazırlanmıştır.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-bold text-gray-900 mb-4">
                Kullanıcı Bilgileri
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Ad Soyad</dt>
                  <dd className="mt-1 text-sm text-gray-900">{session.user?.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">E-posta</dt>
                  <dd className="mt-1 text-sm text-gray-900">{session.user?.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Rol</dt>
                  <dd className="mt-1 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isAdmin 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {userRole}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Kimlik Doğrulama</dt>
                  <dd className="mt-1 text-sm text-gray-900">Auth0</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Oturum Durumu</dt>
                  <dd className="mt-1 text-sm text-green-600">Aktif</dd>
                </div>
              </div>
            </div>
          </div>

          {/* Role-specific content */}
          {isAdmin && (
            <div className="mt-8 bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-bold text-gray-900 mb-4">
                  🔧 Admin Özellikleri
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Kullanıcı Yönetimi</h4>
                    <p className="text-gray-600 text-sm mb-3">Sistemdeki tüm kullanıcıları görüntüle, düzenle ve yönet.</p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                      Kullanıcıları Görüntüle
                    </button>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Sistem Ayarları</h4>
                    <p className="text-gray-600 text-sm mb-3">Uygulama ayarlarını ve konfigürasyonları düzenle.</p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                      Ayarları Düzenle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isAdmin && (
            <div className="mt-8 bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-bold text-gray-900 mb-4">
                  👤 Kullanıcı Özellikleri
                </h3>
                <p className="text-gray-600 mb-4">
                  Standart kullanıcı hesabınızla temel özelliklere erişebilirsiniz. 
                  Daha fazla yetki için admin ile iletişime geçin.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Profil Yönetimi</h4>
                    <p className="text-gray-600 text-sm mb-3">Kişisel bilgilerinizi güncelleyin.</p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                      Profili Düzenle
                    </button>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">İşlem Geçmişi</h4>
                    <p className="text-gray-600 text-sm mb-3">Geçmiş işlemlerinizi görüntüleyin.</p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                      Geçmişi Görüntüle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default withAuth(DashboardContent, 'user'); 

