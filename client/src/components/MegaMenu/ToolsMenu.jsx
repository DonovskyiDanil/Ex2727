import React from 'react';
import styles from './ToolsMenu.module.css';
import { toolsMenu } from '../data/menus/tools.menu';

const ToolsMenu = () => {
  const dataArray = Array.isArray(toolsMenu) 
    ? toolsMenu 
    : (toolsMenu.items || toolsMenu.tools || []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.list}>
        {dataArray.map((item, idx) => (
          <div key={item.id || idx} className={styles.toolCard}>
            <div className={styles.iconContainer}>
              <img src={item.icon} alt="" className={styles.toolIcon} />
            </div>
            <div className={styles.text}>
              <h4>
                {item.title} 
                <span className={styles.chevron}>›</span>
              </h4>
              {item.desc && <p>{item.desc}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolsMenu;