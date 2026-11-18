<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import Button from './Button';
import styles from './ButtonGroup.module.sass';

const normalizeOption = (option, index) => {
  if (option && typeof option === 'object') {
    const optionValue = option.value ?? option.id ?? index;
    return {
      id: option.id ?? optionValue,
      value: optionValue,
      title: option.title ?? option.label ?? String(optionValue),
      selectedTitle: option.selectedTitle,
      unselectedTitle: option.unselectedTitle,
      description: option.description ?? '',
      recommended: Boolean(option.recommended),
    };
  }

  return {
    id: index,
    value: option,
    title: String(option),
    description: '',
    recommended: index === 0,
  };
};

const ButtonGroup = ({
=======
import React, { useState, useEffect } from 'react';
import Button from './Button';

const ButtonGroup = ({ 
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
  name = '',
  value = null,
  onChange = null,
  options = [],
<<<<<<< HEAD
  question = null,
  onSelect = null,
}) => {
  const [selectedValue, setSelectedValue] = useState(value);
  const displayOptions = options.map(normalizeOption);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleSelect = (optionValue) => {
    setSelectedValue(optionValue);
    if (onChange) onChange(optionValue);
    if (onSelect) onSelect(optionValue);
  };

  if (displayOptions.length === 0) return null;

  return (
    <div className={styles.buttonGroupWrapper}>
      {question && <h3 className={styles.question}>{question}</h3>}
      <div className={styles.buttonsGrid}>
        {displayOptions.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <Button
              key={option.id}
              title={
                isSelected
                  ? option.selectedTitle ?? option.title
                  : option.unselectedTitle ?? option.title
              }
              description={option.description}
              recommended={option.recommended}
              selected={isSelected}
              onClick={() => handleSelect(option.value)}
=======
  variant = 'primary',
  question = null,
  onSelect = null
}) => {
  const [selectedValue, setSelectedValue] = useState(value);

  const handleSelect = (optionValue) => {
    // Сразу обновляем UI
    setSelectedValue(optionValue);
    
    // Отправляем в Formik
    if (onChange) {
      onChange(optionValue);
    }
    if (onSelect) {
      onSelect(optionValue);
    }
  };

  if (!options || options.length === 0) {
    return null;
  }

  // Проверяем формат options
  // Если это готовые объекты с id/value/title/description - используем их
  // Если это простой массив [{value, label}] - преобразуем
  let displayOptions;
  
  if (options[0]?.id && options[0]?.title) {
    // Уже готовые объекты с полной информацией
    displayOptions = options;
  } else {
    // Нужно преобразовать простой формат [{value, label}]
    displayOptions = options.map((option, index) => {
      const val = option.value || option;
      const label = option.label || option;
      
      return {
        id: index,
        value: val,
        title: label,
        description: label,
        recommended: index === 0
      };
    });
  }

  const containerStyle = {
    width: '100%',
    backgroundColor: 'transparent',
    padding: '0'
  };

  const questionStyle = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '24px',
    textAlign: 'left',
    margin: '0 0 24px 0'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px',
    width: '100%'
  };

  return (
    <div style={containerStyle}>
      {question && (
        <h3 style={questionStyle}>
          {question}
        </h3>
      )}
      
      <div style={gridStyle}>
        {displayOptions.map((opt) => {
          const isSelected = selectedValue === (opt.value || opt.id);
          
          return (
            <Button
              key={opt.id}
              title={isSelected ? "Yes" : "No"}
              description={opt.description}
              recommended={opt.recommended}
              selected={isSelected}
              onClick={() => handleSelect(opt.value || opt.id)}
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
            />
          );
        })}
      </div>
<<<<<<< HEAD
      {name && (
        <input type="hidden" name={name} value={selectedValue ?? ''} />
=======
      
      {name && (
        <input 
          type="hidden" 
          name={name} 
          value={selectedValue || ''} 
        />
>>>>>>> f7c8c07f8e0c3520ffe12f011633a5a3b1b17bf8
      )}
    </div>
  );
};

export default ButtonGroup;
