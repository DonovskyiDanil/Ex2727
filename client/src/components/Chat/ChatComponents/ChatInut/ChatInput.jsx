import React from 'react';
import { connect } from 'react-redux';
import { Form, Formik } from 'formik';
import { sendMessage } from '../../../../store/slices/chatSlice';
import styles from './ChatInput.module.sass';
import CONSTANTS from '../../../../constants';
import FormInput from '../../../FormInput/FormInput';
import Schems from '../../../../utils/validators/validationSchems';

const ChatInput = (props) => {
<<<<<<< HEAD
  const submitHandler = async (values, { resetForm }) => {
    const result = await props.sendMessage({
      messageBody: values.message,
      interlocutorId: props.interlocutor.id,
    });
    if (sendMessage.fulfilled.match(result)) {
      resetForm();
    }
=======
  const submitHandler = (values, { resetForm }) => {
    props.sendMessage({
      messageBody: values.message,
      recipient: props.interlocutor.id,
      interlocutor: props.interlocutor,
    });
    resetForm();
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
  };

  return (
    <div className={styles.inputContainer}>
      <Formik
        onSubmit={submitHandler}
        initialValues={{ message: '' }}
        validationSchema={Schems.MessageSchema}
      >
        <Form className={styles.form}>
          <FormInput
            name="message"
            type="text"
            label="message"
            classes={{
              container: styles.container,
              input: styles.input,
              notValid: styles.notValid,
            }}
          />
          <button type="submit">
            <img
              src={`${CONSTANTS.STATIC_IMAGES_PATH}send.png`}
              alt="send Message"
            />
          </button>
        </Form>
      </Formik>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { interlocutor } = state.chatStore;
  const { data } = state.userStore;
  return { interlocutor, data };
};

const mapDispatchToProps = (dispatch) => ({
  sendMessage: (data) => dispatch(sendMessage(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatInput);
