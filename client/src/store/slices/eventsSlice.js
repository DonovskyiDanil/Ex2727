import { createSlice } from '@reduxjs/toolkit';

const EVENTS_SLICE_NAME = 'events';
const LEGACY_STORAGE_KEY = 'events-data';
const storageKeyForUser = (userId) => `${LEGACY_STORAGE_KEY}:${userId}`;

const readFromStorage = (userId) => {
  try {
    const key = storageKeyForUser(userId);
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }

    const legacyEvents = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyEvents) {
      localStorage.setItem(key, legacyEvents);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      return JSON.parse(legacyEvents);
    }
    return [];
  } catch {
    return [];
  }
};

const writeToStorage = (userId, events) => {
  if (!userId) return;
  try {
    localStorage.setItem(storageKeyForUser(userId), JSON.stringify(events));
  } catch {
    // localStorage может быть недоступен (приватный режим) — просто игнорируем
  }
};

const initialState = {
  userId: null,
  events: [],
};

const eventsSlice = createSlice({
  name: EVENTS_SLICE_NAME,
  initialState,
  reducers: {
    setEventsUser: (state, { payload: userId }) => {
      if (state.userId === userId) return;
      state.userId = userId || null;
      state.events = userId ? readFromStorage(userId) : [];
    },
    addEvent: (state, { payload }) => {
      if (!state.userId) return;
      state.events.push({
        id:
          typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()}`,
        ...payload,
      });
      writeToStorage(state.userId, state.events);
    },
    deleteEvent: (state, { payload }) => {
      state.events = state.events.filter((event) => event.id !== payload);
      writeToStorage(state.userId, state.events);
    },
    clearEvents: (state) => {
      state.events = [];
      writeToStorage(state.userId, state.events);
    },
  },
});

const { actions, reducer } = eventsSlice;

export const { addEvent, deleteEvent, clearEvents, setEventsUser } = actions;

// Кол-во событий, время которых уже наступило — именно оно показывается
// красным бейджиком в шапке на любой странице.
export const countEventsNeedingReminder = (events, now = Date.now()) =>
  events.filter((event) => {
    const reminderAt =
      new Date(event.targetDate).getTime() - Number(event.notifyBefore) * 60_000;
    return Number.isFinite(reminderAt) && reminderAt <= now;
  }).length;

export default reducer;
