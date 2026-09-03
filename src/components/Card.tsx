import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick, interactive = false }) => {
  return (
    <div
      className={`${styles.card} ${interactive ? styles.interactive : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
