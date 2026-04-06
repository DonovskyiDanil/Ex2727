import React, { useEffect, useState, useCallback } from 'react';
import { getOffersModeration, changeOfferStatus } from '../../api/rest/restController';
import styles from './ModeratorPage.module.sass';
import CONSTANTS from '../../constants';

const ModeratorPage = () => {
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState(null);

  // Оборачиваем в useCallback, чтобы функция была доступна и в useEffect, и в кнопке
  const loadOffers = useCallback(async () => {
    try {
      setError(null);
      // Явно указываем лимиты, чтобы сервер не вернул 404 или пустой список
      const { data } = await getOffersModeration({ limit: 10, offset: 0 });
      
      if (data && data.rows) {
        setOffers(data.rows);
      }
    } catch (e) {
      console.error("Ошибка при загрузке:", e);
      setError("Не удалось обновить список");
    }
  }, []);

  // Вызываем один раз при загрузке страницы
  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  const handleStatus = async (offerId, command) => {
    try {
      await changeOfferStatus({ offerId, command });
      // После успешного изменения СРАЗУ вызываем обновление
      await loadOffers();
    } catch (e) {
      alert("Ошибка при изменении статуса");
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.contentContainer}>
        <div className={styles.header}>
          {/* Теперь onClick вызывает функцию напрямую */}
          <button 
            className={styles.refreshBtn} 
            onClick={() => loadOffers()}
          >
            Refresh
          </button>
        </div>

        {error && <div style={{color: 'red', textAlign: 'center'}}>{error}</div>}
        
        <div className={styles.offersList}>
          {offers.length > 0 ? (
            offers.map((offer) => (
              <div key={offer.id} className={styles.offerCard}>
                <div className={styles.contestSection}>
                  <h4 className={styles.sectionTitle}>Contest info</h4>
                  <p>Title: {offer.Contest?.title}</p>
                  <p>Industry: {offer.Contest?.industry}</p>
                  <p>Style name: {offer.Contest?.characteristic1 || 'Professional'}</p>
                </div>

                <div className={styles.offerSection}>
                  {offer.text ? (
                    <span className={styles.offerText}>{offer.text}</span>
                  ) : (
                    <img 
                      src={`${CONSTANTS.publicURL}${offer.fileName}`} 
                      alt="logo" 
                      className={styles.offerLogo} 
                    />
                  )}
                </div>

                <div className={styles.actionSection}>
                  <button 
                    className={styles.approveBtn} 
                    onClick={() => handleStatus(offer.id, 'approve')}
                  >
                    Approve
                  </button>
                  <button 
                    className={styles.rejectBtn} 
                    onClick={() => handleStatus(offer.id, 'discard')}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noOffers}>There is no suggestion at this moment</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModeratorPage;