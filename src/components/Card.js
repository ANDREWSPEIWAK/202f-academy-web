import { jsx as _jsx } from "react/jsx-runtime";
import styles from './Card.module.css';
const Card = ({ children, className = '', onClick, interactive = false }) => {
    return (_jsx("div", { className: `${styles.card} ${interactive ? styles.interactive : ''} ${className}`, onClick: onClick, children: children }));
};
export default Card;
