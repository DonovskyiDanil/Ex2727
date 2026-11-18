import React from 'react';
import styles from './PartnersMenu.module.css';
import { whyAtomMenu } from '../data/menus/whyAtom.menu';

/**
 * Раньше это был раздел "Why Atom". На живом сайте те же ссылки
 * (Distribution Network API, MCP Server, White Label Marketplace,
 * партнёрская программа) собраны под пунктом "Partners".
 */
const PartnersMenu = () => (
  <div className={styles.wrapper}>
    <h5 className={styles.title}>Partner With Atom</h5>
    <div className={styles.list}>
      {whyAtomMenu.items.map((item) => (
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
);

export default PartnersMenu;
