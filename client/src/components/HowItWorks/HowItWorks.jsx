import React from 'react';
import styles from './HowItWorks.module.sass';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
<<<<<<< HEAD
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
=======
      title: "Step 1",
      text: "Fill out your Naming Brief and begin receiving name ideas in minutes"
    },
    {
      id: 2,
      title: "Step 2",
      text: "Rate the submissions and provide feedback to creatives. Creatives submit even more names based on your feedback."
    },
    {
      id: 3,
      title: "Step 3",
      text: "Our team helps you test your favorite names with your target audience. We also assist with Trademark screening."
    },
    {
      id: 4,
      title: "Step 4",
      text: "Pick a Winner. The winner gets paid for their submission."
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
    }
  ];

  return (
<<<<<<< HEAD
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
=======
    <section className={styles.howSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>How Do Naming Contests Work?</h2>
          <p className={styles.subtitle}>
            Squadhelp connects your business with creative professionals worldwide
          </p>
        </div>

        <div className={styles.stepsGrid}>
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className={styles.stepCard}>
                <div className={styles.stepIcon}>
                  <span className={styles.stepNumber}>{step.id}</span>
                </div>
                <span className={styles.stepBadge}>{step.title}</span>
                <p className={styles.stepText}>{step.text}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={styles.connector}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="#377dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </React.Fragment>
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
