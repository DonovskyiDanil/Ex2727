import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import EventItem from './EventItem';
import EventForm from './EventForm';
import EventList from './EventList';
import styles from './Events.module.sass';

const Events = () => {
  const [events, setEvents] = useLocalStorage('events-data', []);
  const [expiredCount, setExpiredCount] = useState(0);

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
    setEvents(prev => [...prev, { ...newEvent, id: crypto.randomUUID() }]);
  };

  const deleteEvent = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => 
      new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
    );
  }, [events]);

  return (
    <div className={styles.eventsContainer}>
      <div className={styles.mainContent}>
        <div className={styles.headerSection}>
          <h1 className={styles.pageTitle}>Event Timer Manager</h1>
          <p className={styles.pageDescription}>
            Create timers for your upcoming events and stay on track
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Add New Event</h2>
          <div className={styles.formWrapper}>
            <EventForm onAdd={addEvent} />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Live Upcoming Events</h2>
            {expiredCount > 0 && (
              <span className={styles.expiredBadge}>
                {expiredCount} event{expiredCount !== 1 ? 's' : ''} expired
              </span>
            )}
          </div>
          <EventList 
            events={sortedEvents} 
            onDelete={deleteEvent}
            onExpire={updateExpiredCount}
          />
        </div>
      </div>
    </div>
  );
};

export default Events;
