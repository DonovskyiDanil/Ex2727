import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import {
  FaRegUser,
  FaRegHeart,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaSearch,
  FaPhoneAlt,
  FaCommentDots,
  FaEnvelope,
  FaQuestionCircle,
} from 'react-icons/fa';
import styles from './AtomHeader.module.css';
import logoImg from '../../assets/logo.png';
import DomainsMenu from '../MegaMenu/DomainsMenu';
import ToolsMenu from '../MegaMenu/ToolsMenu';
import NamingBrandingMenu from '../MegaMenu/NamingBrandingMenu';
import PartnersMenu from '../MegaMenu/PartnersMenu';
import AboutMenu, { aboutLinks } from '../MegaMenu/AboutMenu';
import { domainsMenu } from '../data/menus/domains.menu';
import { toolsMenu } from '../data/menus/tools.menu';
import { servicesMenu } from '../data/menus/services.menu';
import { aiNamingMenu } from '../data/menus/aiNaming.menu';
import { whyAtomMenu } from '../data/menus/whyAtom.menu';
// FaHeadset появился только в Font Awesome 5+, в наборе react-icons/fa
// (основанном на FA4) его нет — берём из fa6, он там точно есть.
import { FaHeadset } from 'react-icons/fa6';

// Пункты и подписи — как на текущей версии atom.com (проверено 2026-09-16):
// Premium Domains, Register Domains, Naming & Branding, Partners, About.
const navLinks = [
  { id: 'domains', label: 'Premium Domains', component: <DomainsMenu /> },
  { id: 'register', label: 'Register Domains', component: <ToolsMenu /> },
  { id: 'naming', label: 'Naming & Branding', component: <NamingBrandingMenu /> },
  { id: 'partners', label: 'Partners', component: <PartnersMenu /> },
  { id: 'about', label: 'About', component: <AboutMenu /> },
];

// То же самое, но плоскими списками названий — для бокового меню (гамбургера),
// куда мега-меню с абсолютным позиционированием не поместятся.
const drawerCategories = [
  { id: 'domains', label: 'Premium Domains', items: domainsMenu.mainCategories.map((i) => i.title) },
  { id: 'register', label: 'Register Domains', items: toolsMenu.map((i) => i.title) },
  { id: 'naming', label: 'Naming & Branding', items: [...servicesMenu, ...aiNamingMenu].map((i) => i.title) },
  { id: 'partners', label: 'Partners', items: whyAtomMenu.items.map((i) => i.title) },
  { id: 'about', label: 'About', items: aboutLinks.map((i) => i.title) },
];

const SCROLL_THRESHOLD = 60;

