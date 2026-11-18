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
  name = '',
  value = null,
  onChange = null,
  options = [],
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
            />
          );
        })}
      </div>
      {name && (
        <input type="hidden" name={name} value={selectedValue ?? ''} />
      )}
    </div>
  );
};

export default ButtonGroup;
