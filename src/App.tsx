import React, { useState, useEffect } from 'react';
import { NotificationService } from './services/notificationService';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  reminderTime?: string;
}

// Helper function to generate consistent notification IDs from todo IDs
const getNotificationId = (todoId: string): number => {
  // Use a simple hash of the UUID to get a consistent number
  let hash = 0;
  for (let i = 0; i < todoId.length; i++) {
    const char = todoId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [reminderValue, setReminderValue] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [loading, setLoading] = useState(false);

  // LocalStorage'dan todo'ları yükle
  useEffect(() => {
    const savedTodos = localStorage.getItem('gunluk-todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Todo'ları LocalStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('gunluk-todos', JSON.stringify(todos));
  }, [todos]);

  // Bildirim izni iste
  useEffect(() => {
    const initNotifications = async () => {
      const isNative = await NotificationService.checkPlatform();
      if (isNative) {
        await NotificationService.requestPermission();
      }
    };
    initNotifications();
  }, []);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue,
      completed: false,
      createdAt: Date.now(),
      reminderTime: reminderValue || undefined
    };
    
    // Bildirim planla
    if (reminderValue) {
      const [hours, minutes] = reminderValue.split(':').map(Number);
      const scheduledDate = new Date();
      scheduledDate.setHours(hours, minutes, 0);
      
      // Eğer saat geçmişse yarına ayarla
      if (scheduledDate.getTime() < Date.now()) {
        scheduledDate.setDate(scheduledDate.getDate() + 1);
      }
      
      const isNative = await NotificationService.checkPlatform();
      if (isNative) {
        await NotificationService.scheduleNotification(
          getNotificationId(newTodo.id),
          'Günlük Dostum Hatırlatıcı',
          newTodo.text,
          scheduledDate
        );
      }
    }
    
    setTodos([newTodo, ...todos]);
    setInputValue('');
    setReminderValue('');
    setAiSuggestion('');
  };

  const deleteTodo = async (id: string) => {
    const isNative = await NotificationService.checkPlatform();
    if (isNative) {
      await NotificationService.cancelNotification(getNotificationId(id));
    }
    setTodos(todos.filter(t => t.id !== id));
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const postponeTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo || !todo.reminderTime) return;

    const [hours, minutes] = todo.reminderTime.split(':').map(Number);
    const newScheduledDate = new Date();
    newScheduledDate.setHours(hours, minutes, 0);
    newScheduledDate.setDate(newScheduledDate.getDate() + 1);

    const isNative = await NotificationService.checkPlatform();
    if (isNative) {
      await NotificationService.cancelNotification(getNotificationId(id));
      await NotificationService.scheduleNotification(
        getNotificationId(id),
        'Günlük Dostum Hatırlatıcı',
        todo.text,
        newScheduledDate
      );
    }
  };

  const getAiSuggestion = async () => {
    if (!inputValue.trim()) return;
    
    setLoading(true);
    try {
      // NOTE: In production, consider using a backend proxy to protect the API key
      // For mobile apps, the key is bundled at build time
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        setAiSuggestion('API anahtarı bulunamadı. Lütfen .env.local dosyasını kontrol edin.');
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Kullanıcının yapılacaklar listesine eklediği "${inputValue}" görevi için uygun bir hatırlatma saati öner. Sadece HH:MM formatında saat öner, başka açıklama yapma. Örnek: 09:00, 14:30, 18:00 gibi.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // HH:MM formatını çıkar
      const timeMatch = text.match(/\d{2}:\d{2}/);
      if (timeMatch) {
        setReminderValue(timeMatch[0]);
        setAiSuggestion(`AI önerisi: ${timeMatch[0]}`);
      } else {
        setAiSuggestion('AI saat önerisi alamadı');
      }
    } catch (error) {
      console.error('AI hatası:', error);
      setAiSuggestion('AI önerisi alınamadı');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>📝 Günlük Dostum</h1>
          <p className="subtitle">AI destekli yapılacaklar listesi</p>
        </header>

        <form onSubmit={addTodo} className="add-form">
          <div className="input-group">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Yeni görev ekle..."
              className="input"
            />
            <input
              type="time"
              value={reminderValue}
              onChange={(e) => setReminderValue(e.target.value)}
              className="time-input"
              title="Hatırlatıcı saati"
            />
            <button 
              type="button" 
              onClick={getAiSuggestion}
              disabled={loading || !inputValue.trim()}
              className="ai-button"
              title="AI'dan saat önerisi al"
            >
              {loading ? '⏳' : '🤖'}
            </button>
            <button type="submit" className="add-button">
              Ekle
            </button>
          </div>
          {aiSuggestion && (
            <div className="ai-suggestion">
              {aiSuggestion}
            </div>
          )}
        </form>

        <div className="todos">
          {todos.length === 0 ? (
            <p className="empty-message">Henüz görev eklenmedi. Hadi başlayalım! 🚀</p>
          ) : (
            todos.map(todo => (
              <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <div className="todo-content">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="checkbox"
                  />
                  <div className="todo-text">
                    <span className="text">{todo.text}</span>
                    {todo.reminderTime && (
                      <span className="reminder-time">
                        🔔 {todo.reminderTime}
                      </span>
                    )}
                  </div>
                </div>
                <div className="todo-actions">
                  {todo.reminderTime && !todo.completed && (
                    <button
                      onClick={() => postponeTodo(todo.id)}
                      className="postpone-button"
                      title="Yarına ertele"
                    >
                      ⏰
                    </button>
                  )}
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="delete-button"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <footer className="footer">
          <p>
            Toplam: {todos.length} | Tamamlanan: {todos.filter(t => t.completed).length}
          </p>
        </footer>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 20px;
        }

        .app {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 100vh;
        }

        .container {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-width: 600px;
          width: 100%;
          padding: 30px;
          margin-top: 20px;
        }

        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f0f0f0;
        }

        .header h1 {
          color: #333;
          font-size: 2.5rem;
          margin-bottom: 10px;
        }

        .subtitle {
          color: #666;
          font-size: 1rem;
        }

        .add-form {
          margin-bottom: 30px;
        }

        .input-group {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }

        .input {
          flex: 1;
          padding: 15px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }

        .input:focus {
          outline: none;
          border-color: #667eea;
        }

        .time-input {
          padding: 15px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          font-size: 1rem;
          min-width: 120px;
        }

        .time-input:focus {
          outline: none;
          border-color: #667eea;
        }

        .ai-button {
          padding: 15px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1.2rem;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .ai-button:hover:not(:disabled) {
          transform: scale(1.05);
        }

        .ai-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .add-button {
          padding: 15px 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .add-button:hover {
          transform: scale(1.05);
        }

        .ai-suggestion {
          padding: 10px;
          background: #f0f9ff;
          border-left: 4px solid #667eea;
          border-radius: 5px;
          color: #333;
          font-size: 0.9rem;
        }

        .todos {
          max-height: 500px;
          overflow-y: auto;
        }

        .empty-message {
          text-align: center;
          color: #999;
          padding: 40px;
          font-size: 1.1rem;
        }

        .todo-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          margin-bottom: 10px;
          background: #f9f9f9;
          border-radius: 10px;
          border: 2px solid transparent;
          transition: all 0.3s;
        }

        .todo-item:hover {
          border-color: #667eea;
          background: #f0f0ff;
        }

        .todo-item.completed {
          opacity: 0.6;
        }

        .todo-item.completed .text {
          text-decoration: line-through;
        }

        .todo-content {
          display: flex;
          align-items: center;
          gap: 15px;
          flex: 1;
        }

        .checkbox {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .todo-text {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .text {
          font-size: 1rem;
          color: #333;
        }

        .reminder-time {
          font-size: 0.85rem;
          color: #667eea;
          font-weight: 500;
        }

        .todo-actions {
          display: flex;
          gap: 10px;
        }

        .postpone-button,
        .delete-button {
          padding: 8px 12px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          transition: transform 0.2s;
          background: transparent;
        }

        .postpone-button:hover,
        .delete-button:hover {
          transform: scale(1.2);
        }

        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #f0f0f0;
          text-align: center;
          color: #666;
        }

        @media (max-width: 600px) {
          .container {
            padding: 20px;
          }

          .header h1 {
            font-size: 2rem;
          }

          .input-group {
            flex-direction: column;
          }

          .time-input {
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
