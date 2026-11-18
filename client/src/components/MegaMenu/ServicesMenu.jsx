import React from 'react';
import styles from './ServicesMenu.module.css';
import { servicesMenu } from '../data/menus/services.menu';

const ServicesMenu = () => (
  <div className={styles.wrapper}>
    <div className={styles.grid}>
      {servicesMenu.map(item => (
        <div key={item.id} className={styles.item}>
          <div className={styles.icon}><img src={item.icon} alt="" /></div>
          <div className={styles.text}>
            <h4>
              {item.title} 
              <span className={styles.chevron}>›</span>
            </h4>
            <p>{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
export default ServicesMenu;