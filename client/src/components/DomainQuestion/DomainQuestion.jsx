import React from 'react';
import ButtonGroup from '../ButtonGroup/ButtonGroup';
import CONSTANTS from '../../constants';

const DomainQuestion = (props) => {
  const { contestType, setFieldValue, values } = props;

  // Только показывать для NAME_CONTEST
  if (contestType !== CONSTANTS.NAME_CONTEST) {
    return null;
  }

  const domainOptions = [
    {
      id: 1,
      value: 'yes_variations',
      title: 'Yes',
      description: 'But minor variations are allowed',
      recommended: true
    },
    {
      id: 2,
      value: 'yes_exact',
      title: 'Yes',
      description: 'The Domain should exactly match the name',
      recommended: false
    },
    {
      id: 3,
      value: 'no_domain',
      title: 'No',
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
