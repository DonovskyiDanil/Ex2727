import React from 'react';
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
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
