import React from 'react';
import styles from './Card.module.css';
import tokens from '../theme/tokens';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick, 
  interactive = false 
}) => {
  return (
    <div
      className={`${styles.card} ${interactive ? styles.interactive : ''} ${className}`}
      onClick={onClick}
      style={{
        backgroundColor: tokens.colors.cardLevel1,
        borderRadius: tokens.radii.small,
        // Default shadow (outer)
        boxShadow: tokens.shadows.outer,
        transition: 'all 0.2s ease',
        // We'll handle hover/active states in CSS for interactive cards
      }}
    >
      {children}
    </div>
  );
};

Card.displayName = 'Card';
export default Card;
