import React, { useState, useEffect } from 'react';
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
