import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import styles from './SearchSection.module.css';

const SearchSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.ctaCard}>
          <span className={styles.eyebrow}>YOUR NEXT CHAPTER STARTS HERE</span>
          <h2>Make room for a name that feels like you.</h2>
          <p>Bring your idea. We’ll help you turn it into a clear creative direction.</p>
          <Link to="/startContest" className={styles.ctaButton}>
            Start a project <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
