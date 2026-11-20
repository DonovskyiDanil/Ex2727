import React from 'react';
import styles from './Ways.module.css';
import { ArrowUpRight, Lightbulb, Search, UsersRound } from 'lucide-react';

const Ways = () => {
  const cards = [
    {
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
    }
  ];

  return (
    <section className={styles.waysSection}>
      <div className={styles.container}>
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default Ways;
