import React from 'react';
<<<<<<< HEAD
import { Link } from 'react-router-dom';
=======
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.textContent}>
<<<<<<< HEAD
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
=======
        <span className={styles.badge}>World's #1 Naming Platform</span>
        <h1 className={styles.mainTitle}>How Does Atom Work?</h1>
        <p className={styles.subText}>
          Atom helps you come up with a great name for your business by combining 
          the power of crowdsourcing with sophisticated technology and Agency-level validation services.
        </p>
      </div>
      
      <div className={styles.videoContainer}>
        <div className={styles.videoCard}>
          <iframe
            src="https://iframe.mediadelivery.net/embed/239474/327efcdd-b1a2-4891-b274-974787ae8362?autoplay=false&loop=false&muted=false&preload=true&responsive=true"
            loading="lazy"
            className={styles.iframeVideo}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen={true}
            title="How Does Atom Work?"
          ></iframe>
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
        </div>
      </div>
    </section>
  );
};

export default Hero;
