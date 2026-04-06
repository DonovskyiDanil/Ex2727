import React from 'react';
import CONSTANTS from '../../constants';
import styles from './ModeratorOfferBox.module.sass';

const ModeratorOfferBox = ({ data, resolveOffer }) => {
  const { id, text, fileName, Contest } = data;

  return (
    <div className={styles.offerCard}>
      <div className={styles.contestInfo}>
        <h4 className={styles.infoTitle}>Contest info</h4>
        <p>Title: {Contest?.title}</p>
        <p>Industry: {Contest?.industry}</p>
        <p>Style name: {Contest?.characteristic1}</p>
      </div>

      <div className={styles.offerContent}>
        {Contest?.contestType === CONSTANTS.LOGO_CONTEST ? (
          <img 
            src={`${CONSTANTS.publicURL}${fileName}`} 
            alt="logo" 
            className={styles.logoImage}
          />
        ) : (
          <span className={styles.offerText}>{text}</span>
        )}
      </div>

      <div className={styles.buttonsContainer}>
        <button 
          className={styles.approveBtn} 
          onClick={() => resolveOffer(id, 'approve')}
        >
          Approve
        </button>
        <button 
          className={styles.rejectBtn} 
          onClick={() => resolveOffer(id, 'reject')}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default ModeratorOfferBox;