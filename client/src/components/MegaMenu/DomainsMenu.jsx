import React from 'react';
import styles from './DomainsMenu.module.css';
import { domainsMenu } from '../data/menus/domains.menu';

const DomainsMenu = () => {
  const { mainCategories, collections, services, promo } = domainsMenu;

  return (
    <div className={styles.wrapper}>
      <div className={styles.whiteCol}>
        {mainCategories?.map((item) => (
          <div key={item.id} className={styles.cardItem}>
            <div className={styles.iconBox}>
              <img src={item.icon} alt="" className={styles.toolIcon} />
            </div>
            <div className={styles.cardContent}>
              <h4>{item.title} <span className={styles.arrow}>›</span></h4>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.whiteCol}>
        <h5 className={styles.title}>{collections.title}</h5>
        <div className={styles.linksList}>
          {collections.items?.map((link, idx) => (
            <div key={idx} className={styles.linkLine}>
              <span className={styles.bigLink}>{link.name}</span>
              {link.badge && <span className={styles.badgePopular}>{link.badge}</span>}
            </div>
          ))}
        </div>

        <h5 className={styles.title} style={{ marginTop: '30px' }}>{services.title}</h5>
        <div className={styles.linksList}>
          {services.items?.map((service, idx) => (
            <div key={idx} className={styles.linkLine}>
              <span className={styles.bigLink}>{service.name}</span>
              {service.badge && <span className={styles.badgePopular}>{service.badge}</span>}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.promoCol}>
        <div className={styles.promoCard}>
          <div className={styles.imageContainer}>
            <img src={promo.image} alt="Promo" className={styles.promoImage} />
          </div>
          <div className={styles.promoText}>
            <h4><span className={styles.searchIcon}>🔍</span> {promo.title} <span className={styles.arrow}>›</span></h4>
            <p>{promo.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainsMenu;