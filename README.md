# 📝 Günlük Dostum

AI destekli yapılacaklar listesi ve hatırlatıcı uygulaması. Web ve Android platformları için kullanılabilir.

## 🌟 Özellikler

- ✅ Yapılacaklar listesi yönetimi
- 🔔 Hatırlatıcı bildirimleri (Android)
- 🤖 AI destekli saat önerisi (Gemini AI)
- 💾 Yerel veri saklama (LocalStorage)
- 📱 Mobil uyumlu tasarım
- 🎨 Modern ve kullanıcı dostu arayüz

## 🚀 Web Uygulaması Kurulumu

### Gereksinimler:
- Node.js (18 veya üzeri)
- npm veya yarn

### Kurulum Adımları:

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **Gemini API Key'i ayarlayın:**
   - `.env.local` dosyası oluşturun (`.env.local.example` dosyasını kopyalayın)
   - `GEMINI_API_KEY` değerini kendi API anahtarınızla değiştirin
   - API anahtarı almak için: https://makersuite.google.com/app/apikey

3. **Geliştirme sunucusunu başlatın:**
   ```bash
   npm run dev
   ```

4. **Tarayıcıda açın:**
   - http://localhost:3000

## 📱 Android Uygulaması Kurulumu

### Gereksinimler:
- Node.js (18 veya üzeri)
- Android Studio
- JDK 17

### Kurulum Adımları:

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **Gemini API Key'i ayarlayın:**
   - `.env.local` dosyasına `GEMINI_API_KEY` ekleyin

3. **Android platformunu oluşturun:**
   ```bash
   npm run build
   npx cap add android
   ```

4. **Android Studio'da açın:**
   ```bash
   npm run android:open
   ```

5. **Uygulamayı çalıştırın:**
   - Android Studio'da "Run" butonuna tıklayın
   - Veya terminalden: `npm run android:run`

### Build Komutları:

```bash
# Web uygulamasını build et ve Android'e sync et
npm run android:build

# Android Studio'yu aç
npm run android:open

# Her şeyi yap ve Android Studio'yu aç
npm run android:run

# Sadece Android'i sync et
npm run android:sync
```

### APK Oluşturma:

1. Android Studio'da: `Build > Build Bundle(s) / APK(s) > Build APK(s)`
2. APK dosyası: `android/app/build/outputs/apk/debug/app-debug.apk`

### Google Play Store'a Yükleme:

1. Signed APK oluşturun: `Build > Generate Signed Bundle / APK`
2. Keystore oluşturun (ilk seferinde)
3. Release APK'yı Google Play Console'a yükleyin

## 🛠️ Teknolojiler

- **Frontend:** React + TypeScript + Vite
- **Mobile:** Capacitor
- **AI:** Google Gemini AI
- **Bildirimler:** Capacitor Local Notifications
- **Depolama:** LocalStorage

## 📂 Proje Yapısı

```
gunluk/
├── src/
│   ├── App.tsx                 # Ana uygulama bileşeni
│   ├── main.tsx               # Giriş noktası
│   └── services/
│       └── notificationService.ts  # Bildirim servisi
├── public/
│   ├── icon.svg               # Uygulama ikonu
│   └── splash.svg             # Splash screen
├── android/                   # Android proje dosyaları (auto-generated)
├── capacitor.config.ts        # Capacitor yapılandırması
├── vite.config.ts            # Vite yapılandırması
└── package.json              # Proje bağımlılıkları
```

## 🔧 Geliştirme

### Web Uygulaması:

```bash
# Geliştirme sunucusu
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Android Uygulaması:

```bash
# Build ve sync
npm run android:build

# Android Studio'yu aç
npm run android:open

# Sadece sync (kod değişikliklerinden sonra)
npm run android:sync
```

## 🧪 Test Edilmesi Gerekenler:

- ✅ Todo ekleme/silme/tamamlama
- ✅ Bildirimler (permission + scheduled notifications)
- ✅ LocalStorage persistance
- ✅ Gemini API çağrıları
- ✅ UI responsive (mobile viewport)
- ✅ Splash screen görünümü
- ✅ App icon

## 📝 Kullanım

1. **Görev Ekleme:**
   - Metin kutusuna görevinizi yazın
   - İsteğe bağlı olarak hatırlatma saati seçin
   - 🤖 butonuna basarak AI'dan saat önerisi alabilirsiniz
   - "Ekle" butonuna tıklayın

2. **Görev Yönetimi:**
   - ✅ Checkbox ile görevi tamamlayın
   - ⏰ Saat ikonuyla yarına erteleyin (hatırlatıcılı görevler için)
   - 🗑️ Çöp kutusu ikonuyla silin

3. **Bildirimler (Android):**
   - İlk açılışta bildirim izni verilmelidir
   - Belirlenen saatte bildirim gelir
   - Bildirime tıklanarak uygulamaya geçilebilir

## 🔐 Güvenlik

- API anahtarları `.env.local` dosyasında saklanır
- `.env.local` dosyası `.gitignore`'a eklenmiştir
- Production build'de environment variables güvenli şekilde inject edilir

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🙏 Teşekkürler

- Google Gemini AI
- Capacitor Framework
- React & Vite ekiplerine

---

**Geliştirici:** canvar-im  
**Proje:** Günlük Dostum  
**Versiyon:** 1.0.0  

Başarılar! 🚀
