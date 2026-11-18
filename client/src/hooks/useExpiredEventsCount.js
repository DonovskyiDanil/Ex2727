import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  countEventsNeedingReminder,
  setEventsUser,
} from '../store/slices/eventsSlice';

const EMPTY_EVENTS = [];

/**
 * Пересчитывает количество напоминаний, время которых наступило,
 * чтобы бейджик в шапке обновлялся сам, без перезагрузки страницы.
 */
export const useExpiredEventsCount = () => {
  const dispatch = useDispatch();
  const { data: user } = useSelector((state) => state.userStore);
  const { events, userId } = useSelector((state) => state.eventsStore);
  const customerId = user?.role === 'customer' ? String(user.id) : null;
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (customerId !== userId) {
      dispatch(setEventsUser(customerId));
    }
  }, [customerId, userId, dispatch]);

  const visibleEvents = customerId === userId ? events : EMPTY_EVENTS;
  useEffect(() => {
    const recalculate = () => setCount(countEventsNeedingReminder(visibleEvents));
    recalculate();
    const interval = setInterval(recalculate, 1000);
    return () => clearInterval(interval);
  }, [visibleEvents]);

  return count;
};
