import React from 'react';
<<<<<<< HEAD
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
=======
import styles from './SearchSection.module.css';

const SearchSection = () => {
  const tags = ['Tech', 'Clothing', 'Finance', 'Real Estate', 'Crypto', 'Short', 'One Word'];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.searchWrapper}>
          <div className={styles.inputBox}>
            <span className={styles.glassIcon}>🔍</span>
            <input 
              type="text" 
              placeholder="Search Over 300,000+ Premium Names" 
              className={styles.input}
            />
            <button className={styles.orangeBtn}>
               <span className={styles.btnIcon}>🔍</span>
            </button>
          </div>
        </div>

        <div className={styles.tagsRow}>
          {tags.map((tag) => (
            <button key={tag} className={styles.tagBtn}>{tag}</button>
          ))}
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
