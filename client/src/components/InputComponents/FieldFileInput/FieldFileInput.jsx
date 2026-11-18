import React from 'react';
import { useFormikContext } from 'formik';

const FieldFileInput = ({ name, classes }) => {
  const { setFieldValue, values } = useFormikContext();
  const { fileUploadContainer, labelClass, fileNameClass, fileInput } = classes;

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    setFieldValue(name, file);
  };

  const getFileName = () => {
    if (values[name]) {
      return typeof values[name] === 'object' ? values[name].name : '';
    }
    return '';
  };

  return (
    <div className={fileUploadContainer}>
      <label htmlFor={`${name}-fileInput`} className={labelClass}>
        Choose file
      </label>
      <span id='fileNameContainer' className={fileNameClass}>
        {getFileName()}
      </span>
      <input
        id={`${name}-fileInput`}
        type='file'
        onChange={handleFileChange}
        className={fileInput}
      />
    </div>
  );
};

export default FieldFileInput;
