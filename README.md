# Günlük Dostum 📝

Günlük işlerinizi takip etmeniz için bir hatırlatıcı uygulaması. Web ve Android platformlarında çalışır.

## ✨ Özellikler

- ✅ Görev ekleme, silme ve tamamlama
- ⏰ Hatırlatıcı saatleri belirleme
- 🔔 Android native bildirimleri
- 🎨 Modern ve kullanıcı dostu arayüz
- 📱 Hem web hem Android'de çalışır

## 🚀 Web Uygulaması Olarak Çalıştırma

### Gereksinimler:
- Node.js 18 veya üzeri

### Adımlar:

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **Geliştirme sunucusunu başlatın:**
   ```bash
   npm run dev
   ```

3. **Tarayıcınızda açın:**
   ```
   http://localhost:3000
   ```

4. **Production build almak için:**
   ```bash
   npm run build
   ```

## 📱 Android Uygulaması Olarak Çalıştırma

### Gereksinimler:
- Node.js
- Android Studio
- JDK 17 veya üzeri

### Adımlar:

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **Android platformunu ekleyin (sadece ilk kez):**
   ```bash
   npx cap add android
   ```

3. **Projeyi build edin ve Android'e senkronize edin:**
   ```bash
   npm run android:build
   ```

4. **Android Studio'da açın:**
   ```bash
   npm run android:open
   ```

5. **Android Studio'da:**
   - Üst menüden bir emülatör veya cihaz seçin
   - Yeşil "Run" butonuna basın ▶️

### APK Oluşturma:

Android Studio'da:
1. **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**
2. APK dosyası `android/app/build/outputs/apk/` klasöründe oluşur

### Hatırlatıcı Bildirimleri:

Uygulama artık Android native bildirimler kullanıyor. Hatırlatıcı saati geldiğinde sistem bildirimi alırsınız! 🔔

## ⚙️ Yapılandırma

### Gemini API Anahtarı

Uygulama Gemini API kullanıyor. API anahtarınızı `.env.local` dosyasına ekleyin:

```bash
GEMINI_API_KEY=your_api_key_here
```

`.env.local.example` dosyasını `.env.local` olarak kopyalayıp API anahtarınızı ekleyebilirsiniz.

## 🛠️ Teknolojiler

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite 5
- **Mobile:** Capacitor 6
- **Bildirimler:** Capacitor Local Notifications
- **Stil:** Modern CSS

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
