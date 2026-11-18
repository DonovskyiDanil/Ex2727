import React from 'react';
import styles from './AboutMenu.module.css';

/**
 * На живом сайте "About" — отдельный пункт навигации (раньше эти же
 * три ссылки жили внутри "Why Atom"). Оставляем данные как есть,
 * просто выносим их в собственное простое выпадающее меню.
 */
const aboutLinks = [
  { title: 'About Us', desc: 'Our mission and the team behind Atom' },
  { title: 'Case Studies', desc: 'Real results from real customers' },
  { title: 'Testimonials', desc: 'What our customers say about us' },
  { title: 'Blog', desc: 'News, guides and naming tips' },
];

const AboutMenu = () => (
  <div className={styles.wrapper}>
    {aboutLinks.map((link) => (
      <div key={link.title} className={styles.item}>
        <h4>{link.title}</h4>
        <p>{link.desc}</p>
      </div>
    ))}
  </div>
);

export { aboutLinks };
export default AboutMenu;
