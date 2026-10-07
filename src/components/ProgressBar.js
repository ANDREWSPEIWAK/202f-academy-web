import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './ProgressBar.module.css';
const ProgressBar = ({ value, max = 100, label, showLabel = true, size = 'medium', }) => {
    const percentage = Math.min((value / max) * 100, 100);
    return (_jsxs("div", { className: styles.container, children: [(label || showLabel) && (_jsxs("div", { className: styles.header, children: [_jsx("span", { className: styles.label, children: label || 'Progress' }), _jsxs("span", { className: styles.percentage, children: [Math.round(percentage), "%"] })] })), _jsx("div", { className: `${styles.bar} ${styles[size]}`, children: _jsx("div", { className: styles.fill, style: {
                        width: `${percentage}%`,
                    } }) })] }));
};
export default ProgressBar;
