import React from 'react';
import { useExpiredEventsCount } from '../../hooks/useExpiredEventsCount';
import styles from './EventsBadge.module.sass';

/**
 * Красный бейдж с количеством напоминаний, время которых уже наступило.
 * Показывается заказчику в шапке на любой странице приложения.
 */
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
