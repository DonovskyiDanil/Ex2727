import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import EventForm from '../../components/Events/EventForm';
import EventItem from '../../components/Events/EventItem';

const EventsPage = () => {
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
    return [...events].sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate));
  }, [events]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Боковая панель */}
      <aside style={{
        width: '280px',
        backgroundColor: '#1e293b',
        color: 'white',
        padding: '24px 20px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch'
      }}>
        <div style={{ marginBottom: '32px', paddingX: '8px' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 style={{
              fontSize: '18px',
              fontWeight: '900',
              letterSpacing: '0.05em',
              color: 'white',
              fontStyle: 'italic',
              margin: 0,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
              opacity: 1
            }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
              EVENTSLINE
            </h1>
          </Link>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              backgroundColor: '#334155',
              borderRadius: '8px',
              border: '1px solid #475569',
              boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
              cursor: 'pointer',
              transition: 'background-color 0.2s, border-color 0.2s'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#3f5164';
              e.currentTarget.style.borderColor = '#52617a';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#334155';
              e.currentTarget.style.borderColor = '#475569';
            }}>
              <span style={{ fontWeight: '500', fontSize: '13px' }}>Events</span>
              {expiredCount > 0 && (
                <span style={{
                  backgroundColor: '#dc2626',
                  color: 'white',
                  fontSize: '9px',
                  fontWeight: '700',
                  padding: '3px 6px',
                  borderRadius: '9999px',
                  animation: 'bounce 1s infinite',
                  display: 'inline-flex',
                  minWidth: '20px',
                  justifyContent: 'center'
                }}>
                  {expiredCount}
                </span>
              )}
            </div>
          </Link>
        </nav>
      </aside>

      {/* Основной контент */}
      <main style={{ flex: 1, padding: '40px 32px', overflowY: 'auto', minWidth: 0 }}>
        <div style={{ maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {/* Заголовок страницы */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#1e293b',
              margin: '0 0 12px 0',
              letterSpacing: '-0.02em'
            }}>
              Event Timer Manager
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#64748b',
              margin: 0
            }}>
              Create timers for your upcoming events and stay on track
            </p>
          </div>

          {/* Форма добавления события */}
          <section style={{
            backgroundColor: 'white',
            padding: '28px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1e293b',
              marginTop: 0,
              marginBottom: '20px'
            }}>
              Add New Event
            </h2>
            <EventForm onAdd={addEvent} />
          </section>

          {/* Список событий */}
          <section>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#1e293b',
                letterSpacing: '-0.015em',
                margin: 0
              }}>
                Live Upcoming Events
              </h2>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#a1aec9',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                <span>Remaining time</span>
                <svg style={{ width: '18px', height: '18px', color: '#71717a' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sortedEvents.length > 0 ? (
                sortedEvents.map(event => (
                  <EventItem 
                    key={event.id} 
                    event={event} 
                    onDelete={deleteEvent}
                    onExpire={updateExpiredCount}
                  />
                ))
              ) : (
                <div style={{
                  textAlign: 'center',
                  paddingTop: '48px',
                  paddingBottom: '48px',
                  backgroundColor: 'white',
                  border: '2px dashed #e2e8f0',
                  borderRadius: '12px',
                  color: '#cbd5e1',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  The list is empty. Add the first event from the top.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
      `}</style>
    </div>
  );
};

export default EventsPage;
