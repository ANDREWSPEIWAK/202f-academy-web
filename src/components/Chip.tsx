import React from 'react';
import styles from './Chip.module.css';

interface ChipProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

const Chip: React.FC<ChipProps> = ({ children, active = false, onClick, className = '' }) => {
  return (
    <button
      className={`${styles.chip} ${active ? styles.active : ''} ${className}`}
      onClick={onClick}
      type="button"
      aria-pressed={active}
    >
      {children}
    </button>
  );
};

export default Chip;
