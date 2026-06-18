import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './EventsPage.module.sass';
import { formatDistanceToNowStrict, isPast, parseISO } from 'date-fns';

const LOCAL_STORAGE_KEY = 'eventTimers';

const TimerItem = ({ event, onDelete }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const intervalRef = useRef(null);

  const calculateTimeLeft = useCallback(() => {
    const targetDate = parseISO(event.dateTime);
    if (isPast(targetDate)) {
      setTimeLeft('Event passed');
      clearInterval(intervalRef.current);
      return;
    }
    setTimeLeft(formatDistanceToNowStrict(targetDate, { addSuffix: true }));
  }, [event.dateTime]);

  useEffect(() => {
    calculateTimeLeft();
    intervalRef.current = setInterval(calculateTimeLeft, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [calculateTimeLeft]);

  return (
    <li className={`${styles.timerItem} ${isPast(parseISO(event.dateTime)) ? styles.passed : ''}`}>
      <div className={styles.timerInfo}>
        <h3 className={styles.eventName}>{event.name}</h3>
        <p className={styles.eventDate}>Date: {new Date(event.dateTime).toLocaleString()}</p>
        <p className={styles.timeLeft}>{timeLeft}</p>
      </div>
      <button onClick={() => onDelete(event.id)} className={styles.deleteButton}>
        &times;
      </button>
    </li>
  );
};

const EventsPage = () => {
  const [eventName, setEventName] = useState('');
  const [eventDateTime, setEventDateTime] = useState('');
  const [timers, setTimers] = useState([]);

  useEffect(() => {
    const storedTimers = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    setTimers(storedTimers.map(timer => ({ ...timer, dateTime: timer.dateTime })));
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(timers));
  }, [timers]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!eventName || !eventDateTime) {
      alert('Please fill in all fields.');
      return;
    }

    const newTimer = {
      id: Date.now(),
      name: eventName,
      dateTime: eventDateTime,
    };

    setTimers((prevTimers) => {
      const updatedTimers = [...prevTimers, newTimer];
      // Sort timers by closest event first
      return updatedTimers.sort((a, b) => parseISO(a.dateTime).getTime() - parseISO(b.dateTime).getTime());
    });

    setEventName('');
    setEventDateTime('');
  };

  const handleDelete = (id) => {
    setTimers((prevTimers) => prevTimers.filter((timer) => timer.id !== id));
  };

  return (
    <div className={styles.eventsPage}>
      <h1 className={styles.pageTitle}>Event Timers</h1>

      <form onSubmit={handleSubmit} className={styles.eventForm}>
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
        <button type="submit" className={styles.submitButton}>
          Add Event Timer
        </button>
      </form>

      <div className={styles.timersListContainer}>
        {timers.length === 0 ? (
          <p className={styles.noTimers}>No timers set yet. Add one above!</p>
        ) : (
          <ul className={styles.timersList}>
            {timers.map((event) => (
              <TimerItem key={event.id} event={event} onDelete={handleDelete} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EventsPage;