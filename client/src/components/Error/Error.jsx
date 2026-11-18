import React from 'react';
import styles from './Error.module.sass';

<<<<<<< HEAD
const toText = (data) => (typeof data === 'string' && data.trim() ? data : null);

const Error = (props) => {
  const getMessage = () => {
    const { status, data } = props;
    const text = toText(data);
    switch (status) {
      case 400:
        return text || 'Check the input data';
      case 401:
        // Сервер намеренно не уточняет, что именно неверно (email или пароль)
        return text || 'Invalid email or password';
      case 403: // отказ банка
      case 404:
      case 406:
      case 409:
      case 423: // недостаточно прав
        return text || 'Server Error';
=======
const Error = props => {
  const getMessage = () => {
    const { status, data } = props;
    switch (status) {
      case 404:
        return data;
      case 400:
        return 'Check the input data';
      case 409:
        return data;
      case 403:
        return 'Bank decline transaction';
      case 406:
        return data;
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
      default:
        return 'Server Error';
    }
  };

  const { clearError } = props;
  return (
    <div className={styles.errorContainer}>
      <span>{getMessage()}</span>
      <i className='far fa-times-circle' onClick={() => clearError()} />
    </div>
  );
};

export default Error;
