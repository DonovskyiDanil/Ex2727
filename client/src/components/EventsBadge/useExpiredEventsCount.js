import { useState, useEffect, useCallback } from 'react';

export const EVENTS_STORAGE_KEY = 'events-data';
export const FALLBACK_STORAGE_KEY = 'eventTimers';
export const EVENTS_SYNC_EVENT = 'eventsDataUpdated';

const parseTimestamp = (event) => {
  const rawDate = event?.targetDate ?? event?.dateTime;
  if (!rawDate) return null;
  const ts = new Date(rawDate).getTime();
  return Number.isNaN(ts) ? null : ts;
};

const readEventsFromStorage = () => {
  for (const key of [EVENTS_STORAGE_KEY, FALLBACK_STORAGE_KEY]) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // Ignore malformed JSON or storage errors
    }
  }
  return [];
};

export const countExpiredEvents = (events) => {
  if (!Array.isArray(events)) return 0;
  const now = Date.now();
  return events.reduce((acc, item) => {
    const ts = parseTimestamp(item);
    return ts !== null && ts <= now ? acc + 1 : acc;
  }, 0);
};

export const emitEventsSync = () => {
  window.dispatchEvent(new Event(EVENTS_SYNC_EVENT));
};

export const useExpiredEventsCount = () => {
  const [count, setCount] = useState(() => countExpiredEvents(readEventsFromStorage()));

  const updateCount = useCallback(() => {
    setCount(countExpiredEvents(readEventsFromStorage()));
  }, []);

  useEffect(() => {
    updateCount();
    const intervalId = setInterval(updateCount, 1000);
    window.addEventListener('storage', updateCount);
    window.addEventListener(EVENTS_SYNC_EVENT, updateCount);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', updateCount);
      window.removeEventListener(EVENTS_SYNC_EVENT, updateCount);
    };
  }, [updateCount]);

  return count;
};