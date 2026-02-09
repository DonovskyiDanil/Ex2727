import React from 'react';
import styles from './WhyAtom.module.css';
import { whyAtomMenu } from '../data/menus/whyAtom.menu';

const WhyAtomMenu = () => {
  if (!whyAtomMenu) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftSide}>
        <h5 className={styles.title}>Atom.com</h5>
        <div className={styles.links}>
          {whyAtomMenu.leftSide.links.map((link, i) => (
            <span key={i} className={styles.bigLink}>{link}</span>
          ))}
        </div>
      </div>

      <div className={styles.divider}></div>
      <div className={styles.rightSide}>
        <h5 className={styles.title}>Partner With Us</h5>
        <div className={styles.cards}>
          {whyAtomMenu.items.map((item, idx) => (
            <div key={item.id || idx} className={styles.card}>
              <div className={styles.icon}>
                <img src={item.icon} alt="" />
              </div>
              <div className={styles.text}>
                <h4>
                  {item.title} <span className={styles.chevron}>›</span>
                </h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyAtomMenu;