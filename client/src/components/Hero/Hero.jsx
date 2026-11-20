import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.textContent}>
        <span className={styles.badge}>A better name starts with a good brief</span>
        <h1 className={styles.mainTitle}>Turn your first idea into a name worth building on.</h1>
        <p className={styles.subText}>
          Bring your business story, audience, and ambitions. Explore fresh directions,
          shape the strongest ideas, and choose a name with confidence.
        </p>
        <div className={styles.actions}>
          <Link to="/startContest" className={styles.primaryAction}>Start a project</Link>
          <a href="#process" className={styles.secondaryAction}>See the process <span aria-hidden="true">↓</span></a>
        </div>
      </div>
      
      <div className={styles.visual} aria-hidden="true">
        <div className={styles.visualGlow} />
        <div className={styles.ideaNote}>
          <span className={styles.noteLabel}>YOUR CREATIVE BRIEF</span>
          <strong>A little more meaning.<br />A lot more possibility.</strong>
          <div className={styles.noteTags}><span>Curious</span><span>Memorable</span></div>
        </div>
        <div className={styles.nameCard}>
          <span className={styles.cardLabel}>A NAME TO EXPLORE</span>
          <strong>northstar</strong>
          <span className={styles.cardDomain}><span /> domain check ready</span>
        </div>
        <div className={styles.reviewCard}>
          <span className={styles.reviewMark}>✦</span>
          <span><strong>Fresh perspective</strong><small>Ideas shaped by people</small></span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
