<<<<<<< HEAD
import React, { useCallback, useEffect, useState } from 'react';
=======
import React, { useEffect, useState, useCallback } from 'react';
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
import { getOffersModeration, changeOfferStatus } from '../../api/rest/restController';
import styles from './ModeratorPage.module.sass';
import CONSTANTS from '../../constants';

<<<<<<< HEAD
const PAGE_SIZE = 10;

const getContestStyle = (contest) =>
  contest?.styleName ||
  contest?.typeOfName ||
  contest?.typeOfTagline ||
  contest?.brandStyle ||
  'Not specified';

const ModeratorPage = () => {
  const [offers, setOffers] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pageCount = Math.max(1, Math.ceil(count / PAGE_SIZE));

  const loadOffers = useCallback(async (pageIndex = page) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getOffersModeration({
        limit: PAGE_SIZE,
        offset: pageIndex * PAGE_SIZE,
      });
      setOffers(data.rows || []);
      setCount(data.count || 0);
    } catch (requestError) {
      console.error('Failed to load moderation offers:', requestError);
      setError('Could not load offers. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadOffers(page);
  }, [loadOffers, page]);
=======
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
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8

  const handleStatus = async (offerId, command) => {
    try {
      await changeOfferStatus({ offerId, command });
<<<<<<< HEAD
      if (offers.length === 1 && page > 0) {
        setPage((currentPage) => currentPage - 1);
      } else {
        await loadOffers(page);
      }
    } catch (requestError) {
      console.error('Failed to update offer status:', requestError);
      setError('Could not update the offer status. Please refresh and try again.');
=======
      // После успешного изменения СРАЗУ вызываем обновление
      await loadOffers();
    } catch (e) {
      alert("Ошибка при изменении статуса");
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.contentContainer}>
        <div className={styles.header}>
<<<<<<< HEAD
          <button
            className={styles.refreshBtn}
            onClick={() => loadOffers(page)}
            disabled={loading}
=======
          {/* Теперь onClick вызывает функцию напрямую */}
          <button 
            className={styles.refreshBtn} 
            onClick={() => loadOffers()}
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
          >
            Refresh
          </button>
        </div>

<<<<<<< HEAD
        {error && <div className={styles.message} role="alert">{error}</div>}
        {loading && <div className={styles.message}>Loading offers…</div>}

        <div className={styles.offersList}>
          {!loading && offers.length > 0 ? (
            offers.map((offer) => (
              <div key={offer.id} className={styles.offerCard}>
                <div className={styles.contestSection}>
                  <h2 className={styles.sectionTitle}>Contest info</h2>
                  <p>Title: {offer.Contest?.title}</p>
                  <p>Industry: {offer.Contest?.industry}</p>
                  <p>Style name: {getContestStyle(offer.Contest)}</p>
=======
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
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
                </div>

                <div className={styles.offerSection}>
                  {offer.text ? (
                    <span className={styles.offerText}>{offer.text}</span>
                  ) : (
<<<<<<< HEAD
                    <img
                      src={`${CONSTANTS.publicURL}${offer.fileName}`}
                      alt="Submitted logo"
                      className={styles.offerLogo}
=======
                    <img 
                      src={`${CONSTANTS.publicURL}${offer.fileName}`} 
                      alt="logo" 
                      className={styles.offerLogo} 
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
                    />
                  )}
                </div>

                <div className={styles.actionSection}>
<<<<<<< HEAD
                  <button
                    className={styles.approveBtn}
=======
                  <button 
                    className={styles.approveBtn} 
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
                    onClick={() => handleStatus(offer.id, 'approve')}
                  >
                    Approve
                  </button>
<<<<<<< HEAD
                  <button
                    className={styles.rejectBtn}
                    onClick={() => handleStatus(offer.id, 'reject')}
=======
                  <button 
                    className={styles.rejectBtn} 
                    onClick={() => handleStatus(offer.id, 'discard')}
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
<<<<<<< HEAD
          ) : !loading && (
            <div className={styles.noOffers}>There is no suggestion at this moment</div>
          )}
        </div>

        {pageCount > 1 && (
          <div className={styles.pagination} aria-label="Offer pages">
            <button
              type="button"
              className={styles.pageBtn}
              onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 0))}
              disabled={page === 0 || loading}
            >
              Previous
            </button>
            <span>Page {page + 1} of {pageCount}</span>
            <button
              type="button"
              className={styles.pageBtn}
              onClick={() => setPage((currentPage) => Math.min(currentPage + 1, pageCount - 1))}
              disabled={page >= pageCount - 1 || loading}
            >
              Next
            </button>
          </div>
        )}
=======
          ) : (
            <div className={styles.noOffers}>There is no suggestion at this moment</div>
          )}
        </div>
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default ModeratorPage;
=======
export default ModeratorPage;
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
