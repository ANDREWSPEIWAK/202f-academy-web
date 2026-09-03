import React from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'medium',
    isLoading = false,
    icon,
    fullWidth = false,
    children,
    disabled,
    ...props
  }, ref) => {
    return (
      <button
        ref={ref}
        className={`${styles.button} ${styles[variant]} ${styles[size]} ${
          fullWidth ? styles.fullWidth : ''
        } ${isLoading || disabled ? styles.disabled : ''}`}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <span className={styles.spinner} />
        ) : (
          <>
            {icon && <span className={styles.icon}>{icon}</span>}
            {children}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
