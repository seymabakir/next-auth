# Auth0 + NextAuth.js Authentication System

Bu proje, Auth0 üzerinden kullanıcı girişinin yapıldığı, JWT tabanlı oturum kontrolü ile sayfa erişimi kısıtlanan, SOLID prensiplerine ve 12Factor ilkelerine uygun, Next.js + NextAuth temelli bir kimlik doğrulama ve yetkilendirme sistemidir.

## 🚀 Teknolojiler & Araçlar

- **Next.js 14+** (App Router)
- **Auth0** (OAuth Provider)
- **NextAuth.js** (Authentication Framework)
- **JWT** (JSON Web Token)
- **TypeScript**
- **TailwindCSS**
- **Git / GitHub**

## 📋 Özellikler

- ✅ Auth0 entegrasyonu
- ✅ JWT tabanlı oturum yönetimi
- ✅ Middleware ile sayfa koruma
- ✅ SOLID prensiplerine uygun kod yapısı
- ✅ 12Factor App uyumlu konfigürasyon
- ✅ TypeScript desteği
- ✅ Responsive UI (TailwindCSS)
- ✅ Role-based access control (Admin/User)
- ✅ Custom error handling
- ✅ Admin panel with restricted access

## 🛠️ Kurulum

### 1. Projeyi Klonlayın

```bash
git clone <repository-url>
cd auth0-nextauth-app
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Environment Variables

`.env.local` dosyasını oluşturun ve Auth0 bilgilerinizi ekleyin:

```env
# Auth0 Configuration
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_ISSUER=https://your-domain.auth0.com

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Environment
NODE_ENV=development
```

### 4. Auth0 Kurulumu

1. [Auth0 Dashboard](https://manage.auth0.com/) adresine gidin
2. Yeni bir uygulama oluşturun
3. Application Type: "Regular Web Applications" seçin
4. Settings sekmesinde:
   - Allowed Callback URLs: `http://localhost:3000/api/auth/callback/auth0`
   - Allowed Logout URLs: `http://localhost:3000`
   - Allowed Web Origins: `http://localhost:3000`

### 5. Projeyi Çalıştırın

```bash
npm run dev
```

Proje http://localhost:3000 adresinde çalışacaktır.

## 🛡️ Rol Bazlı Yetkilendirme Sistemi

### Admin Rolü Yönetimi

Bu proje **admin** ve **user** rolleri ile çalışır:

- **Varsayılan Rol:** `user`
- **Admin Erişimi:** `/admin` sayfasına sadece admin rolüne sahip kullanıcılar erişebilir

### Kendinizi Admin Yapmak İçin

#### 1. Auth0 Dashboard'da Rol Oluşturma

1. Auth0 Dashboard'a gidin
2. **User Management** > **Roles** bölümüne gidin
3. **Create Role** butonuna tıklayın
4. Rol bilgilerini girin:
   - **Name:** `admin`
   - **Description:** `Administrator role with full access`
   - **Permissions:** Gerekli izinleri ekleyin
5. **Create** butonuna tıklayın

#### 2. Kullanıcıya Admin Rolü Atama

1. **User Management** > **Users** bölümüne gidin
2. Kendi kullanıcı hesabınızı seçin
3. **Roles** sekmesine gidin
4. **Assign Role** butonuna tıklayın
5. Oluşturduğunuz admin rolünü seçin ve atayın

#### 3. Auth0 Action Oluşturma

Rolleri token'a eklemek için bir Action oluşturmanız gerekiyor:

1. **Actions** > **Flows** > **Login** bölümüne gidin
2. **Add Action** > **Build Custom** butonuna tıklayın
3. Action'a isim verin: `Add User Roles to Token`
4. Aşağıdaki kodu ekleyin:

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://app.com';
  
  // Kullanıcının rollerini al
  const assignedRoles = (event.authorization || {}).roles || [];
  
  // Rolleri token'a ekle
  api.idToken.setCustomClaim(`${namespace}/roles`, assignedRoles);
  api.accessToken.setCustomClaim(`${namespace}/roles`, assignedRoles);
  
  // Admin rolü kontrolü
  const isAdmin = assignedRoles.some(role => 
    role.id === '' || 
    role.name === 'admin'
  );
  
  // Admin claim'i ekle
  api.idToken.setCustomClaim(`${namespace}/isAdmin`, isAdmin);
  api.accessToken.setCustomClaim(`${namespace}/isAdmin`, isAdmin);
};
```

5. **Deploy** butonuna tıklayın
6. Action'ı Login flow'una ekleyin

#### 4. Test Etme

1. Uygulamadan çıkış yapın
2. Tekrar giriş yapın
3. Ana sayfada admin rolü badge'ini kontrol edin
4. `/admin` sayfasına erişebildiğinizi doğrulayın

### Sayfa Erişim Kuralları

| Sayfa | URL | Erişim | Rol Gereksinimi |
|-------|-----|--------|-----------------|
| Ana Sayfa | `/` | Tüm kullanıcılar | Yok |
| Dashboard | `/dashboard` | Giriş yapmış kullanıcılar | User/Admin |
| Admin Panel | `/admin` | Sadece admin | Admin |

## 📁 Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── api/auth/          # NextAuth API routes
│   ├── auth/              # Auth pages (signin, error)
│   ├── dashboard/         # Protected dashboard page
│   ├── admin/             # Admin panel (restricted access)
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── hoc/              # Higher Order Components (withAuth)
│   └── providers/        # Context providers
├── config/               # Configuration files
├── services/             # Business logic services (auth.service.ts)
├── types/                # TypeScript type definitions
└── middleware.ts         # Next.js middleware
```

