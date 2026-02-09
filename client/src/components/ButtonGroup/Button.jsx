import React from 'react';

const Button = ({ title, description, recommended, selected, onClick }) => {
  const buttonStyle = {
    position: 'relative',
    padding: '24px 20px',
    border: selected ? '2px solid #3b82f6' : '2px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: selected ? '#eff6ff' : '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    minHeight: '140px',
    width: '100%',
    boxSizing: 'border-box',
    boxShadow: selected ? '0 4px 12px rgba(59, 130, 246, 0.2)' : 'none'
  };

  const titleStyle = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0',
    padding: '0',
    marginTop: '12px'
  };

  const descriptionStyle = {
    fontSize: '14px',
    color: '#6b7280',
    margin: '8px 0 0 0',
    padding: '0',
    lineHeight: '1.5',
    marginTop: 'auto'
  };

  const recommendedStyle = {
    position: 'absolute',
    top: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#fef3c7',
    color: '#92400e',
    fontSize: '9px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '20px',
    border: '1px solid #fcd34d',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    letterSpacing: '0.5px'
  };

  const checkmarkStyle = {
    position: 'absolute',
    top: '12px',
    right: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    backgroundColor: '#3b82f6',
    borderRadius: '50%',
    color: 'white',
    fontSize: '16px'
  };

  const svgStyle = {
    width: '18px',
    height: '18px',
    stroke: 'currentColor',
    strokeWidth: '3',
    fill: 'none'
  };

  return (
    <div
      onClick={onClick}
      style={buttonStyle}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = '#93c5fd';
          e.currentTarget.style.backgroundColor = '#f0f9ff';
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = '#e5e7eb';
          e.currentTarget.style.backgroundColor = '#ffffff';
        }
      }}
    >
      {recommended && (
        <div style={recommendedStyle}>
          Recommended
        </div>
      )}
      {selected && (
        <div style={checkmarkStyle}>
          <svg style={svgStyle} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      <h4 style={titleStyle}>{title}</h4>
      <p style={descriptionStyle}>
        {description}
      </p>
    </div>
  );
};

export default Button;
