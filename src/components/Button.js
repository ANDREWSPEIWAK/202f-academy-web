import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import styles from './Button.module.css';
const Button = React.forwardRef(({ variant = 'primary', size = 'medium', isLoading = false, icon, fullWidth = false, children, disabled, ...props }, ref) => {
    return (_jsx("button", { ref: ref, className: `${styles.button} ${styles[variant]} ${styles[size]} ${fullWidth ? styles.fullWidth : ''} ${isLoading || disabled ? styles.disabled : ''}`, disabled: isLoading || disabled, ...props, children: isLoading ? (_jsx("span", { className: styles.spinner })) : (_jsxs(_Fragment, { children: [icon && _jsx("span", { className: styles.icon, children: icon }), children] })) }));
});
Button.displayName = 'Button';
export default Button;
