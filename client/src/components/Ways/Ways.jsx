import React from 'react';
import styles from './Ways.module.css';
<<<<<<< HEAD
import { ArrowUpRight, Lightbulb, Search, UsersRound } from 'lucide-react';
=======
import icon1 from '../../assets/ways/g1.svg'; 
import icon2 from '../../assets/ways/g2.svg';
import icon3 from '../../assets/ways/g3.svg';
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8

const Ways = () => {
  const cards = [
    {
<<<<<<< HEAD
      icon: <UsersRound aria-hidden="true" />,
      eyebrow: 'MAKE IT A COLLABORATION',
      title: 'Invite a range of ideas',
      desc: 'Share your brief and give talented contributors the context they need to suggest thoughtful names.',
    },
    {
      icon: <Search aria-hidden="true" />,
      eyebrow: 'START WITH A SHORTLIST',
      title: 'Explore ready-to-use names',
      desc: 'Browse a considered collection when you want a quick starting point and a clear direction.',
    },
    {
      icon: <Lightbulb aria-hidden="true" />,
      eyebrow: 'GET A GUIDING HAND',
      title: 'Work with a naming guide',
      desc: 'Get focused help shaping your brief, reviewing ideas, and choosing a direction that fits your plans.',
=======
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
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
    }
  ];

  return (
    <section className={styles.waysSection}>
      <div className={styles.container}>
<<<<<<< HEAD
        <span className={styles.badge}>FIND YOUR WAY FORWARD</span>
        <h2 className={styles.title}>Choose a path that fits your idea</h2>
        <p className={styles.subtitle}>
          Start with a blank page, a shortlist, or a little expert guidance.
        </p>

        <div className={styles.grid}>
          {cards.map((card) => (
            <article key={card.title} className={styles.card}>
              <div className={styles.iconContainer}>
                {card.icon}
              </div>
              <span className={styles.cardEyebrow}>{card.eyebrow}</span>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
              <a href="#process" className={styles.cardLink}>
                Explore the steps <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </article>
=======
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
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
          ))}
        </div>
      </div>
    </section>
  );
};

export default Ways;
