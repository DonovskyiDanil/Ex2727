<<<<<<< HEAD
import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
=======
import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
import styles from './ContestCreationPage.module.sass';
import { saveContestToStore } from '../../store/slices/contestCreationSlice';
import NextButton from '../../components/NextButton/NextButton';
import ContestForm from '../../components/ContestForm/ContestForm';
import BackButton from '../../components/BackButton/BackButton';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
<<<<<<< HEAD
import { uploadContestFile } from '../../api/rest/restController';
import CONSTANTS from '../../constants';

const ContestCreationPage = (props) => {
  const formRef = useRef();
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
=======

const ContestCreationPage = (props) => {
  const formRef = useRef();
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
  const navigate = useNavigate();

  const contestData = props.contestCreationStore.contests[props.contestType]
    ? props.contestCreationStore.contests[props.contestType]
    : { contestType: props.contestType };

<<<<<<< HEAD
  const handleSubmit = async (values) => {
    setUploadError('');
    setIsUploading(true);
    try {
      const contestData = { ...values, contestType: props.contestType };
      if (props.contestType === CONSTANTS.LOGO_CONTEST) {
        delete contestData.ventureType;
        delete contestData.designStyle;
      } else if (contestData.ventureType) {
        contestData.nameVenture = contestData.ventureType;
        delete contestData.ventureType;
      }
      if (contestData.designStyle) {
        contestData.styleName = contestData.designStyle;
        delete contestData.designStyle;
      }
      if (typeof File !== 'undefined' && values.file instanceof File) {
        const formData = new FormData();
        formData.append('file', values.file);
        const { data } = await uploadContestFile(formData);
        contestData.fileName = data.fileName;
        contestData.originalFileName = data.originalFileName;
      } else if (typeof values.file === 'string') {
        contestData.fileName = values.file || undefined;
      }
      delete contestData.file;

      props.saveContest({ type: props.contestType, info: contestData });
      const route =
        props.bundleStore.bundle[props.contestType] === 'payment'
          ? '/payment'
          : `/startContest/${props.bundleStore.bundle[props.contestType]}Contest`;
      navigate(route);
    } catch (error) {
      console.error('Could not upload contest image:', error);
      setUploadError(error?.response?.data || 'Could not upload the image. Please try again.');
    } finally {
      setIsUploading(false);
    }
=======
  const handleSubmit = (values) => {
    // Добавляем contestType в данные конкурса
    // Sanitize values to remove File objects (not serializable)
    const sanitizedValues = {
      ...values,
      contestType: props.contestType,
    };
    
    // Convert File object to just the file name for Redux storage
    if (sanitizedValues.file && typeof sanitizedValues.file === 'object' && sanitizedValues.file.name) {
      sanitizedValues.file = sanitizedValues.file.name;
    }
    
    props.saveContest({ type: props.contestType, info: sanitizedValues });
    const route =
      props.bundleStore.bundle[props.contestType] === 'payment'
        ? '/payment'
        : `/startContest/${props.bundleStore.bundle[props.contestType]}Contest`;
    navigate(route);
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
  };

  const submitForm = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  };

<<<<<<< HEAD
  if (!props.bundleStore.bundle) {
    return <Navigate to="/startContest" replace />;
  }
=======
  !props.bundleStore.bundle && navigate('/startContest', {replace: true});
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8

  return (
    <div>
      <div className={styles.startContestHeader}>
        <div className={styles.startContestInfo}>
          <h2>{props.title}</h2>
          <span>
            Tell us a bit more about your business as well as your preferences
            so that creatives get a better idea about what you are looking for
          </span>
        </div>
        <ProgressBar currentStep={2} />
      </div>
      <div className={styles.container}>
        <div className={styles.formContainer}>
<<<<<<< HEAD
          {uploadError && <p role="alert">{uploadError}</p>}
          {isUploading && <p role="status">Uploading image…</p>}
=======
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
          <ContestForm
            contestType={props.contestType}
            handleSubmit={handleSubmit}
            formRef={formRef}
            defaultData={contestData}
          />
        </div>
      </div>
      <div className={styles.footerButtonsContainer}>
        <div className={styles.lastContainer}>
          <div className={styles.buttonsContainer}>
            <BackButton />
<<<<<<< HEAD
            <NextButton submit={submitForm} disabled={isUploading} />
=======
            <NextButton submit={submitForm} />
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { contestCreationStore, bundleStore } = state;
  return { contestCreationStore, bundleStore };
};

const mapDispatchToProps = (dispatch) => ({
  saveContest: (data) => dispatch(saveContestToStore(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContestCreationPage);
