import React from 'react';
import styles from './Button.module.sass';

const Button = ({ title, description, recommended, selected, onClick }) => (
  <button
    type="button"
    className={`${styles.button} ${selected ? styles.active : ''}`}
    onClick={onClick}
    aria-pressed={selected}
  >
    {recommended && <span className={styles.recommended}>Recommended</span>}
    {selected && (
      <span className={styles.checkmark} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    )}
    <span className={styles.title}>{title}</span>
    {description && <span className={styles.description}>{description}</span>}
  </button>
);

export default Button;
