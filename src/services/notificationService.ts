import { LocalNotifications } from '@capacitor/local-notifications';
import { Todo } from '../types';

export const requestNotificationPermission = async () => {
  const permission = await LocalNotifications.requestPermissions();
  return permission.display === 'granted';
};

export const scheduleNotification = async (todo: Todo) => {
  if (!todo.reminderTime) return;

  const granted = await requestNotificationPermission();
  if (!granted) {
    console.log('Notification permission denied');
    return;
  }

  const [hours, minutes] = todo.reminderTime.split(':').map(Number);
  const now = new Date();
  const scheduledTime = new Date(now);
  scheduledTime.setHours(hours, minutes, 0, 0);

  // If time has passed today, schedule for tomorrow
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  await LocalNotifications.schedule({
    notifications: [
      {
        title: '⏰ Hatırlatıcı',
        body: todo.text,
        id: parseInt(todo.id.replace(/\D/g, '').slice(0, 9)),
        schedule: { at: scheduledTime },
        sound: 'default',
        // Note: ic_stat_icon should be added to android/app/src/main/res/drawable/
        // If not provided, Android will use the default notification icon
        smallIcon: 'ic_stat_icon',
        iconColor: '#6366f1'
      }
    ]
  });
};

export const cancelNotification = async (todoId: string) => {
  const id = parseInt(todoId.replace(/\D/g, '').slice(0, 9));
  await LocalNotifications.cancel({ notifications: [{ id }] });
};
