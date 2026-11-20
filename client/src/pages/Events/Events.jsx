import { useState, useCallback, useMemo, useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import EventItem from '../../components/Events/EventItem';
import EventForm from '../../components/Events/EventForm';
import {
  EVENTS_STORAGE_KEY,
  EVENTS_SYNC_EVENT,
  countExpiredEvents,
  emitEventsSync,
} from '../../components/EventsBadge/useExpiredEventsCount';

export {
  EVENTS_STORAGE_KEY,
  EVENTS_SYNC_EVENT,
  countExpiredEvents,
  emitEventsSync,
};

const resolveEventTimestamp = (event) => {
  const rawDate = event?.targetDate ?? event?.dateTime;
  if (!rawDate) return null;
  const timestamp = new Date(rawDate).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
};

export const getExpiredEventsCountFromStorage = () => {
  try {
    const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    return countExpiredEvents(parsed);
  } catch {
    return 0;
  }
};

export default function Events() {
  const [events, setEvents] = useLocalStorage(EVENTS_STORAGE_KEY, []);
  const [expiredCount, setExpiredCount] = useState(() => countExpiredEvents(events));

  const updateExpiredCount = useCallback(() => {
    setExpiredCount(countExpiredEvents(events));
  }, [events]);

  useEffect(() => {
    updateExpiredCount();
    const interval = setInterval(updateExpiredCount, 1000);
    return () => clearInterval(interval);
  }, [updateExpiredCount]);

  useEffect(() => {
    emitEventsSync();
  }, [events]);

  const addEvent = (newEvent) => {
    setEvents((prev) => [
      ...prev,
      {
        ...newEvent,
        id: newEvent.id || crypto.randomUUID(),
        createdAt: newEvent.createdAt || new Date().toISOString(),
      },
    ]);
  };

  const deleteEvent = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const timeA = resolveEventTimestamp(a) ?? Number.MAX_SAFE_INTEGER;
      const timeB = resolveEventTimestamp(b) ?? Number.MAX_SAFE_INTEGER;
      return timeA - timeB;
    });
  }, [events]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Event Timers</h1>
          <p className="text-slate-600">Track important dates and upcoming events with live countdown timers</p>
        </div>

        {/* Form Section */}
        <section className="bg-white p-8 rounded-2xl shadow-md border border-slate-100 mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Add New Event</h2>
          <EventForm onAdd={addEvent} />
        </section>

        {/* Events List Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Live Upcoming Events</h2>
              <p className="text-slate-500 text-sm mt-1">Total events: {events.length}</p>
            </div>
            {expiredCount > 0 && (
              <div className="bg-red-100 border border-red-300 rounded-lg px-4 py-3 flex items-center gap-2">
                <span className="text-sm font-semibold text-red-800">Expired events:</span>
                <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full animate-pulse">
                  {expiredCount}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {sortedEvents.length > 0 ? (
              sortedEvents.map((event) => (
                <EventItem
                  key={event.id}
                  event={event}
                  onDelete={deleteEvent}
                  onExpire={updateExpiredCount}
                />
              ))
            ) : (
              <div className="text-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-2xl">
                <svg
                  className="w-16 h-16 text-slate-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-slate-500 text-lg font-medium">No events yet</p>
                <p className="text-slate-400 text-sm mt-1">Add your first event above to start tracking</p>
              </div>
            )}
          </div>
        </section>

        {/* Footer Info */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Tips</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>Events are automatically sorted by closest date first</li>
            <li>Red indicates an expired or reached event</li>
            <li>Yellow indicates an approaching reminder time</li>
            <li>All data is saved in the browser (Local Storage)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}