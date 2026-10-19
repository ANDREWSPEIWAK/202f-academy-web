import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import styles from './Library.module.css';
const articles = [
    { id: '1', title: 'Ботаника кофейной вишни', category: 'Зерно', level: 'BASE', readTime: 5, isRead: true },
    { id: '2', title: 'Обработка: натуральная, мытая, honey', category: 'Зерно', level: 'BASE', readTime: 8, isRead: false },
    { id: '3', title: 'Химия обжарки: реакция Майяра', category: 'Обжарка', level: 'PRO', readTime: 12, isRead: false },
    { id: '4', title: 'Экстракция: TDS и EY на практике', category: 'Экстракция', level: 'MEDIUM', readTime: 10, isRead: true },
    { id: '5', title: 'Вода для кофе: SCA стандарты', category: 'Вода', level: 'MEDIUM', readTime: 7, isRead: false },
    { id: '6', title: 'Каппинг по протоколу SCA', category: 'Сенсорика', level: 'MEDIUM', readTime: 9, isRead: false },
    { id: '7', title: 'Латте-арт: основы', category: 'Молоко', level: 'BASE', readTime: 6, isRead: true },
    { id: '8', title: 'Сигнатурные напитки: разработка ТТК', category: 'Меню', level: 'PRO', readTime: 15, isRead: false },
];
const categories = ['Все', 'Зерно', 'Обжарка', 'Экстракция', 'Вода', 'Сенсорика', 'Молоко', 'Меню'];
const Library = () => {
    const [filter, setFilter] = useState(categories[0]);
    const [selected, setSelected] = useState(null);
    const filtered = articles.filter((a) => filter === 'Все' || a.category === filter);
    return (_jsxs("div", { className: styles.library, children: [_jsx("div", { className: styles.header, children: _jsx("h1", { className: styles.title, children: "\u0411\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0430" }) }), _jsx("div", { className: styles.filters, children: categories.map((c) => (_jsx(Button, { variant: filter === c ? 'primary' : 'secondary', size: "small", onClick: () => setFilter(c), children: c }, c))) }), _jsxs("div", { className: styles.layout, children: [_jsx("div", { className: styles.list, children: filtered.map((article) => (_jsxs(Card, { className: `${styles.item} ${selected?.id === article.id ? styles.selected : ''}`, onClick: () => setSelected(article), children: [_jsxs("div", { className: styles.itemHeader, children: [_jsx(Badge, { variant: article.level === 'PRO' ? 'danger' : article.level === 'MEDIUM' ? 'warning' : 'primary', children: article.level }), _jsx("span", { className: styles.category, children: article.category })] }), _jsx("h3", { className: styles.itemTitle, children: article.title }), _jsxs("div", { className: styles.itemMeta, children: [_jsxs("span", { children: [article.readTime, " \u043C\u0438\u043D"] }), article.isRead && _jsx("span", { className: styles.read, children: "\u2713 \u041F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043E" })] })] }, article.id))) }), selected && (_jsx("div", { className: styles.preview, children: _jsxs(Card, { children: [_jsxs("div", { className: styles.previewHeader, children: [_jsx(Badge, { variant: selected.level === 'PRO' ? 'danger' : selected.level === 'MEDIUM' ? 'warning' : 'primary', children: selected.level }), _jsx("span", { className: styles.previewCategory, children: selected.category })] }), _jsx("h2", { className: styles.previewTitle, children: selected.title }), _jsxs("div", { className: styles.previewContent, children: [_jsx("p", { children: "\u0421\u043E\u0434\u0435\u0440\u0436\u0430\u043D\u0438\u0435 \u0441\u0442\u0430\u0442\u044C\u0438 \u0431\u0443\u0434\u0435\u0442 \u0437\u0434\u0435\u0441\u044C. \u042D\u0442\u043E \u043F\u0440\u0435\u0432\u044C\u044E \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u043E\u0439 \u0441\u0442\u0430\u0442\u044C\u0438 \u0438\u0437 \u0431\u0438\u0431\u043B\u0438\u043E\u0442\u0435\u043A\u0438 \u0437\u043D\u0430\u043D\u0438\u0439." }), _jsx("p", { children: "\u0417\u0434\u0435\u0441\u044C \u0431\u0443\u0434\u0435\u0442 \u043F\u043E\u043B\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442 \u0443\u0440\u043E\u043A\u0430 \u0441 \u0438\u043B\u043B\u044E\u0441\u0442\u0440\u0430\u0446\u0438\u044F\u043C\u0438, \u0441\u0445\u0435\u043C\u0430\u043C\u0438 \u0438 \u043F\u0440\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u043C\u0438 \u0437\u0430\u0434\u0430\u043D\u0438\u044F\u043C\u0438." })] }), _jsxs("div", { className: styles.previewMeta, children: [_jsxs("span", { children: [selected.readTime, " \u043C\u0438\u043D \u0447\u0442\u0435\u043D\u0438\u044F"] }), _jsx(Button, { variant: "primary", size: "small", children: "\u0427\u0438\u0442\u0430\u0442\u044C" })] })] }) }))] })] }));
};
export default Library;
