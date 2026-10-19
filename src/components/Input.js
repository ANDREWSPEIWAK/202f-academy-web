import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import styles from './Input.module.css';
const Input = React.forwardRef(({ label, error, helperText, fullWidth = false, icon, type = 'text', ...props }, ref) => {
    return (_jsxs("div", { className: `${styles.container} ${fullWidth ? styles.fullWidth : ''}`, children: [label && _jsx("label", { className: styles.label, children: label }), _jsxs("div", { className: styles.inputWrapper, children: [icon && _jsx("span", { className: styles.icon, children: icon }), _jsx("input", { ref: ref, type: type, className: `${styles.input} ${error ? styles.error : ''} ${icon ? styles.withIcon : ''}`, ...props })] }), error && _jsx("span", { className: styles.errorText, children: error }), helperText && !error && _jsx("span", { className: styles.helperText, children: helperText })] }));
});
Input.displayName = 'Input';
export default Input;
