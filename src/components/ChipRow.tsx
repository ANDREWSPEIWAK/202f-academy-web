import React from 'react';
import styles from './ChipRow.module.css';

interface ChipRowProps {
  children: React.ReactNode;
}

const ChipRow: React.FC<ChipRowProps> = ({ children }) => {
  return (
    <div className={styles.chipRow}>
      {children}
    </div>
  );
};

export default ChipRow;
