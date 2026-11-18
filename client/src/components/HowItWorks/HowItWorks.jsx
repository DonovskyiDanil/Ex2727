import React from 'react';
import styles from './HowItWorks.module.sass';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: 'Set the direction',
      text: 'Tell us about your audience, your goals, and the feeling you want your name to create.',
    },
    {
      id: 2,
      title: 'Gather possibilities',
      text: 'Review a range of ideas and notice which themes, sounds, and stories feel right.',
    },
    {
      id: 3,
      title: 'Shape your shortlist',
      text: 'Share feedback, compare your favorites, and check the practical details that matter.',
    },
    {
      id: 4,
      title: 'Choose your favorite',
      text: 'Select the name that best fits your next chapter and move forward with a clear direction.',
    }
  ];

  return (
    <section className={styles.howSection} id="process">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.stepOverview}>
            <span aria-hidden="true">01—04</span>
          </div>
          <h2 className={styles.title}>A simple path from brief to breakthrough</h2>
          <p className={styles.subtitle}>Keep moving forward, one good decision at a time.</p>
        </div>

        <div className={styles.stepsGrid}>
          {steps.map((step) => (
            <article key={step.id} className={styles.stepCard}>
              <span className={styles.stepBadge}>{String(step.id).padStart(2, '0')}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepText}>{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
