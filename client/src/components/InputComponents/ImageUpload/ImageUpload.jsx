import React, { useRef, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useField } from 'formik';
import styles from './ImageUpload.module.sass';

const ImageUpload = props => {
  const [field, meta, helpers] = useField(props.name);
  const { uploadContainer, inputContainer, imgStyle } = props.classes;
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const onChange = e => {
    const file = e.target.files[0];
    const imageType = /image.*/;
    
    if (!file) {
      return;
    }

    if (!file.type.match(imageType)) {
      e.target.value = '';
      helpers.setValue(null);
      setPreview(null);
      return;
    }

    helpers.setValue(file);

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    helpers.setValue(null);
    setPreview(null);
  };

  // Если значение поля сбросили извне (например, после submit) — убираем превью
  useEffect(() => {
    if (!field.value) {
      setPreview(null);
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
      {meta.touched && meta.error && (
        <div className={styles.error}>{meta.error}</div>
      )}
    </div>
  );
};

export default ImageUpload;
