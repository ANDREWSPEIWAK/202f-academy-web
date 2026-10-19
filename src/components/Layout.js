import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './Layout.module.css';
const SECTION_TITLES = {
    academy: 'Академия',
    tests: 'Тесты',
    library: 'Библиотека',
    trainer: 'Тренер',
    practice: 'Практика',
};
const Layout = ({ activeSection, onNavigate, children }) => {
    const title = SECTION_TITLES[activeSection];
    return (_jsxs("div", { className: styles.layout, children: [_jsx("header", { className: styles.header, children: _jsx("h1", { className: styles.title, children: title }) }), _jsx("main", { className: styles.main, children: children })] }));
};
export default Layout;
