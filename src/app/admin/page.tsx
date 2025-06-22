"use client";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { withAuth, useAuth } from "@/components/hoc/withAuth";

function AdminContent() {
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

  if (!session || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erişim Reddedildi</h1>
          <p className="text-gray-600">Bu sayfaya erişim için admin yetkisi gereklidir.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-black">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-white">Admin: {session.user?.name}</span>
                <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs font-medium text-white">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-bold text-gray-900 mb-4">
                  👥 Kullanıcı Yönetimi
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Kullanıcı Listesi</h4>
                      <p className="text-sm text-gray-500">Tüm kullanıcıları görüntüle ve yönet</p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                      Görüntüle
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Rol Yönetimi</h4>
                      <p className="text-sm text-gray-500">Kullanıcı rollerini düzenle</p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                      Yönet
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Kullanıcı İstatistikleri</h4>
                      <p className="text-sm text-gray-500">Detaylı kullanıcı analizleri</p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                      Analiz Et
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-bold text-gray-900 mb-4">
                  ⚙️ Sistem Yönetimi
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Sistem Ayarları</h4>
                      <p className="text-sm text-gray-500">Uygulama konfigürasyonları</p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                      Düzenle
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Sistem Logları</h4>
                      <p className="text-sm text-gray-500">Uygulama ve hata logları</p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                      Görüntüle
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Yedekleme</h4>
                      <p className="text-sm text-gray-500">Sistem yedekleme işlemleri</p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                      Yedekle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-bold text-gray-900 mb-4">
                📊 Son Aktiviteler
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Yeni kullanıcı kaydı: <span className="font-medium">kullanıcı@example.com</span></p>
                    <p className="text-xs text-gray-500">2 dakika önce</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Rol güncellemesi: <span className="font-medium">admin</span> rolü atandı</p>
                    <p className="text-xs text-gray-500">15 dakika önce</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Sistem uyarısı: <span className="font-medium">Yüksek CPU kullanımı</span></p>
                    <p className="text-xs text-gray-500">1 saat önce</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Başarılı giriş: <span className="font-medium">admin@example.com</span></p>
                    <p className="text-xs text-gray-500">2 saat önce</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-bold text-gray-900 mb-4">
                 Hızlı İşlemler
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center transition duration-200">
                  <div className="text-2xl mb-2">👤</div>
                  <div className="text-sm font-medium">Kullanıcı Ekle</div>
                </button>
                
                <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-center transition duration-200">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="text-sm font-medium">Rapor Oluştur</div>
                </button>
                
                <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-center transition duration-200">
                  <div className="text-2xl mb-2">🔧</div>
                  <div className="text-sm font-medium">Sistem Bakımı</div>
                </button>
                
                <button className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg text-center transition duration-200">
                  <div className="text-2xl mb-2">🚨</div>
                  <div className="text-sm font-medium">Acil Durum</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default withAuth(AdminContent, 'admin'); 