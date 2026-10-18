import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import styles from './Trainer.module.css';
const Trainer = () => {
    const [mode, setMode] = useState('TRAINER');
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!input.trim())
            return;
        setMessages([...messages, { role: 'user', content: input }]);
        setInput('');
        setTimeout(() => {
            const responses = {
                'TRAINER': 'Начни с самого вероятного фактора: что бы ты изменил первым — помол, дозу или выход?',
                'GUEST': 'Вот несколько советов по вашему вопросу...',
                'EXAM': 'Пожалуйста, ответьте на этот вопрос без помощи.',
            };
            setMessages((prev) => [
                ...prev,
                { role: 'trainer', content: responses[mode] },
            ]);
        }, 500);
    };
    return (_jsxs("div", { className: styles.trainer, children: [_jsx("div", { className: styles.header, children: _jsx("h1", { className: styles.title, children: "\u0422\u0440\u0435\u043D\u0435\u0440" }) }), _jsx("div", { className: styles.modeSelector, children: ['TRAINER', 'GUEST', 'EXAM'].map((m) => (_jsx(Button, { variant: mode === m ? 'primary' : 'secondary', size: "small", onClick: () => setMode(m), children: m === 'TRAINER' ? '💪 Тренер' : m === 'GUEST' ? '👥 Гость' : '📝 Экзамен' }, m))) }), _jsx("div", { className: styles.messagesContainer, children: messages.length === 0 ? (_jsxs("div", { className: styles.emptyState, children: [_jsx("p", { className: styles.icon, children: "\uD83E\uDD16" }), _jsx("p", { className: styles.text, children: mode === 'TRAINER'
                                ? 'Задай мне вопрос о кофе'
                                : mode === 'GUEST'
                                    ? 'Я помогу тебе, но не буду давать прямые ответы'
                                    : 'Экзаменационный режим. Показывай свои знания!' })] })) : (_jsx("div", { className: styles.messages, children: messages.map((msg, idx) => (_jsx("div", { className: `${styles.message} ${styles[msg.role]}`, children: _jsx(Card, { children: _jsx("p", { children: msg.content }) }) }, idx))) })) }), _jsxs("form", { onSubmit: handleSendMessage, className: styles.inputForm, children: [_jsx(Input, { placeholder: "\u0412\u0432\u0435\u0434\u0438 \u0441\u0432\u043E\u0439 \u0432\u043E\u043F\u0440\u043E\u0441...", value: input, onChange: (e) => setInput(e.target.value), fullWidth: true }), _jsx(Button, { type: "submit", variant: "primary", children: "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C" })] })] }));
};
export default Trainer;
