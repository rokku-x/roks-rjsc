import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  className = '',
  style,
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    padding: size === 'small' ? '4px 8px' : size === 'large' ? '12px 24px' : '8px 16px',
    fontSize: size === 'small' ? '12px' : size === 'large' ? '18px' : '14px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  };

  const variantStyles: React.CSSProperties = {
    primary: {
      backgroundColor: '#007bff',
      color: '#ffffff',
    },
    secondary: {
      backgroundColor: '#6c757d',
      color: '#ffffff',
    },
    danger: {
      backgroundColor: '#dc3545',
      color: '#ffffff',
    },
  }[variant];

  return (
    <button
      className={className}
      style={{ ...baseStyles, ...variantStyles, ...style }}
      {...props}
    >
      {children}
    </button>
  );
};
