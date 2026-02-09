import React from 'react';
import EventItem from './EventItem';
import styles from './EventList.module.sass';

const EventList = ({ events, onDelete, onExpire }) => {
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
  );

  if (sortedEvents.length === 0) {
    return (
      <div className={styles.emptyState}>
        The list is empty. Add the first event from the top.
      </div>
    );
  }

  return (
    <div className={styles.eventsList}>
      {sortedEvents.map(event => (
        <EventItem 
          key={event.id} 
          event={event} 
          onDelete={onDelete}
          onExpire={onExpire}
        />
      ))}
    </div>
  );
};

export default EventList;
