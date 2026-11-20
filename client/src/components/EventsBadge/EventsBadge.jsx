import React from 'react';
import { useExpiredEventsCount } from './useExpiredEventsCount';
import styles from './EventsBadge.module.sass';

const EventsBadge = ({ className = '' }) => {
  const count = useExpiredEventsCount();
  if (!count) {
    return null;
  }
  return (
    <span className={`${styles.badge} ${className}`} title="Reminders due">
      {count > 99 ? '99+' : count}
    </span>
  );
};

export default EventsBadge;