import React from 'react';
import { connect } from 'react-redux';
<<<<<<< HEAD
import { toast } from 'react-toastify';
=======
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
import { Formik, Form } from 'formik';
import CONTANTS from '../../constants';
import {
  addOffer,
  clearAddOfferError,
} from '../../store/slices/contestByIdSlice';
import styles from './OfferForm.module.sass';
import ImageUpload from '../InputComponents/ImageUpload/ImageUpload';
import FormInput from '../FormInput/FormInput';
import Schems from '../../utils/validators/validationSchems';
import Error from '../Error/Error';

const OfferForm = props => {
  const { addOfferError, clearOfferError, contestType, contestId, customerId, setNewOffer } = props;

  const renderOfferInput = () => {
    if (contestType === CONTANTS.LOGO_CONTEST) {
      return (
        <ImageUpload
          name='offerData'
          classes={{
            uploadContainer: styles.imageUploadContainer,
            inputContainer: styles.uploadInputContainer,
            imgStyle: styles.imgStyle,
          }}
        />
      );
    }
    return (
      <FormInput
        name='offerData'
        classes={{
          container: styles.inputContainer,
          input: styles.input,
          warning: styles.fieldWarning,
          notValid: styles.notValid,
        }}
        type='text'
        label='your suggestion'
      />
    );
  };

<<<<<<< HEAD
  const setOffer = async (values, { resetForm }) => {
=======
  const setOffer = (values, { resetForm }) => {
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
    clearOfferError();
    const data = new FormData();
    data.append('contestId', contestId);
    data.append('contestType', contestType);
    data.append('offerData', values.offerData);
    data.append('customerId', customerId);
<<<<<<< HEAD
    const result = await setNewOffer(data);
    // Форму очищаем и сообщаем об успехе только если сервер принял оффер
    if (addOffer.fulfilled.match(result)) {
      resetForm();
      toast.success('Your offer was sent and is waiting for moderator approval');
    }
=======
    setNewOffer(data);
    resetForm();
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
  };

  const validationSchema =
    contestType === CONTANTS.LOGO_CONTEST
      ? Schems.LogoOfferSchema
      : Schems.TextOfferSchema;

  return (
    <div className={styles.offerContainer}>
      {addOfferError && (
        <Error
          data={addOfferError.data}
          status={addOfferError.status}
          clearError={clearOfferError}
        />
      )}
      <Formik
        onSubmit={setOffer}
        initialValues={{
          offerData: '',
        }}
        validationSchema={validationSchema}
      >
<<<<<<< HEAD
        {() => (
          <Form className={styles.form}>
            {renderOfferInput()}
            <button type='submit' className={styles.btnOffer}>
              Send Offer
            </button>
=======
        {({ isValid, dirty }) => (
          <Form className={styles.form}>
            {renderOfferInput()}
            {/* Кнопка появится, когда форма заполнена корректно */}
            {isValid && dirty && (
              <button type='submit' className={styles.btnOffer}>
                Send Offer
              </button>
            )}
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
          </Form>
        )}
      </Formik>
    </div>
  );
};

const mapStateToProps = state => {
  const { addOfferError } = state.contestByIdStore;
  return { addOfferError };
};

const mapDispatchToProps = dispatch => ({
  setNewOffer: data => dispatch(addOffer(data)),
  clearOfferError: () => dispatch(clearAddOfferError()),
});

export default connect(mapStateToProps, mapDispatchToProps)(OfferForm);