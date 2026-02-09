import React, { useEffect, useState } from 'react';
import { getOffersModeration, changeOfferStatus } from '../../api/rest/restController';
import styles from './ModeratorPage.module.sass';

const ModeratorPage = () => {
    const [offers, setOffers] = useState([]);
    const [page, setPage] = useState(1);
    const limit = 10;

    useEffect(() => {
        loadOffers();
    }, [page]);

    const loadOffers = async () => {
        try {
            const { data } = await getOffersModeration({ limit, offset: (page - 1) * limit });
            setOffers(data.rows);
        } catch (e) {
            console.error("Помилка при завантаженні оферів");
        }
    };

    const resolveOffer = async (offerId, command) => {
        try {
            await changeOfferStatus({ offerId, command });
            loadOffers(); // Оновлюємо список після дії модератора
        } catch (e) {
            console.error("Помилка при зміні статусу");
        }
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.contentContainer}>
                <h2 className={styles.title}>Панель модерації пропозицій</h2>
                {offers.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Текст пропозиції</th>
                                <th>Файл</th>
                                <th>Дії</th>
                            </tr>
                        </thead>
                        <tbody>
                            {offers.map(o => (
                                <tr key={o.id}>
                                    <td>{o.id}</td>
                                    <td>{o.text || 'Текст відсутній'}</td>
                                    <td>{o.fileName || 'Немає файлу'}</td>
                                    <td className={styles.actions}>
                                        <button className={styles.approveBtn} onClick={() => resolveOffer(o.id, 'approve')}>✅ Підтвердити</button>
                                        <button className={styles.rejectBtn} onClick={() => resolveOffer(o.id, 'reject')}>❌ Відхилити</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className={styles.noOffers}>Немає нових пропозицій для модерації</p>
                )}
                
                <div className={styles.pagination}>
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Назад</button>
                    <span>Сторінка {page}</span>
                    <button onClick={() => setPage(p => p + 1)}>Вперед</button>
                </div>
            </div>
        </div>
    );
};

export default ModeratorPage;