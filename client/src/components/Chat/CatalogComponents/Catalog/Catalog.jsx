import React from 'react';
import styles from './Catalog.module.sass';

const Catalog = props => {
  const { deleteCatalog, goToCatalog } = props;
<<<<<<< HEAD
  const { catalogName, chats, id } = props.catalog;
=======
  const { catalogName, chats, _id } = props.catalog;
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
  return (
    <div
      className={styles.catalogContainer}
      onClick={event => goToCatalog(event, props.catalog)}
    >
      <span className={styles.catalogName}>{catalogName}</span>
      <div className={styles.infoContainer}>
        <span>Chats number: </span>
        <span className={styles.numbers}>{chats.length}</span>
        <i
          className='fas fa-trash-alt'
<<<<<<< HEAD
          onClick={event => deleteCatalog(event, id)}
=======
          onClick={event => deleteCatalog(event, _id)}
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
        />
      </div>
    </div>
  );
};

export default Catalog;
