<<<<<<< HEAD
import React, { useRef, useEffect, useState } from 'react';
=======
import React, { useRef, useEffect } from 'react';
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
import classNames from 'classnames';
import { useField } from 'formik';
import styles from './ImageUpload.module.sass';

const ImageUpload = props => {
  const [field, meta, helpers] = useField(props.name);
  const { uploadContainer, inputContainer, imgStyle } = props.classes;
  const fileInputRef = useRef(null);
<<<<<<< HEAD
  const [preview, setPreview] = useState(null);
=======
  const previewRef = useRef(null);
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8

  const onChange = e => {
    const file = e.target.files[0];
    const imageType = /image.*/;
    
    if (!file) {
      return;
    }

    if (!file.type.match(imageType)) {
<<<<<<< HEAD
      e.target.value = '';
      helpers.setValue(null);
      setPreview(null);
      return;
    }

    helpers.setValue(file);

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
=======
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
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
  };

  const handleClear = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    helpers.setValue(null);
<<<<<<< HEAD
    setPreview(null);
  };

  // Если значение поля сбросили извне (например, после submit) — убираем превью
  useEffect(() => {
    if (!field.value) {
      setPreview(null);
=======
    if (previewRef.current) {
      previewRef.current.src = '';
    }
  };

  // Clear preview when field value is cleared externally
  useEffect(() => {
    if (!field.value && previewRef.current) {
      previewRef.current.src = '';
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
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
<<<<<<< HEAD
      {/* Раньше <img> рендерился всегда, в том числе с пустым src —
          браузер показывал alt вместо картинки. Теперь рендерим только превью. */}
      {preview && (
        <img
          id="imagePreview"
          src={preview}
          className={classNames(imgStyle)}
          alt="preview"
        />
      )}
=======
      <img
        ref={previewRef}
        id="imagePreview"
        className={classNames({ [imgStyle]: !!field.value })}
        alt="user preview"
      />
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
      {meta.touched && meta.error && (
        <div className={styles.error}>{meta.error}</div>
      )}
    </div>
  );
};

export default ImageUpload;
