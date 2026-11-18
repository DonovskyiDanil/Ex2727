import React from 'react';
import styles from './ContestInfo.module.sass';

const NameContestSpecialInfo = props => {
  const { typeOfName, styleName, domainQuestion } = props;
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
    </>
  );
};

export default NameContestSpecialInfo;
