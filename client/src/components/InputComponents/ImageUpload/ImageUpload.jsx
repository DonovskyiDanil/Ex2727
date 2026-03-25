import React, { useRef, useEffect } from 'react';
import classNames from 'classnames';
import { useField } from 'formik';
import styles from './ImageUpload.module.sass';

const ImageUpload = props => {
  const [field, meta, helpers] = useField(props.name);
  const { uploadContainer, inputContainer, imgStyle } = props.classes;
  const fileInputRef = useRef(null);
  const previewRef = useRef(null);

  const onChange = e => {
    const file = e.target.files[0];
    const imageType = /image.*/;
    
    if (!file) {
      return;
    }

    if (!file.type.match(imageType)) {
      // Clear the input if file type is invalid
      e.target.value = '';
      helpers.setValue(null);
      if (previewRef.current) {
        previewRef.current.src = '';
      }
      return;
    }

    // Set the file value in Formik
    helpers.setValue(file);
    
    // Preview the image
    if (file && previewRef.current) {
      const reader = new FileReader();
      reader.onload = () => {
        previewRef.current.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    helpers.setValue(null);
    if (previewRef.current) {
      previewRef.current.src = '';
    }
  };

  // Clear preview when field value is cleared externally
  useEffect(() => {
    if (!field.value && previewRef.current) {
      previewRef.current.src = '';
    }
  }, [field.value]);

  return (
    <div className={uploadContainer}>
      <div className={inputContainer}>
        <span>Support only images (*.png, *.gif, *.jpeg)</span>
        <input
          ref={fileInputRef}
          id="fileInput"
          name={field.name}
          type="file"
          accept="image/*"
          onChange={onChange}
        />
        <label htmlFor="fileInput">Choose file</label>
        {field.value && (
          <button type="button" onClick={handleClear} className={styles.clearButton}>
            Clear
          </button>
        )}
      </div>
      <img
        ref={previewRef}
        id="imagePreview"
        className={classNames({ [imgStyle]: !!field.value })}
        alt="user preview"
      />
      {meta.touched && meta.error && (
        <div className={styles.error}>{meta.error}</div>
      )}
    </div>
  );
};

export default ImageUpload;
