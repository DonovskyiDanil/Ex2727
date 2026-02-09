import React from 'react';
import styles from './HowItWorks.module.sass';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
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
    }
  ];

  return (
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
