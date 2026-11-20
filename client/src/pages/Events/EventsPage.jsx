import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './EventsPage.module.sass';
import { format, formatDistanceToNowStrict, isPast, isValid } from 'date-fns';
import { enUS } from 'date-fns/locale';
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

const getEventDateValue = (event) => event?.targetDate ?? event?.dateTime ?? '';

const safeParseDate = (dateValue) => {
  if (!dateValue) return null;
  const parsed = new Date(dateValue);
  return isValid(parsed) ? parsed : null;
};

const sortByTargetDate = (items) => {
  return [...items].sort((a, b) => {
    const timeA = safeParseDate(getEventDateValue(a))?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const timeB = safeParseDate(getEventDateValue(b))?.getTime() ?? Number.MAX_SAFE_INTEGER;
    return timeA - timeB;
  });
};

const readStoredEvents = () => {
  try {
    const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const valid = parsed.filter(
      (item) => item && typeof item.name === 'string' && safeParseDate(getEventDateValue(item))
    );
    return sortByTargetDate(valid);
  } catch {
    return [];
  }
};

export const getExpiredEventsCount = () => {
  return countExpiredEvents(readStoredEvents());
};

const TimerItem = ({ event, onDelete }) => {
  const rawDate = getEventDateValue(event);
  const targetDate = safeParseDate(rawDate);
  const [timeLeft, setTimeLeft] = useState('');
  const [passed, setPassed] = useState(() => (targetDate ? isPast(targetDate) : false));
  const intervalRef = useRef(null);

  const calculateTimeLeft = useCallback(() => {
    const currentTarget = safeParseDate(getEventDateValue(event));
    if (!currentTarget) {
      setTimeLeft('Invalid date');
      return;
    }

    if (isPast(currentTarget)) {
      setPassed(true);
      setTimeLeft('Event passed');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      emitEventsSync();
      return;
    }

    setPassed(false);
    setTimeLeft(formatDistanceToNowStrict(currentTarget, { addSuffix: true, locale: enUS }));
  }, [event]);

  useEffect(() => {
    calculateTimeLeft();
    intervalRef.current = setInterval(calculateTimeLeft, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [calculateTimeLeft]);

  const formattedDate = targetDate
    ? format(targetDate, 'MMM dd, yyyy, hh:mm a', { locale: enUS })
    : rawDate;

  return (
    <li className={`${styles.timerItem} ${passed ? styles.passed : ''}`}>
      <div className={styles.timerInfo}>
        <h3 className={styles.eventName}>{event.name}</h3>
        <p className={styles.eventDate}>Date: {formattedDate}</p>
        <p className={styles.timeLeft}>{timeLeft}</p>
      </div>
      <button
        type="button"
        onClick={() => onDelete(event.id)}
        className={styles.deleteButton}
        aria-label={`Delete ${event.name}`}
      >
        &times;
      </button>
    </li>
  );
};

const EventsPage = () => {
  const [eventName, setEventName] = useState('');
  const [eventDateTime, setEventDateTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [events, setEvents] = useState(() => readStoredEvents());

  useEffect(() => {
    try {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
      emitEventsSync();
    } catch {
      // Ignore localStorage write errors
    }
  }, [events]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = eventName.trim();
    const parsedDate = safeParseDate(eventDateTime);

    if (!trimmedName || !parsedDate) {
      setErrorMessage('Please enter an event name and a valid date and time.');
      return;
    }

    if (isPast(parsedDate)) {
      setErrorMessage('Please choose a date and time in the future.');
      return;
    }

    setErrorMessage('');

    const newEvent = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name: trimmedName,
      targetDate: eventDateTime,
      createdAt: new Date().toISOString(),
    };

    setEvents((prevEvents) => sortByTargetDate([...prevEvents, newEvent]));
    setEventName('');
    setEventDateTime('');
  };

  const handleDelete = (id) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
  };

  return (
    <div className={styles.eventsPage}>
      <h1 className={styles.pageTitle}>Event Timers</h1>

      <form onSubmit={handleSubmit} className={styles.eventForm} noValidate>
        <div className={styles.formGroup}>
          <label htmlFor="eventName">Event Name:</label>
          <input
            type="text"
            id="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="e.g., New Year Contest"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="eventDateTime">Date and Time:</label>
          <input
            type="datetime-local"
            id="eventDateTime"
            value={eventDateTime}
            onChange={(e) => setEventDateTime(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
        <button type="submit" className={styles.submitButton}>
          Add Event Timer
        </button>
      </form>

      <div className={styles.timersListContainer}>
        {events.length === 0 ? (
          <p className={styles.noTimers}>No timers set yet. Add one above!</p>
        ) : (
          <ul className={styles.timersList}>
            {events.map((event) => (
              <TimerItem key={event.id} event={event} onDelete={handleDelete} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EventsPage;