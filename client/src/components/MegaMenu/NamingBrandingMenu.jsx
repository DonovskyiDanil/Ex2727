import React from 'react';
import styles from './NamingBrandingMenu.module.css';
import { servicesMenu } from '../data/menus/services.menu';
import { aiNamingMenu } from '../data/menus/aiNaming.menu';

/**
 * На живом atom.com пункты "Naming & Branding" и "AI Naming" из старой
 * версии сайта объединены в один раздел меню. Данные берём из тех же
 * двух файлов, что и раньше (services.menu.js, aiNaming.menu.js),
 * просто показываем их вместе, двумя колонками.
 */
const NamingBrandingMenu = () => (
  <div className={styles.wrapper}>
    <div className={styles.column}>
      <h5 className={styles.title}>Naming & Branding</h5>
      <div className={styles.list}>
        {servicesMenu.map((item) => (
          <div key={item.id} className={styles.item}>
            <div className={styles.icon}><img src={item.icon} alt="" /></div>
            <div className={styles.text}>
              <h4>{item.title} <span className={styles.chevron}>›</span></h4>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className={styles.divider} />
    <div className={styles.column}>
      <h5 className={styles.title}>AI Tools</h5>
      <div className={styles.list}>
        {aiNamingMenu.map((item) => (
          <div key={item.id} className={styles.item}>
            <div className={styles.icon}><img src={item.icon} alt="" /></div>
            <div className={styles.text}>
              <h4>{item.title} <span className={styles.chevron}>›</span></h4>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default NamingBrandingMenu;
