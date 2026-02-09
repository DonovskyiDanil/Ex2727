import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AtomHeader.module.css';
import logoImg from '../../assets/logo.png';
import searchIcon from '../../assets/icon/search.png';
import userIcon from '../../assets/icon/user.png';
import phoneIcon from '../../assets/icon/phone.jpg';
import heartIcon from '../../assets/icon/icon-heart.svg';
import chatIcon from '../../assets/icon/icon-chat-black.svg';
import emailIcon from '../../assets/icon/icon-email.svg';
import helpIcon from '../../assets/icon/icon-help.svg';
import DomainsMenu from '../MegaMenu/DomainsMenu';
import AiNamingMenu from '../MegaMenu/AiNamingMenu';
import ToolsMenu from '../MegaMenu/ToolsMenu';
import ServicesMenu from '../MegaMenu/ServicesMenu';
import WhyAtomMenu from '../MegaMenu/WhyAtomMenu';

const AtomHeader = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [expiredCount, setExpiredCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const updateExpiredCount = () => {
      try {
        const eventsData = localStorage.getItem('events-data');
        if (eventsData) {
          const events = JSON.parse(eventsData);
          const count = events.filter(event => new Date(event.targetDate) <= new Date()).length;
          setExpiredCount(count);
        }
      } catch (error) {
        console.error('Error reading events from localStorage:', error);
      }
    };

    updateExpiredCount();
    const interval = setInterval(updateExpiredCount, 1000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { id: 'domains', label: 'Domains', component: <DomainsMenu /> },
    { id: 'ai', label: 'AI Naming', component: <AiNamingMenu /> },
    { id: 'tools', label: 'Tools', component: <ToolsMenu /> },
    { id: 'services', label: 'Services', component: <ServicesMenu /> },
    { id: 'why', label: 'Why Atom', component: <WhyAtomMenu /> },
    { id: 'events', label: 'Events', component: null, isLink: true, href: '/events' },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a href="/" className={styles.logoGroup}>
          <img src={logoImg} alt="Atom.com" className={styles.logo} />
        </a>

        <nav className={styles.nav}>
          {navLinks.map(link => (
            link.isLink ? (
              <a
                key={link.id}
                href={link.href}
                className={`${styles.navItem} ${styles.navLink}`}
                style={{ position: 'relative' }}
              >
                <span className={styles.label}>{link.label}</span>
                {expiredCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '8px',
                    right: '-8px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                  }}>
                    {expiredCount}
                  </span>
                )}
              </a>
            ) : (
              <div
                key={link.id}
                className={`${styles.navItem} ${activeMenu === link.id ? styles.active : ''}`}
                onMouseEnter={() => setActiveMenu(link.id)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <span className={styles.label}>{link.label}</span>
                {activeMenu === link.id && (
                  <div className={styles.menuDropdown}>{link.component}</div>
                )}
              </div>
            )
          ))}
        </nav>

        <div className={styles.actions}>
          <div className={styles.actionIcon}>
            <img src={searchIcon} alt="Search" />
          </div>
          
          <div 
            className={styles.actionWrapper}
            onMouseEnter={() => setActiveMenu('profile')}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <div className={styles.actionIcon}>
              <img src={userIcon} alt="User" />
            </div>
            {activeMenu === 'profile' && (
              <div className={styles.smallDropdown}>
                <div className={styles.dropItem}><img src={userIcon} className={styles.tinyIcon} /> Login</div>
                <div className={styles.dropItem}><img src={userIcon} className={styles.tinyIcon} /> Signup</div>
              </div>
            )}
          </div>

          <div 
            className={styles.actionWrapper}
            onMouseEnter={() => setActiveMenu('phone')}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <div className={styles.actionIcon}>
              <img src={phoneIcon} alt="Phone" />
            </div>
            {activeMenu === 'phone' && (
              <div className={styles.smallDropdown} style={{right: '0', left: 'auto', width: '220px'}}>
                <div className={styles.dropItem}>
                    <img src={phoneIcon} className={styles.tinyIcon} /> 
                    (877) 355-3585
                </div>
                <div className={styles.dropItem}>
                    <img src={chatIcon} className={styles.tinyIcon} /> Chat
                </div>
                <div className={styles.dropItem}>
                    <img src={emailIcon} className={styles.tinyIcon} /> Email
                </div>
                <div className={styles.dropItem}>
                    <img src={helpIcon} className={styles.tinyIcon} /> Help Desk
                </div>
              </div>
            )}
          </div>

          <div className={styles.actionIcon}>
            <img src={heartIcon} alt="Heart" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AtomHeader;