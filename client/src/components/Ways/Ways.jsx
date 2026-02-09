import React from 'react';
import styles from './Ways.module.css';
import icon1 from '../../assets/ways/g1.svg'; 
import icon2 from '../../assets/ways/g2.svg';
import icon3 from '../../assets/ways/g3.svg';

const Ways = () => {
  const cards = [
    {
      icon: icon1,
      title: 'Launch a Contest',
      desc: 'Work with hundreds of creative experts to get custom name suggestions for your business or brand. All names are auto-checked for URL availability.',
      linkText: 'Launch a Contest'
    },
    {
      icon: icon2,
      title: 'Explore Names For Sale',
      desc: 'Our branding team has curated thousands of pre-made names that you can purchase instantly. All names include a matching URL and a complimentary Logo Design',
      linkText: 'Explore Names For Sale'
    },
    {
      icon: icon3,
      title: 'Agency-level Managed Contests',
      desc: 'Our Managed contests combine the power of crowdsourcing with the rich experience of our branding consultants. Get a complete agency-level experience at a fraction of Agency costs',
      linkText: 'Learn More'
    }
  ];

  return (
    <section className={styles.waysSection}>
      <div className={styles.container}>
        <div className={styles.badgeWrapper}>
          <span className={styles.badge}>Our Services</span>
        </div>
        <h2 className={styles.title}>3 Ways To Use Atom</h2>
        <p className={styles.subtitle}>
          Atom offers 3 ways to get you a perfect name for your business.
        </p>

        <div className={styles.grid}>
          {cards.map((card, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.iconContainer}>
                <img src={card.icon} alt={card.title} className={styles.cardIcon} />
              </div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
              <div className={styles.linkWrapper}>
                <a href="#" className={styles.actionButton}>
                  {card.linkText} <span className={styles.arrow}>→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Ways;
