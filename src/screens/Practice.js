import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import styles from './Practice.module.css';
const Practice = () => {
    const [activeTab, setActiveTab] = useState('timer');
    const [brewMethod, setBrewMethod] = useState('V60');
    const [timerActive, setTimerActive] = useState(false);
    const [timerValue, setTimerValue] = useState(0);
    const brewMethods = [
        { id: 'V60', name: 'V60', bloomTime: 35, targetTime: 165, targetWater: 300.6 },
        { id: 'KALITA', name: 'Kalita 185', bloomTime: 30, targetTime: 180, targetWater: 300 },
        { id: 'AEROPRESS', name: 'AeroPress', bloomTime: 0, targetTime: 180, targetWater: 200 },
        { id: 'ESPRESSO', name: 'Espresso', bloomTime: 0, targetTime: 27, targetWater: 36 },
    ];
    const currentMethod = brewMethods.find((m) => m.id === brewMethod);
    React.useEffect(() => {
        if (!timerActive)
            return;
        const interval = setInterval(() => {
            setTimerValue((v) => v + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timerActive]);
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };
    return (_jsxs("div", { className: styles.practice, children: [_jsx("div", { className: styles.header, children: _jsx("h1", { className: styles.title, children: "\u041F\u0440\u0430\u043A\u0442\u0438\u043A\u0430" }) }), _jsx("div", { className: styles.tabs, children: ['timer', 'log', 'calculator'].map((tab) => (_jsx(Button, { variant: activeTab === tab ? 'primary' : 'secondary', size: "small", onClick: () => setActiveTab(tab), children: tab === 'timer' ? '⏱ Таймер' : tab === 'log' ? '📋 Лог' : '🧮 Калькулятор' }, tab))) }), _jsxs("div", { className: styles.content, children: [activeTab === 'timer' && (_jsxs("div", { className: styles.section, children: [_jsx("div", { className: styles.methodSelector, children: brewMethods.map((method) => (_jsx(Button, { variant: brewMethod === method.id ? 'primary' : 'secondary', size: "small", onClick: () => {
                                        setBrewMethod(method.id);
                                        setTimerValue(0);
                                        setTimerActive(false);
                                    }, children: method.name }, method.id))) }), _jsx(Card, { children: _jsxs("div", { className: styles.timerCard, children: [_jsx("p", { className: styles.timerLabel, children: "\u0412\u0440\u0435\u043C\u044F \u0437\u0430\u0432\u0430\u0440\u043A\u0438" }), _jsx("div", { className: styles.timerDisplay, children: formatTime(timerValue) }), _jsxs("p", { className: styles.timerTarget, children: ["\u0426\u0435\u043B\u044C: ", formatTime(currentMethod?.targetTime || 0)] }), currentMethod?.bloomTime > 0 && (_jsx("div", { className: styles.bloomInfo, children: _jsxs("p", { children: ["Bloom: ", currentMethod?.bloomTime, "\u0441"] }) })), _jsxs("div", { className: styles.timerControls, children: [_jsx(Button, { variant: "primary", onClick: () => setTimerActive(!timerActive), children: timerActive ? '⏸ Пауза' : '▶ Старт' }), _jsx(Button, { variant: "secondary", onClick: () => {
                                                        setTimerValue(0);
                                                        setTimerActive(false);
                                                    }, children: "\uD83D\uDD04 \u0421\u0431\u0440\u043E\u0441" })] })] }) })] })), activeTab === 'log' && (_jsx("div", { className: styles.section, children: _jsx(Card, { children: _jsxs("div", { className: styles.logForm, children: [_jsx("h3", { className: styles.formTitle, children: "\u0417\u0430\u043F\u0438\u0441\u044C \u0437\u0430\u0432\u0430\u0440\u043A\u0438" }), _jsxs("div", { className: styles.formGroup, children: [_jsx(Input, { label: "\u041A\u043E\u0444\u0435", placeholder: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u043E\u0444\u0435" }), _jsx(Input, { label: "\u041F\u0440\u043E\u0438\u0441\u0445\u043E\u0436\u0434\u0435\u043D\u0438\u0435", placeholder: "\u042D\u0444\u0438\u043E\u043F\u0438\u044F, \u041A\u0435\u043D\u0438\u044F..." }), _jsx(Input, { label: "\u0414\u043E\u0437\u0430 (\u0433)", type: "number", defaultValue: "18" }), _jsx(Input, { label: "\u0412\u043E\u0434\u0430 (\u0433)", type: "number", defaultValue: "300" }), _jsx(Input, { label: "\u0421\u043E\u043E\u0442\u043D\u043E\u0448\u0435\u043D\u0438\u0435", placeholder: "1:16.7" }), _jsx(Input, { label: "\u0412\u0440\u0435\u043C\u044F \u0437\u0430\u0432\u0430\u0440\u043A\u0438 (\u0441\u0435\u043A)", type: "number", defaultValue: "180" }), _jsx(Input, { label: "TDS (%)", type: "number", step: "0.01", placeholder: "1.35" }), _jsx(Input, { label: "Extraction Yield (%)", type: "number", step: "0.1", placeholder: "20" }), _jsx(Input, { label: "\u041E\u0446\u0435\u043D\u043A\u0430 (1-5)", type: "number", min: "1", max: "5" })] }), _jsx(Button, { variant: "primary", fullWidth: true, children: "\uD83D\uDCBE \u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0437\u0430\u043F\u0438\u0441\u044C" })] }) }) })), activeTab === 'calculator' && (_jsxs("div", { className: styles.section, children: [_jsx(Card, { children: _jsxs("div", { className: styles.calculator, children: [_jsx("h3", { className: styles.formTitle, children: "\u041A\u0430\u043B\u044C\u043A\u0443\u043B\u044F\u0442\u043E\u0440 \u043E\u0442\u043D\u043E\u0448\u0435\u043D\u0438\u044F" }), _jsxs("div", { className: styles.formGroup, children: [_jsx(Input, { label: "\u041A\u043E\u0444\u0435 (\u0433)", type: "number", defaultValue: "18" }), _jsx(Input, { label: "\u0421\u043E\u043E\u0442\u043D\u043E\u0448\u0435\u043D\u0438\u0435", placeholder: "1:16.7" })] }), _jsx("div", { className: styles.result, children: _jsxs("p", { children: ["\u0412\u043E\u0434\u0430: ", _jsx("strong", { children: "300.6 \u0433" })] }) })] }) }), _jsx(Card, { children: _jsxs("div", { className: styles.calculator, children: [_jsx("h3", { className: styles.formTitle, children: "\u041A\u0430\u043B\u044C\u043A\u0443\u043B\u044F\u0442\u043E\u0440 Extraction Yield" }), _jsxs("div", { className: styles.formGroup, children: [_jsx(Input, { label: "\u0414\u043E\u0437\u0430 (\u0433)", type: "number", defaultValue: "18" }), _jsx(Input, { label: "\u0412\u0435\u0441 \u043D\u0430\u043F\u0438\u0442\u043A\u0430 (\u0433)", type: "number", defaultValue: "300" }), _jsx(Input, { label: "TDS (%)", type: "number", step: "0.01", defaultValue: "1.35" })] }), _jsx("div", { className: styles.result, children: _jsxs("p", { children: ["EY: ", _jsx("strong", { children: "22.5%" })] }) })] }) })] }))] })] }));
};
export default Practice;
