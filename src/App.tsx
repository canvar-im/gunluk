import React, { useState, useEffect } from 'react';
import { Todo } from './types';
import { scheduleNotification, cancelNotification } from './services/notificationService';
import './index.css';

// Fallback for crypto.randomUUID() in older browsers
const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [reminderValue, setReminderValue] = useState('');

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const newTodo: Todo = {
      id: generateUUID(),
      text: inputValue,
      completed: false,
      createdAt: Date.now(),
      reminderTime: reminderValue || undefined
    };
    
    // Bildirim planla
    if (newTodo.reminderTime) {
      await scheduleNotification(newTodo);
    }
    
    setTodos([newTodo, ...todos]);
    setInputValue('');
    setReminderValue('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = async (id: string) => {
    await cancelNotification(id);
    setTodos(todos.filter(t => t.id !== id));
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">📝 Günlük Dostum</h1>
          <p className="subtitle">Görevlerinizi takip edin, hatırlatıcılar alın</p>
        </header>

        <form onSubmit={addTodo} className="todo-form">
          <div className="form-group">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Yeni görev ekle..."
              className="todo-input"
            />
            <input
              type="time"
              value={reminderValue}
              onChange={(e) => setReminderValue(e.target.value)}
              className="time-input"
              title="Hatırlatıcı saati"
            />
            <button type="submit" className="add-button">
              Ekle
            </button>
          </div>
        </form>

        <div className="stats">
          <div className="stat">
            <span className="stat-label">Toplam:</span>
            <span className="stat-value">{todos.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Tamamlanan:</span>
            <span className="stat-value">{todos.filter(t => t.completed).length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Bekleyen:</span>
            <span className="stat-value">{todos.filter(t => !t.completed).length}</span>
          </div>
        </div>

        <div className="todos-list">
          {todos.length === 0 ? (
            <div className="empty-state">
              <p>Henüz görev eklemediniz. Yukarıdaki formu kullanarak başlayın! 🚀</p>
            </div>
          ) : (
            todos.map(todo => (
              <div
                key={todo.id}
                className={`todo-item ${todo.completed ? 'completed' : ''}`}
              >
                <div className="todo-checkbox">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    id={`todo-${todo.id}`}
                  />
                  <label htmlFor={`todo-${todo.id}`}></label>
                </div>
                <div className="todo-content">
                  <div className="todo-text">{todo.text}</div>
                  <div className="todo-meta">
                    <span className="todo-date">{formatDate(todo.createdAt)}</span>
                    {todo.reminderTime && (
                      <span className="todo-reminder">⏰ {todo.reminderTime}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="delete-button"
                  title="Sil"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
