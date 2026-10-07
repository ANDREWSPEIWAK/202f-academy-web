import { jsx as _jsx } from "react/jsx-runtime";
import styles from './Badge.module.css';
const Badge = ({ children, variant = 'primary', size = 'medium' }) => {
    return (_jsx("span", { className: `${styles.badge} ${styles[variant]} ${styles[size]}`, children: children }));
};
export default Badge;
