import React from 'react';
<<<<<<< HEAD
import { useFormikContext } from 'formik';
import ButtonGroup from '../ButtonGroup/ButtonGroup';
import CONSTANTS from '../../constants';

const DomainQuestion = ({ contestType }) => {
  const { setFieldValue, values } = useFormikContext();
=======
import ButtonGroup from '../ButtonGroup/ButtonGroup';
import CONSTANTS from '../../constants';

const DomainQuestion = (props) => {
  const { contestType, setFieldValue, values } = props;
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8

  // Только показывать для NAME_CONTEST
  if (contestType !== CONSTANTS.NAME_CONTEST) {
    return null;
  }

  const domainOptions = [
    {
      id: 1,
      value: 'yes_variations',
      title: 'Yes',
<<<<<<< HEAD
      selectedTitle: 'Yes',
      unselectedTitle: 'No',
=======
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
      description: 'But minor variations are allowed',
      recommended: true
    },
    {
      id: 2,
      value: 'yes_exact',
      title: 'Yes',
<<<<<<< HEAD
      selectedTitle: 'Yes',
      unselectedTitle: 'No',
=======
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
      description: 'The Domain should exactly match the name',
      recommended: false
    },
    {
      id: 3,
      value: 'no_domain',
      title: 'No',
<<<<<<< HEAD
      selectedTitle: 'Yes',
      unselectedTitle: 'No',
=======
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
      description: 'I am only looking for a name, not a Domain',
      recommended: false
    }
  ];

  return (
    <div style={{ marginBottom: '32px' }}>
      <ButtonGroup
        name="domainQuestion"
        question="Do you want a matching domain (.com URL) with your name?"
        value={values?.domainQuestion || ''}
        onChange={(value) => {
          if (setFieldValue) {
            setFieldValue('domainQuestion', value);
          }
        }}
        options={domainOptions}
      />
    </div>
  );
};

export default DomainQuestion;
