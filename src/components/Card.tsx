import React from 'react';

export interface CardProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  footer,
  className = '',
  style,
}) => {
  const cardStyles: React.CSSProperties = {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    ...style,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '12px',
    color: '#333333',
  };

  const footerStyles: React.CSSProperties = {
    marginTop: '16px',
    paddingTop: '12px',
    borderTop: '1px solid #e0e0e0',
  };

  return (
    <div className={className} style={cardStyles}>
      {title && <div style={titleStyles}>{title}</div>}
      <div>{children}</div>
      {footer && <div style={footerStyles}>{footer}</div>}
    </div>
  );
};
