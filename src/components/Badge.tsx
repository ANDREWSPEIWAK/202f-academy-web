import React from 'react';
import styles from './Badge.module.css';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'small' | 'medium' | 'large';
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', size = 'medium' }) => {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${styles[size]}`}>
      {children}
    </span>
  );
};

export default Badge;
