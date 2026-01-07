import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gunlukdostum.app',
  appName: 'Günlük Dostum',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0f172a",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      splashFullScreen: true,
      splashImmersive: true
    },
    LocalNotifications: {
      // NOTE: Update to your actual icon resource name after adding to Android project
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#4F46E5"
    }
  }
};

export default config;
