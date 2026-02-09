import React, { useState } from 'react';

const EventForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    targetDate: '',
    notifyBefore: '10'
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Event name is required";
    }

    if (!formData.targetDate) {
      newErrors.targetDate = "Date and time is required";
    } else {
      const selectedDate = new Date(formData.targetDate);
      const now = new Date();
      if (selectedDate <= now) {
        newErrors.targetDate = "Date must be in the future";
      }
    }

    if (!formData.notifyBefore || parseInt(formData.notifyBefore) < 0) {
      newErrors.notifyBefore = "Please enter a valid time (0 or more)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAdd({
        title: formData.title,
        targetDate: formData.targetDate,
        notifyBefore: parseInt(formData.notifyBefore)
      });
      setFormData({
        title: '',
        targetDate: '',
        notifyBefore: '10'
      });
      setErrors({});
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Input Fields Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 0.8fr', gap: '16px', alignItems: 'flex-start' }}>
        
        {/* Event Name */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{
            fontSize: '13px',
            fontWeight: '500',
            color: '#64748b',
            letterSpacing: '0.02em',
            textTransform: 'uppercase'
          }}>
            Event name
          </label>
          <input 
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Server uptime" 
            style={{
              padding: '12px 14px',
              border: errors.title ? '1px solid #ef4444' : '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'inherit',
              backgroundColor: 'white',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.title ? '#ef4444' : '#cbd5e1';
              e.target.style.boxShadow = 'none';
            }}
          />
          {errors.title && <p style={{ margin: 0, fontSize: '12px', color: '#ef4444' }}>{errors.title}</p>}
        </div>

        {/* Date and Time */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{
            fontSize: '13px',
            fontWeight: '500',
            color: '#64748b',
            letterSpacing: '0.02em',
            textTransform: 'uppercase'
          }}>
            Date and time
          </label>
          <input 
            type="datetime-local" 
            name="targetDate"
            value={formData.targetDate}
            onChange={handleChange}
            style={{
              padding: '12px 14px',
              border: errors.targetDate ? '1px solid #ef4444' : '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'inherit',
              backgroundColor: 'white',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.targetDate ? '#ef4444' : '#cbd5e1';
              e.target.style.boxShadow = 'none';
            }}
          />
          {errors.targetDate && <p style={{ margin: 0, fontSize: '12px', color: '#ef4444' }}>{errors.targetDate}</p>}
        </div>

        {/* Report In */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{
            fontSize: '13px',
            fontWeight: '500',
            color: '#64748b',
            letterSpacing: '0.02em',
            textTransform: 'uppercase'
          }}>
            Report in (min)
          </label>
          <input 
            type="number" 
            name="notifyBefore"
            value={formData.notifyBefore}
            onChange={handleChange}
            placeholder="10" 
            min="0"
            style={{
              padding: '12px 14px',
              border: errors.notifyBefore ? '1px solid #ef4444' : '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'inherit',
              backgroundColor: 'white',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.notifyBefore ? '#ef4444' : '#cbd5e1';
              e.target.style.boxShadow = 'none';
            }}
          />
          {errors.notifyBefore && <p style={{ margin: 0, fontSize: '12px', color: '#ef4444' }}>{errors.notifyBefore}</p>}
        </div>
      </div>

      {/* Button */}
      <button 
        type="submit" 
        style={{
          padding: '12px 24px',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '15px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'background-color 0.2s, transform 0.1s',
          width: '100%',
          maxWidth: '240px'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#1d4ed8';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#2563eb';
        }}
        onMouseDown={(e) => {
          e.target.style.transform = 'scale(0.98)';
        }}
        onMouseUp={(e) => {
          e.target.style.transform = 'scale(1)';
        }}
      >
        Confirm
      </button>
    </form>
  );
};

export default EventForm;
