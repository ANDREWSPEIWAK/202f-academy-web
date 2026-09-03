import React from 'react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  label?: string;
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showLabel = true,
  size = 'medium',
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={styles.container}>
      {(label || showLabel) && (
        <div className={styles.header}>
          <span className={styles.label}>{label || 'Progress'}</span>
          <span className={styles.percentage}>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`${styles.bar} ${styles[size]}`}>
        <div
          className={styles.fill}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
