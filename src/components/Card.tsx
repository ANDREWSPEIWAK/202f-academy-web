import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  interactive?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick, style, interactive = false }) => {
  const isClickable = onClick || interactive;
  return (
    <div
      className={`${styles.card} ${isClickable ? styles.clickable : ''} ${className}`}
      onClick={onClick}
      style={style}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {children}
    </div>
  );
};

export default Card;