const AtomHeader = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isScrolled, setScrolled] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [openDrawerCategory, setOpenDrawerCategory] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  // На живом сайте шапка меняет содержимое при скролле: пункты меню
  // сворачиваются, а на их месте появляется поисковая строка + гамбургер.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Пока открыта боковая панель — не даём странице скроллиться под ней
  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isDrawerOpen]);

  const closeDrawer = () => {
    setDrawerOpen(false);
    setOpenDrawerCategory(null);
  };

  return (
    <div className={styles.headerWrapper}>
      {/* Полоса-анонс прокручивается вместе со страницей, а не шапкой */}
      <div className={styles.announcementBar}>
        <span>
          Inc. 5000 honoree, 5 years running! Grateful to be named one of
          America's fastest-growing companies, again.
        </span>
        <a href="https://www.atom.com/blog" className={styles.announcementLink}>
          Read more
        </a>
      </div>

      <header className={styles.header}>
        <div className={styles.container}>
          <a href="/" className={styles.logoGroup}>
            <img src={logoImg} alt="Atom.com" className={styles.logo} />
          </a>

          {isDrawerOpen && (
            <button
              type="button"
              className={styles.headerCloseBtn}
              onClick={closeDrawer}
              aria-label="Close menu"
            >
              <FaTimes />
            </button>
          )}

          {isScrolled ? (
            <div className={styles.searchBar}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder='Try: "AI marketing tool"'
                className={styles.searchInput}
              />
              <button type="button" className={styles.searchButton}>Search</button>
            </div>
          ) : (
            <nav className={styles.nav}>
              {navLinks.map((link) => (
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
              ))}
            </nav>
          )}

          <div className={styles.actions}>
            <div
              className={styles.actionWrapper}
              onMouseEnter={() => setActiveMenu('account')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <FaRegUser className={styles.icon} />
              {activeMenu === 'account' && (
                <div className={styles.smallDropdown}>
                  <a href="/login" className={styles.dropItem}>Login</a>
                  <a href="/registration" className={styles.dropItem}>Signup</a>
                </div>
              )}
            </div>

            <div
              className={styles.actionWrapper}
              onMouseEnter={() => setActiveMenu('support')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <FaHeadset className={styles.icon} />
              {activeMenu === 'support' && (
                <div className={styles.smallDropdown}>
                  <a href="tel:1-847-597-0044" className={styles.dropItem}><FaPhoneAlt /> (847) 597-0044</a>
                  <span className={styles.dropItem}><FaCommentDots /> Chat</span>
                  <a href="mailto:service@atom.com" className={styles.dropItem}><FaEnvelope /> Email</a>
                  <a href="https://helpdesk.atom.com" className={styles.dropItem}><FaQuestionCircle /> Help Desk</a>
                </div>
              )}
            </div>

            <a href="/shortlisted-domains" className={styles.actionWrapper}>
              <FaRegHeart className={styles.icon} />
            </a>

            {/* Гамбургер: только в свёрнутом (после скролла) состоянии.
                Открывает боковую панель слева, а не маленький дропдаун. */}
            {isScrolled && (
              <button
                type="button"
                className={styles.actionWrapper}
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
              >
                <FaBars className={styles.icon} />
              </button>
            )}
          </div>
        </div>
      </header>

      {isDrawerOpen && (
        <>
          <div className={styles.drawerOverlay} onClick={closeDrawer} />
          <aside className={styles.drawer}>
            <div className={styles.drawerList}>
              {drawerCategories.map((category) => (
                <div key={category.id} className={styles.drawerCategory}>
                  <div
                    className={styles.drawerCategoryHeader}
                    onClick={() => setOpenDrawerCategory(
                      openDrawerCategory === category.id ? null : category.id,
                    )}
                  >
                    <span>{category.label}</span>
                    <FaChevronDown
                      className={`${styles.drawerChevron} ${openDrawerCategory === category.id ? styles.drawerChevronOpen : ''}`}
                    />
                  </div>
                  {openDrawerCategory === category.id && (
                    <div className={styles.drawerSubList}>
                      {category.items.map((item) => (
                        <div key={item} className={styles.drawerSubItem}>{item}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className={styles.drawerDivider} />

              <a href="/login" className={styles.drawerFlatItem}>Login</a>
              <a href="/registration" className={styles.drawerFlatItem}>Signup</a>
              <a href="/dashboard" className={styles.drawerFlatItem}>My Dashboard</a>
              <a href="/account" className={styles.drawerFlatItem}>My Account</a>

              <div className={styles.drawerDivider} />

              <a href="tel:1-847-597-0044" className={styles.drawerFlatItem}>(847) 597-0044</a>
              <span className={styles.drawerFlatItem}>Chat</span>
              <a href="mailto:service@atom.com" className={styles.drawerFlatItem}>Email</a>
              <a href="https://helpdesk.atom.com" className={styles.drawerFlatItem}>Help Desk</a>

              <div className={styles.drawerDivider} />

              <a href="/shortlisted-domains" className={styles.drawerFlatItem}>Shortlist</a>
            </div>
          </aside>
        </>
      )}
    </div>
  );
};

export default AtomHeader;
=======
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
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
