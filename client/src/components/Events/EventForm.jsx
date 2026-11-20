import React, { useState } from 'react';
import styles from './EventForm.module.sass';

const EventForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    targetDate: '',
    notifyBefore: '10',
  });
  const [errors, setErrors] = useState({});
  const [notificationMessage, setNotificationMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    const selectedDate = new Date(formData.targetDate);
    const notifyBefore = Number(formData.notifyBefore);

    if (!formData.title.trim()) {
      newErrors.title = 'Event name is required';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Event name must be 100 characters or fewer';
    }

    if (!formData.targetDate || Number.isNaN(selectedDate.getTime())) {
      newErrors.targetDate = 'Date and time is required';
    } else if (selectedDate <= new Date()) {
      newErrors.targetDate = 'Date must be in the future';
    }

    if (
      formData.notifyBefore === '' ||
      !Number.isInteger(notifyBefore) ||
      notifyBefore < 0
    ) {
      newErrors.notifyBefore = 'Enter a whole number of minutes (0 or more)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    if (errors[name]) {
      setErrors((previous) => ({ ...previous, [name]: '' }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    if (
      typeof Notification !== 'undefined' &&
      Notification.permission === 'default'
    ) {
      try {
        const permission = await Notification.requestPermission();
        setNotificationMessage(
          permission === 'granted'
            ? ''
            : 'Browser notifications are off; the in-app reminder badge will still update.'
        );
      } catch (error) {
        console.error('Could not request notification permission:', error);
        setNotificationMessage(
          'Browser notifications are unavailable; the in-app reminder badge will still update.'
        );
      }
    }

    onAdd({
      title: formData.title.trim(),
      targetDate: formData.targetDate,
      notifyBefore: Number(formData.notifyBefore),
    });
    setFormData({ title: '', targetDate: '', notifyBefore: '10' });
    setErrors({});
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.formField}>
        <label className={styles.label} htmlFor="event-title">Event name</label>
        <input
          id="event-title"
          className={styles.input}
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., New brand contest"
          maxLength={100}
          required
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'event-title-error' : undefined}
        />
        {errors.title && (
          <p className={styles.error} id="event-title-error" role="alert">
            {errors.title}
          </p>
        )}
      </div>

      <div className={styles.formField}>
        <label className={styles.label} htmlFor="event-date">Date and time</label>
        <input
          id="event-date"
          className={styles.input}
          type="datetime-local"
          name="targetDate"
          value={formData.targetDate}
          onChange={handleChange}
          required
          aria-invalid={Boolean(errors.targetDate)}
          aria-describedby={errors.targetDate ? 'event-date-error' : undefined}
        />
        {errors.targetDate && (
          <p className={styles.error} id="event-date-error" role="alert">
            {errors.targetDate}
          </p>
        )}
      </div>

      <div className={styles.formField}>
        <label className={styles.label} htmlFor="event-notify-before">
          Remind me before (minutes)
        </label>
        <input
          id="event-notify-before"
          className={styles.input}
          type="number"
          name="notifyBefore"
          value={formData.notifyBefore}
          onChange={handleChange}
          min="0"
          step="1"
          required
          aria-invalid={Boolean(errors.notifyBefore)}
          aria-describedby={errors.notifyBefore ? 'event-notify-error' : undefined}
        />
        {errors.notifyBefore && (
          <p className={styles.error} id="event-notify-error" role="alert">
            {errors.notifyBefore}
          </p>
        )}
      </div>

      <button className={styles.submitBtn} type="submit">Confirm</button>
      {notificationMessage && (
        <p className={styles.notificationMessage} role="status">
          {notificationMessage}
        </p>
      )}
    </form>
  );
};

export default EventForm;
