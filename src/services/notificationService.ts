import { LocalNotifications } from '@capacitor/local-notifications';
import { Todo } from '../types';

export const requestNotificationPermission = async () => {
  const permission = await LocalNotifications.requestPermissions();
  return permission.display === 'granted';
};

// Generate a consistent numeric ID from a UUID string
// Note: Hash collisions are extremely unlikely given UUID uniqueness.
// Even if a collision occurs, it would only affect notification behavior
// (one notification might replace another), which is acceptable for this use case.
const generateNotificationId = (uuid: string): number => {
  // Use a simple hash function to convert UUID to a number
  let hash = 0;
  for (let i = 0; i < uuid.length; i++) {
    const char = uuid.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Ensure positive integer
  return Math.abs(hash);
};

export const scheduleNotification = async (todo: Todo) => {
  if (!todo.reminderTime) return;

  // Validate time format
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
  if (!timeRegex.test(todo.reminderTime)) {
    console.error('Invalid time format. Expected HH:MM');
    return;
  }

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
        id: generateNotificationId(todo.id),
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
  const id = generateNotificationId(todoId);
  await LocalNotifications.cancel({ notifications: [{ id }] });
};
