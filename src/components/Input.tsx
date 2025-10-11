import React, { useState } from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  onChange?: (value: string) => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  onChange,
  className = '',
  style,
  ...props
}) => {
  const [value, setValue] = useState(props.value || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange?.(e.target.value);
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    ...style,
  };

  const labelStyles: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 500,
    color: '#333333',
  };

  const inputStyles: React.CSSProperties = {
    padding: '8px 12px',
    fontSize: '14px',
    border: `1px solid ${error ? '#dc3545' : '#cccccc'}`,
    borderRadius: '4px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  };

  const errorStyles: React.CSSProperties = {
    fontSize: '12px',
    color: '#dc3545',
  };

  const helperStyles: React.CSSProperties = {
    fontSize: '12px',
    color: '#6c757d',
  };

  return (
    <div className={className} style={containerStyles}>
      {label && <label style={labelStyles}>{label}</label>}
      <input
        {...props}
        value={value}
        onChange={handleChange}
        style={inputStyles}
      />
      {error && <span style={errorStyles}>{error}</span>}
      {helperText && !error && <span style={helperStyles}>{helperText}</span>}
    </div>
  );
};
