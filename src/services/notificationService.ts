import { LocalNotifications } from '@capacitor/local-notifications';

export class NotificationService {
  static async requestPermission() {
    try {
      const result = await LocalNotifications.requestPermissions();
      return result.display === 'granted';
    } catch (error) {
      console.error('Bildirim izni hatası:', error);
      return false;
    }
  }

  static async scheduleNotification(id: number, title: string, body: string, scheduledTime: Date) {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id,
            title,
            body,
            schedule: { at: scheduledTime },
            sound: 'default',
            smallIcon: 'ic_stat_icon_config_sample',
            iconColor: '#4F46E5',
            extra: { todoId: id }
          }
        ]
      });
    } catch (error) {
      console.error('Bildirim oluşturma hatası:', error);
    }
  }

  static async cancelNotification(id: number) {
    try {
      await LocalNotifications.cancel({ notifications: [{ id }] });
    } catch (error) {
      console.error('Bildirim iptal hatası:', error);
    }
  }

  static async checkPlatform() {
    const { Capacitor } = await import('@capacitor/core');
    return Capacitor.isNativePlatform();
  }
}
