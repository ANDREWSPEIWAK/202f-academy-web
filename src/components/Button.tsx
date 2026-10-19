import React from 'react';
import styles from './Button.module.css';
import tokens from '../theme/tokens';

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
        style={{
          // Apply neumorphic design using CSS variables or inline styles
          backgroundColor: 
            variant === 'secondary' 
              ? tokens.colors.cardLevel2 
              : tokens.colors.cardLevel1,
          borderRadius: tokens.radii.small,
          // Default shadow (outer)
          boxShadow: tokens.shadows.default,
          transition: `transform ${tokens.animation.press.duration}ms ease`,
          // We'll handle hover/active states in CSS
        }}
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
