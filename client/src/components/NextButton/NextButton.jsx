import React from 'react';
import styles from './NextButton.module.sass';

const NextButton = props => {
<<<<<<< HEAD
  const { submit, disabled = false } = props;

  return (
    <button
      type="button"
      onClick={submit}
      className={styles.buttonContainer}
      disabled={disabled}
    >
      <span>Next</span>
    </button>
=======
  const { submit } = props;

  return (
    <div onClick={submit} className={styles.buttonContainer}>
      <span>Next</span>
    </div>
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
  );
};

export default NextButton;
