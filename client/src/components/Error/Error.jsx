import React from 'react';
import styles from './Error.module.sass';

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
