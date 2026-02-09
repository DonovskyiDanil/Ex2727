import React, { useState, useEffect } from 'react';
import styles from './EventItem.module.sass';

const EventItem = ({ event, onDelete, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isNotified, setIsNotified] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculate = () => {
      const now = new Date();
      const target = new Date(event.targetDate);
      const diffMs = target.getTime() - now.getTime();
      const diffSeconds = Math.floor(diffMs / 1000);

      // Check if should notify
      if (diffSeconds <= (event.notifyBefore * 60) && !isNotified && diffSeconds > 0) {
        setIsNotified(true);
        // Send browser notification if permission granted
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`🔔 ${event.title}`, {
            body: `Event "${event.title}" will happen in ${event.notifyBefore} minutes!`,
            icon: '🎉'
          });
        }
      }

      // Check if expired
      if (diffSeconds <= 0) {
        setIsExpired(true);
        setTimeLeft(0);
        if (onExpire) {
          onExpire();
        }
        return true;
      }

      setTimeLeft(diffSeconds);
      return false;
    };

    calculate();
    const timer = setInterval(() => {
      if (calculate()) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [event.targetDate, event.notifyBefore, onExpire, isNotified]);

  const formatTime = (seconds) => {
    if (seconds === null) return 'calculating...';
    if (seconds <= 0) return '⏱️ Expired';
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const progress = timeLeft ? Math.max(0, Math.min(100, (timeLeft / 3600) * 100)) : 0;

  return (
    <div className={`${styles.itemContainer} ${isExpired ? styles.expired : ''} ${isNotified ? styles.notified : ''}`}>
      <div 
        className={styles.progressBar}
        style={{ width: `${progress}%` }}
      />
      <span className={styles.eventTitle}>{event.title}</span>
      <div className={styles.itemActions}>
        <span className={styles.timeLeft}>
          {formatTime(timeLeft !== null ? timeLeft : 0)}
        </span>
        <button 
          onClick={() => onDelete(event.id)}
          className={styles.deleteBtn}
          title="Delete event"
        >
          <svg className={styles.deleteIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default EventItem;
