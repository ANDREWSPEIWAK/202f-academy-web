import React from 'react';
import styles from './IconButton.module.css';

interface IconButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel: string;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({ children, onClick, ariaLabel, className = '' }) => {
  return (
    <button
      className={`${styles.iconButton} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
      type="button"
    >
      {children}
    </button>
  );
};

export default IconButton;
