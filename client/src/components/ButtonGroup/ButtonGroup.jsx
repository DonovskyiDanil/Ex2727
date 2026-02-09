import React, { useState, useEffect } from 'react';
import Button from './Button';

const ButtonGroup = ({ 
  name = '',
  value = null,
  onChange = null,
  options = [],
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
            />
          );
        })}
      </div>
      
      {name && (
        <input 
          type="hidden" 
          name={name} 
          value={selectedValue || ''} 
        />
      )}
    </div>
  );
};

export default ButtonGroup;
