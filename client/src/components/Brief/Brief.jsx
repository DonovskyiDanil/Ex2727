import React from 'react';
import { connect } from 'react-redux';
import {
  updateContest,
  clearContestUpdationStore,
} from '../../store/slices/contestUpdationSlice';
import { changeEditContest } from '../../store/slices/contestByIdSlice';
import withRouter from '../../hocs/withRouter';
import ContestForm from '../ContestForm/ContestForm';
import styles from './Brief.module.sass';
import ContestInfo from '../Contest/ContestInfo/ContestInfo';
import Error from '../Error/Error';

const Brief = (props) => {
  const setNewContestData = (values) => {
    const data = new FormData();
<<<<<<< HEAD
    const normalizedValues = { ...values };
    if (normalizedValues.ventureType) {
      normalizedValues.nameVenture = normalizedValues.ventureType;
      delete normalizedValues.ventureType;
    }
    if (normalizedValues.designStyle) {
      normalizedValues.styleName = normalizedValues.designStyle;
      delete normalizedValues.designStyle;
    }
    Object.keys(normalizedValues).forEach((key) => {
      if (key !== 'file' && normalizedValues[key]) {
        data.append(key, normalizedValues[key]);
      }
=======
    Object.keys(values).forEach((key) => {
      if (key !== 'file' && values[key]) data.append(key, values[key]);
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
    });
    if (values.file instanceof File) {
      data.append('file', values.file);
    }
    data.append('contestId', props.contestData.id);
    props.update(data);
  };

  const getContestObjInfo = () => {
    const {
      focusOfWork,
      industry,
      nameVenture,
      styleName,
      targetCustomer,
      title,
      brandStyle,
      typeOfName,
      typeOfTagline,
<<<<<<< HEAD
      domainQuestion,
=======
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
      originalFileName,
      contestType,
    } = props.contestData;
    const data = {
      focusOfWork,
      industry,
      nameVenture,
      styleName,
      targetCustomer,
      title,
      brandStyle,
      typeOfName,
      typeOfTagline,
<<<<<<< HEAD
      domainQuestion,
=======
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
      originalFileName,
      contestType,
    };
    const defaultData = {};
    Object.keys(data).forEach((key) => {
      if (data[key]) {
        if (key === 'originalFileName') {
          defaultData.file = { name: data[key] };
<<<<<<< HEAD
        } else if (key === 'nameVenture') {
          if (data.contestType === 'logo') {
            defaultData.nameVenture = data[key];
          } else {
            defaultData.ventureType = data[key];
          }
        } else if (key === 'styleName') {
          defaultData.designStyle = data[key];
=======
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
        } else {
          defaultData[key] = data[key];
        }
      }
    });
    return defaultData;
  };

  const {
    isEditContest,
    contestData,
    changeEditContest,
    role,
    goChat,
    clearContestUpdationStore,
  } = props;
  const { error } = props.contestUpdationStore;
  const { id } = props.userStore.data;
  if (!isEditContest) {
    return (
      <ContestInfo
        userId={id}
        contestData={contestData}
        changeEditContest={changeEditContest}
        role={role}
        goChat={goChat}
      />
    );
  }
  return (
    <div className={styles.contestForm}>
      {error && (
        <Error
          data={error.data}
          status={error.status}
          clearError={clearContestUpdationStore}
        />
      )}
      <ContestForm
        contestType={contestData.contestType}
        defaultData={getContestObjInfo()}
        handleSubmit={setNewContestData}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  const { isEditContest } = state.contestByIdStore;
  const { contestUpdationStore, userStore } = state;
  return { contestUpdationStore, userStore, isEditContest };
};

const mapDispatchToProps = (dispatch) => ({
  update: (data) => dispatch(updateContest(data)),
  changeEditContest: (data) => dispatch(changeEditContest(data)),
  clearContestUpdationStore: () => dispatch(clearContestUpdationStore()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Brief));
