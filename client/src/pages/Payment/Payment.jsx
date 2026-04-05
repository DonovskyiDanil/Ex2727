import React, { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { pay, clearPaymentStore } from '../../store/slices/paymentSlice';
import PayForm from '../../components/PayForm/PayForm';
import Error from '../../components/Error/Error';
import styles from './Payment.module.sass';

const Payment = (props) => {
  const { 
    payment: { error }, 
    contestCreationStore: { contests }, 
    executePayment, 
    resetPaymentStore 
  } = props;
  
  const navigate = useNavigate();

  // 1. Исправляем ошибку "Cannot update a component while rendering"
  useEffect(() => {
    if (isEmpty(contests)) {
      navigate('/startContest', { replace: true });
    }
  }, [contests, navigate]);

  // 2. Оптимизируем формирование массива конкурсов (useMemo, чтобы не пересчитывать при каждом рендере)
  const contestArray = useMemo(() => {
    return Object.values(contests).map(contest => ({
      ...contest,
      haveFile: !!contest.file
    }));
  }, [contests]);

  const handlePay = (values) => {
    executePayment({
      data: {
        number: values.number,
        expiry: values.expiry,
        cvc: values.cvc,
        contests: contestArray,
        price: 100,
      },
      navigate,
    });
  };

  const goBack = () => navigate(-1);

  // Если данных нет, ничего не рендерим, пока работает useEffect
  if (isEmpty(contests)) {
    return null;
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.paymentContainer}>
        <span className={styles.headerLabel}>Checkout</span>
        {error && (
          <Error
            data={error.data}
            status={error.status}
            clearError={resetPaymentStore}
          />
        )}
        <PayForm 
          sendRequest={handlePay} 
          back={goBack} 
          isPayForOrder 
        />
      </div>

      <div className={styles.orderInfoContainer}>
        <span className={styles.orderHeader}>Order Summary</span>
        <div className={styles.packageInfoContainer}>
          <span className={styles.packageName}>Package Name: Standard</span>
          <span className={styles.packagePrice}>$100 USD</span>
        </div>
        <div className={styles.resultPriceContainer}>
          <span>Total:</span>
          <span>$100.00 USD</span>
        </div>
        <a 
          href="https://www.google.com" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          Have a promo code?
        </a>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  payment: state.payment,
  contestCreationStore: state.contestCreationStore,
});

// Переименовал функции для ясности, чтобы не путать с экшенами
const mapDispatchToProps = (dispatch) => ({
  executePayment: ({ data, navigate }) => dispatch(pay({ data, navigate })),
  resetPaymentStore: () => dispatch(clearPaymentStore()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Payment);