## 🔐 Authentication Flow

1. **Kullanıcı girişi**: `/auth/signin` sayfasından Auth0 ile giriş
2. **Callback**: Auth0'dan gelen callback `/api/auth/callback/auth0`
3. **JWT Token**: NextAuth.js JWT token oluşturur
4. **Rol Kontrolü**: Auth0'dan gelen roller parse edilir
5. **Middleware**: Her sayfa isteğinde token kontrolü
6. **Protected Routes**: Yetkilendirme kontrolü ile sayfa erişimi

## 🏗️ SOLID Prensipleri

### Single Responsibility Principle (SRP)
- `AuthService`: Sadece authentication işlemleri
- `EnvironmentConfigService`: Sadece konfigürasyon yönetimi

### Open/Closed Principle (OCP)
- `IAuthService` interface ile genişletilebilir yapı
- Provider-based authentication sistemi

### Liskov Substitution Principle (LSP)
- Interface'ler doğru şekilde implement edilmiş

### Interface Segregation Principle (ISP)
- Küçük, spesifik interface'ler
- `IAuthService` sadece auth işlemleri

### Dependency Inversion Principle (DIP)
- Service'ler interface'lere bağımlı
- Dependency injection kullanımı

## 📋 12Factor App Uyumluluğu

### 1. Codebase
- ✅ Tek repository, birden fazla deployment

### 2. Dependencies
- ✅ package.json ile explicit dependency declaration

### 3. Config
- ✅ Environment variables ile konfigürasyon
- ✅ .env.local dosyası

### 4. Backing Services
- ✅ Auth0 external service entegrasyonu

### 5. Build, Release, Run
- ✅ npm scripts ile build process
- ✅ Next.js build sistemi

### 6. Processes
- ✅ Stateless processes
- ✅ Session data JWT ile taşınıyor

### 7. Port Binding
- ✅ PORT environment variable

### 8. Concurrency
- ✅ Next.js concurrent request handling

### 9. Disposability
- ✅ Graceful shutdown support

### 10. Dev/Prod Parity
- ✅ Environment-based configuration

### 11. Logs
- ✅ Console logging
- ✅ Error handling

### 12. Admin Processes
- ✅ npm scripts ile admin tasks

## 🧪 Test

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Type checking
npm run type-check
```

## 🚀 Deployment

### Vercel

```bash
npm run build
vercel --prod
```

## 📝 API Endpoints

- `GET /api/auth/signin` - Sign in page
- `GET /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session

## 🔧 Kullanım Örnekleri

### HOC ile Sayfa Koruması

```typescript
// Admin  için
export default withAuth(AdminComponent, 'admin');

// Kullanıcı sayfası için
export default withAuth(UserComponent, 'user');
```

### Hook ile Rol Kontrolü

```typescript
import { useAuth } from '@/components/hoc/withAuth';

function MyComponent() {
  const { isAdmin, userRole } = useAuth();
  
  return (
    <div>
      {isAdmin && <AdminPanel />}
      <p>Your role: {userRole}</p>
    </div>
  );
}
```

## 🐛 Sorun Giderme

### Rol Atanmıyor
1. Auth0 Action'ın deploy edildiğini kontrol edin
2. Kullanıcıya rol atandığını doğrulayın
3. Namespace'in doğru olduğunu kontrol edin

### Admin Sayfasına Erişim Yok
1. Admin rolü ID'sini veya name'ini kontrol edin
2. Environment variable'ların doğru tanımlandığını kontrol edin
3. Kullanıcıya admin rolü atandığını doğrulayın
4. Uygulamadan çıkış yapıp tekrar giriş yapın

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🆘 Destek

Herhangi bir sorun yaşarsanız:
1. GitHub Issues'da sorun bildirin
2. Documentation'ı kontrol edin
3. Auth0 ve NextAuth.js dokümantasyonlarını inceleyin

## 🔄 Changelog

### v1.0.0
- İlk sürüm
- Auth0 entegrasyonu
- NextAuth.js kurulumu
- Middleware ile sayfa koruma
- SOLID prensipleri uygulaması
- 12Factor App uyumluluğu