import React from 'react';
import CONSTANTS from '../../constants';
import SelectInput from '../SelectInput/SelectInput';
import FormInput from '../FormInput/FormInput';
import ButtonGroup from '../ButtonGroup/ButtonGroup';
import styles from '../ContestForm/ContestForm.module.sass';

const OptionalSelects = props => {
  switch (props.contestType) {
    case CONSTANTS.NAME_CONTEST: {
      return null; // Скрываем эти вопросы
    }
    case CONSTANTS.LOGO_CONTEST: {
      return (
        <>
          <div className={styles.inputContainer}>
            <span className={styles.inputHeader}>
              What name of your venture?
            </span>
            <FormInput
              name='nameVenture'
              type='text'
              label='name of venture'
              classes={{
                container: styles.componentInputContainer,
                input: styles.input,
                warning: styles.warning,
              }}
            />
          </div>
          <SelectInput
            name='brandStyle'
            classes={{
              inputContainer: styles.selectInputContainer,
              inputHeader: styles.selectHeader,
              selectInput: styles.select,
              warning: styles.warning,
            }}
            header='Brand Style'
            optionsArray={props.dataForContest.data.brandStyle}
          />
        </>
      );
    }
    case CONSTANTS.TAGLINE_CONTEST: {
      return (
        <>
          <div className={styles.inputContainer}>
            <span className={styles.inputHeader}>
              What name of your venture?
            </span>
            <FormInput
              name='nameVenture'
              type='text'
              label='name of venture'
              classes={{
                container: styles.componentInputContainer,
                input: styles.input,
                warning: styles.warning,
              }}
            />
          </div>
          <SelectInput
            name='typeOfTagline'
            classes={{
              inputContainer: styles.selectInputContainer,
              inputHeader: styles.selectHeader,
              selectInput: styles.select,
              warning: styles.warning,
            }}
            header='Type tagline'
            optionsArray={props.dataForContest.data.typeOfTagline}
          />
        </>
      );
    }
  }
};

export default OptionalSelects;
