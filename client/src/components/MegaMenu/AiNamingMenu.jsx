import React from 'react';
import styles from './AiNamingMenu.module.css';
import { aiNamingMenu } from '../data/menus/aiNaming.menu';

const AiNamingMenu = () => {
  const dataArray = Array.isArray(aiNamingMenu) 
    ? aiNamingMenu 
    : (aiNamingMenu.items || aiNamingMenu.categories || []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.list}>
        {dataArray.map((item, idx) => (
          <div key={item.id || idx} className={styles.item}>
            <div className={styles.iconContainer}>
              <img src={item.icon} alt="" />
            </div>
            <div className={styles.info}>
              <h4>
                {item.title} <span className={styles.chevron}>›</span>
              </h4>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiNamingMenu;