import React from 'react';
import styles from './NextButton.module.sass';

const NextButton = props => {
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
  );
};

export default NextButton;
