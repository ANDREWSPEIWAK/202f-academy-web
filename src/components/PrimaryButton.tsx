import React from 'react';
import styles from './PrimaryButton.module.css';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children, onClick, className = '', type = 'button' }) => {
  return (
    <button
      className={`${styles.button} ${className}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
