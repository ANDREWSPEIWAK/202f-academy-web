import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './screens/Dashboard';
import Academy from './screens/Academy';
import Tests from './screens/Tests';
import Library from './screens/Library';
import Trainer from './screens/Trainer';
import Practice from './screens/Practice';
import './App.css';
function App() {
    const [activeSection, setActiveSection] = useState('academy');
    const [showDashboard, setShowDashboard] = useState(true);
    return (_jsxs(Layout, { activeSection: activeSection, onNavigate: setActiveSection, children: [showDashboard && activeSection === 'academy' && (_jsx("div", { onClick: () => setShowDashboard(false), style: { cursor: 'pointer' }, children: _jsx(Dashboard, { onNavigate: setActiveSection }) })), !showDashboard && activeSection === 'academy' && _jsx(Academy, {}), activeSection === 'tests' && _jsx(Tests, {}), activeSection === 'library' && _jsx(Library, {}), activeSection === 'trainer' && _jsx(Trainer, {}), activeSection === 'practice' && _jsx(Practice, {})] }));
}
export default App;
