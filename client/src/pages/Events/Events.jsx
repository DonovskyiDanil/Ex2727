import { useState, useCallback, useMemo, useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import EventItem from '../../components/Events/EventItem';
import EventForm from '../../components/Events/EventForm';

export default function Events() {
  const [events, setEvents] = useLocalStorage('events-data', []);
  const [expiredCount, setExpiredCount] = useState(0);

  // Обновление счетчика истекших событий
  const updateExpiredCount = useCallback(() => {
    const count = events.filter(event => new Date(event.targetDate) <= new Date()).length;
    setExpiredCount(count);
  }, [events]);

  useEffect(() => {
    updateExpiredCount();
    const interval = setInterval(updateExpiredCount, 1000);
    return () => clearInterval(interval);
  }, [updateExpiredCount]);

  const addEvent = (newEvent) => {
    setEvents(prev => [...prev, { 
      ...newEvent, 
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    }]);
  };

  const deleteEvent = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate));
  }, [events]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">📅 Timeline Событий</h1>
          <p className="text-slate-600">Отслеживайте важные даты и события с помощью плавающих таймеров</p>
        </div>

        {/* Form Section */}
        <section className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Создать новое событие</h2>
          <EventForm onAdd={addEvent} />
        </section>

        {/* Events List Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Предстоящие события</h2>
              <p className="text-slate-500 text-sm mt-1">Всего событий: {events.length}</p>
            </div>
            {expiredCount > 0 && (
              <div className="bg-red-100 border border-red-300 rounded-lg px-4 py-3 flex items-center gap-2">
                <span className="text-sm font-semibold text-red-800">Истекших событий:</span>
                <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full animate-pulse">
                  {expiredCount}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {sortedEvents.length > 0 ? (
              sortedEvents.map(event => (
                <EventItem 
                  key={event.id} 
                  event={event} 
                  onDelete={deleteEvent}
                  onExpire={updateExpiredCount}
                />
              ))
            ) : (
              <div className="text-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-2xl">
                <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-slate-500 text-lg font-medium">Пока нет событий</p>
                <p className="text-slate-400 text-sm mt-1">Добавьте первое событие, чтобы начать отслеживание</p>
              </div>
            )}
          </div>
        </section>

        {/* Footer Info */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Подсказка</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>✓ События автоматически сортируются по приближению даты</li>
            <li>✓ Красный цвет означает истекшее событие</li>
            <li>✓ Желтый цвет означает приближение времени уведомления</li>
            <li>✓ Все данные сохраняются в браузере (Local Storage)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
