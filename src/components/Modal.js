import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './Modal.module.css';
const Modal = ({ isOpen, title, children, onClose, size = 'medium', showCloseButton = true, }) => {
    if (!isOpen)
        return null;
    return (_jsx("div", { className: styles.overlay, onClick: onClose, children: _jsxs("div", { className: `${styles.modal} ${styles[size]}`, onClick: (e) => e.stopPropagation(), children: [title && (_jsxs("div", { className: styles.header, children: [_jsx("h2", { className: styles.title, children: title }), showCloseButton && (_jsx("button", { className: styles.closeButton, onClick: onClose, children: "\u2715" }))] })), _jsx("div", { className: styles.content, children: children })] }) }));
};
export default Modal;
