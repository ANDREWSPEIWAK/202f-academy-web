import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import styles from './Tests.module.css';
const tests = [
    { id: 'test-1', title: 'Основы зерна', category: 'Зерно', level: 'BASE', questions: 10, passed: true, score: 90 },
    { id: 'test-2', title: 'Помол и экстракция', category: 'Помол', level: 'BASE', questions: 10, passed: true, score: 85 },
    { id: 'test-3', title: 'Эспрессо базовый', category: 'Эспрессо', level: 'BASE', questions: 15, passed: false, score: 70 },
    { id: 'test-4', title: 'Молоко и капучино', category: 'Молоко', level: 'BASE', questions: 10, passed: null, score: null },
    { id: 'test-5', title: 'Дайлинг PRO', category: 'Дайлинг', level: 'PRO', questions: 20, passed: null, score: null },
    { id: 'test-6', title: 'Сенсорика', category: 'Сенсорика', level: 'MEDIUM', questions: 15, passed: null, score: null },
];
const Tests = () => {
    const [filter, setFilter] = useState('all');
    const filteredTests = tests.filter((test) => {
        if (filter === 'all')
            return true;
        if (filter === 'passed')
            return test.passed === true;
        if (filter === 'failed')
            return test.passed === false;
        if (filter === 'available')
            return test.passed === null;
        return true;
    });
    const levelColors = {
        BASE: '#5c3d2e',
        MEDIUM: '#8b5a2b',
        PRO: '#a03d2a',
    };
    return (_jsxs("div", { className: styles.tests, children: [_jsx("div", { className: styles.header, children: _jsx("h1", { className: styles.title, children: "\u0422\u0435\u0441\u0442\u044B" }) }), _jsx("div", { className: styles.filters, children: ['all', 'available', 'passed', 'failed'].map((f) => (_jsxs(Button, { variant: filter === f ? 'primary' : 'secondary', size: "small", onClick: () => setFilter(f), children: [f === 'all' && 'Все', f === 'available' && 'Доступные', f === 'passed' && 'Пройденные', f === 'failed' && 'Не пройденные'] }, f))) }), _jsx("div", { className: styles.grid, children: filteredTests.map((test) => (_jsxs(Card, { className: styles.testCard, children: [_jsxs("div", { className: styles.testHeader, children: [_jsx(Badge, { variant: test.level === 'PRO' ? 'danger' : test.level === 'MEDIUM' ? 'warning' : 'primary', children: test.level }), _jsx("span", { className: styles.category, children: test.category })] }), _jsx("h3", { className: styles.testTitle, children: test.title }), _jsxs("div", { className: styles.testMeta, children: [_jsxs("span", { children: [test.questions, " \u0432\u043E\u043F\u0440\u043E\u0441\u043E\u0432"] }), test.passed !== null && (_jsx("span", { className: test.passed ? styles.passed : styles.failed, children: test.passed ? '✓ Пройден' : '✗ Не пройден' })), test.score !== null && _jsxs("span", { children: [test.score, "%"] })] }), _jsx(Button, { fullWidth: true, variant: test.passed === true ? 'secondary' : 'primary', disabled: test.passed === true, children: test.passed === true ? 'Повторить' : 'Начать тест' })] }, test.id))) })] }));
};
export default Tests;
