import React from 'react';
import styles from './ContestInfo.module.sass';

const NameContestSpecialInfo = props => {
<<<<<<< HEAD
  const { typeOfName, styleName, domainQuestion } = props;
=======
  const { typeOfName, styleName } = props;
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
  return (
    <>
      <div className={styles.dataContainer}>
        <span className={styles.label}>Type of Name</span>
        <span className={styles.data}>{typeOfName}</span>
      </div>
      <div className={styles.dataContainer}>
        <span className={styles.label}>Style of Name</span>
        <span className={styles.data}>{styleName}</span>
      </div>
<<<<<<< HEAD
      {domainQuestion && (
        <div className={styles.dataContainer}>
          <span className={styles.label}>Matching domain</span>
          <span className={styles.data}>
            {domainQuestion === 'yes_variations'
              ? 'Yes, minor variations are allowed'
              : domainQuestion === 'yes_exact'
                ? 'Yes, the domain must match exactly'
                : 'No domain required'}
          </span>
        </div>
      )}
=======
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
    </>
  );
};

export default NameContestSpecialInfo;
