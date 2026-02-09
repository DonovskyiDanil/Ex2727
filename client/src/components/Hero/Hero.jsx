import React from 'react';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.textContent}>
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
        </div>
      </div>
    </section>
  );
};

export default Hero;
