import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EventForm from '../../components/Events/EventForm';
import EventList from '../../components/Events/EventList';
import { addEvent, deleteEvent } from '../../store/slices/eventsSlice';
import { useExpiredEventsCount } from '../../hooks/useExpiredEventsCount';
import styles from './EventsPage.module.sass';

/**
 * Страница напоминаний заказчика: «не забыть создать новый контест».
 * Живёт внутри общего Layout (шапка + футер) и доступна только customer.
 */
const EventsPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userStore.data);
  const { events, userId } = useSelector((state) => state.eventsStore);
  const visibleEvents = String(user?.id) === userId ? events : [];
  const expiredCount = useExpiredEventsCount();

  const handleAdd = (event) => dispatch(addEvent(event));
  const handleDelete = (id) => dispatch(deleteEvent(id));

  return (
    <div className={styles.eventsContainer}>
      <div className={styles.mainContent}>
        <div className={styles.headerSection}>
          <h1 className={styles.pageTitle}>Event Timer Manager</h1>
          <p className={styles.pageDescription}>
            Create timers for your upcoming contests and stay on track
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Add New Event</h2>
          <div className={styles.formWrapper}>
            <EventForm onAdd={handleAdd} />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Live Upcoming Events</h2>
            {expiredCount > 0 && (
              <span className={styles.expiredBadge}>
                {expiredCount} reminder{expiredCount !== 1 ? 's' : ''} due
              </span>
            )}
          </div>
          <EventList events={visibleEvents} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
