import React from 'react';
import styles from './Input.module.css';

type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'time' | 'search';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  type?: InputType;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, fullWidth = false, icon, type = 'text', ...props }, ref) => {
    return (
      <div className={`${styles.container} ${fullWidth ? styles.fullWidth : ''}`}>
        {label && <label className={styles.label}>{label}</label>}
        <div className={styles.inputWrapper}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <input
            ref={ref}
            type={type}
            className={`${styles.input} ${error ? styles.error : ''} ${icon ? styles.withIcon : ''}`}
            {...props}
          />
        </div>
        {error && <span className={styles.errorText}>{error}</span>}
        {helperText && !error && <span className={styles.helperText}>{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
