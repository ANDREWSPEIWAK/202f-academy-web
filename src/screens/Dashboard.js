import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import Badge from '../components/Badge';
import styles from './Dashboard.module.css';
const Dashboard = ({ onNavigate }) => {
    const profile = {
        currentLevel: 'JUNIOR',
        totalProgress: 31,
        currentStreak: 7,
        totalLessonsCompleted: 8,
        totalTestsPassed: 3,
        totalBrewLogsRecorded: 15,
    };
    const skills = [
        { id: '1', name: 'Espresso', level: 'PRACTICING', progress: 45 },
        { id: '2', name: 'Milk', level: 'LEARNING', progress: 30 },
        { id: '3', name: 'Filter', level: 'LEARNING', progress: 25 },
        { id: '4', name: 'Service', level: 'COMPETENT', progress: 65 },
        { id: '5', name: 'Sensory', level: 'LEARNING', progress: 20 },
        { id: '6', name: 'Coffee Knowledge', level: 'PRACTICING', progress: 50 },
    ];
    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12)
            return '🌅 Доброе утро';
        if (hour < 18)
            return '☀️ Добрый день';
        return '🌙 Добрый вечер';
    };
    return (_jsxs("div", { className: styles.dashboard, children: [_jsxs("div", { className: styles.header, children: [_jsx("h1", { className: styles.greeting, children: greeting() }), _jsx("p", { className: styles.subtitle, children: "\u0414\u043E\u0431\u0440\u043E \u043F\u043E\u0436\u0430\u043B\u043E\u0432\u0430\u0442\u044C \u0432 202F Academy" })] }), _jsx("div", { className: styles.levelCard, children: _jsx(Card, { children: _jsxs("div", { className: styles.levelContent, children: [_jsxs("div", { children: [_jsx("h2", { className: styles.levelTitle, children: profile.currentLevel }), _jsx("p", { className: styles.levelSubtitle, children: "\u0422\u0432\u043E\u0439 \u0442\u0435\u043A\u0443\u0449\u0438\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C" })] }), _jsxs("div", { className: styles.progressSection, children: [_jsx(ProgressBar, { value: profile.totalProgress, showLabel: false }), _jsxs("p", { className: styles.progressLabel, children: [profile.totalProgress, "%"] })] })] }) }) }), _jsxs("div", { className: styles.statsGrid, children: [_jsx(Card, { children: _jsxs("div", { className: styles.stat, children: [_jsx("span", { className: styles.statIcon, children: "\uD83D\uDD25" }), _jsxs("div", { children: [_jsx("p", { className: styles.statLabel, children: "\u0422\u0435\u043A\u0443\u0449\u0430\u044F \u0441\u0435\u0440\u0438\u044F" }), _jsxs("p", { className: styles.statValue, children: [profile.currentStreak, " \u0434\u043D\u0435\u0439"] })] })] }) }), _jsx(Card, { children: _jsxs("div", { className: styles.stat, children: [_jsx("span", { className: styles.statIcon, children: "\uD83D\uDCDA" }), _jsxs("div", { children: [_jsx("p", { className: styles.statLabel, children: "\u0423\u0440\u043E\u043A\u043E\u0432 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E" }), _jsx("p", { className: styles.statValue, children: profile.totalLessonsCompleted })] })] }) }), _jsx(Card, { children: _jsxs("div", { className: styles.stat, children: [_jsx("span", { className: styles.statIcon, children: "\u2713" }), _jsxs("div", { children: [_jsx("p", { className: styles.statLabel, children: "\u0422\u0435\u0441\u0442\u043E\u0432 \u043F\u0440\u043E\u0439\u0434\u0435\u043D\u043E" }), _jsx("p", { className: styles.statValue, children: profile.totalTestsPassed })] })] }) }), _jsx(Card, { children: _jsxs("div", { className: styles.stat, children: [_jsx("span", { className: styles.statIcon, children: "\u2615" }), _jsxs("div", { children: [_jsx("p", { className: styles.statLabel, children: "\u041F\u0440\u043E\u043B\u0438\u0432\u043E\u0432 \u0437\u0430\u043F\u0438\u0441\u0430\u043D\u043E" }), _jsx("p", { className: styles.statValue, children: profile.totalBrewLogsRecorded })] })] }) })] }), _jsxs("div", { className: styles.section, children: [_jsx("h3", { className: styles.sectionTitle, children: "\u041D\u0430\u0432\u044B\u043A\u0438" }), _jsx("div", { className: styles.skillsGrid, children: skills.map((skill) => (_jsx(Card, { children: _jsxs("div", { className: styles.skillCard, children: [_jsx("p", { className: styles.skillName, children: skill.name }), _jsx(Badge, { variant: "secondary", children: skill.level }), _jsx(ProgressBar, { value: skill.progress, size: "small", showLabel: false })] }) }, skill.id))) })] }), _jsxs("div", { className: styles.section, children: [_jsx("h3", { className: styles.sectionTitle, children: "\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0435 \u0443\u0440\u043E\u0432\u043D\u0438" }), _jsx("div", { className: styles.levelsGrid, children: ['SKILLED', 'PRO'].map((level) => (_jsx(Card, { interactive: true, children: _jsxs("div", { className: styles.levelCard2, children: [_jsx("h4", { children: level }), _jsx("p", { children: "\uD83D\uDD12 \u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D" }), _jsx("p", { className: styles.hint, children: "\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0435 \u0442\u0435\u043A\u0443\u0449\u0438\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C" })] }) }, level))) })] })] }));
};
export default Dashboard;
