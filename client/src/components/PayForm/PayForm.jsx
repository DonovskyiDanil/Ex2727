import React from 'react';
import Cards from 'react-credit-cards-2';
import { Form, Formik } from 'formik';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import { connect } from 'react-redux';
import styles from './PayForm.module.sass';
import { changeFocusOnCard } from '../../store/slices/paymentSlice';
import PayInput from '../InputComponents/PayInput/PayInput';
import Schems from '../../utils/validators/validationSchems';

const PayForm = (props) => {
  const changeFocusOnCardHandler = (name) => {
    props.changeFocusOnCard(name);
  };

  const pay = (values) => {
    props.sendRequest({
      number: values.number.replace(/\s/g, ''), // Удаляем пробелы из номера карты
      expiry: values.expiry,
      cvc: values.cvc,
      price: props.isPayForOrder ? 100 : Number(values.sum),
      contests: props.contests || [],
    });
  };

  const { focusOnElement, isPayForOrder } = props;

  return (
    <div className={styles.payFormContainer}>
      <span className={styles.headerInfo}>Payment Information</span>

      <Formik
        initialValues={{
          focusOnElement: '',
          name: '',
          number: '',
          cvc: '',
          expiry: '',
          sum: '',
        }}
        validationSchema={Schems.PaymentSchema}
        onSubmit={pay}
      >
        {({ values, errors, touched, isValid, dirty }) => {
          const { name, number, expiry, cvc, sum } = values;

          return (
            <>
              <div className={styles.cardContainer}>
                <Cards
                  number={number || ''}
                  name={name || ''}
                  expiry={expiry || ''}
                  cvc={cvc || ''}
                  focused={focusOnElement}
                />
              </div>

              <Form id="myForm" className={styles.formContainer}>
                <div className={styles.bigInput}>
                  <span>Name</span>
                  <PayInput
                    name="name"
                    classes={{
                      container: styles.inputContainer,
                      input: styles.input,
                      notValid: styles.notValid,
                      error: styles.error,
                    }}
                    type="text"
                    label="name"
                    changeFocus={changeFocusOnCardHandler}
                  />
                </div>

                {!isPayForOrder && (
                  <div className={styles.bigInput}>
                    <span>Sum</span>
                    <PayInput
                      name="sum"
                      classes={{
                        container: styles.inputContainer,
                        input: styles.input,
                        notValid: styles.notValid,
                        error: styles.error,
                      }}
                      type="text"
                      label="sum"
                    />
                  </div>
                )}

                <div className={styles.bigInput}>
                  <span>Card Number</span>
                  <PayInput
                    isInputMask
                    mask="9999 9999 9999 9999 999"
                    name="number"
                    classes={{
                      container: styles.inputContainer,
                      input: styles.input,
                      notValid: styles.notValid,
                      error: styles.error,
                    }}
                    type="text"
                    label="card number"
                    changeFocus={changeFocusOnCardHandler}
                  />
                </div>

                <div className={styles.smallInputContainer}>
                  <div className={styles.smallInput}>
                    <span>* Expires</span>
                    <PayInput
                      isInputMask
                      mask="99/99"
                      name="expiry"
                      classes={{
                        container: styles.inputContainer,
                        input: styles.input,
                        notValid: styles.notValid,
                        error: styles.error,
                      }}
                      type="text"
                      label="expiry"
                      changeFocus={changeFocusOnCardHandler}
                    />
                  </div>

                  <div className={styles.smallInput}>
                    <span>* Security Code</span>
                    <PayInput
                      isInputMask
                      mask="9999"
                      name="cvc"
                      classes={{
                        container: styles.inputContainer,
                        input: styles.input,
                        notValid: styles.notValid,
                        error: styles.error,
                      }}
                      type="text"
                      label="cvc"
                      changeFocus={changeFocusOnCardHandler}
                    />
                  </div>
                </div>
              </Form>

              <div className={styles.buttonsContainer}>
                <button
                  form="myForm"
                  className={styles.payButton}
                  type="submit"
                  disabled={!isValid || !dirty || (!isPayForOrder && !sum)}
                >
                  <span>{isPayForOrder ? 'Pay Now' : 'CashOut'}</span>
                </button>

                {isPayForOrder && (
                  <div onClick={() => props.back()} className={styles.backButton}>
                    <span>Back</span>
                  </div>
                )}
              </div>
            </>
          );
        }}
      </Formik>

      {isPayForOrder && (
        <div className={styles.totalSum}>
          <span>Total: $100.00</span>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  contests: state.contestCreationStore?.contests || [],
});

const mapDispatchToProps = (dispatch) => ({
  changeFocusOnCard: (data) => dispatch(changeFocusOnCard(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PayForm);