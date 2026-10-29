import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './screens/Dashboard';
import Academy from './screens/Academy';
import Tests from './screens/Tests';
import Library from './screens/Library';
import Trainer from './screens/Trainer';
import Practice from './screens/Practice';
import './App.css';

type NavSection = 'academy' | 'tests' | 'library' | 'trainer' | 'practice' | 'shift' | 'discipline' | 'profile';

function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('academy');
  const [showDashboard, setShowDashboard] = useState(true);

  const handleNavigate = (section: NavSection) => {
    setActiveSection(section);
    if (section !== 'academy') {
      setShowDashboard(false);
    }
  };

  return (
    <Layout activeSection={activeSection} onNavigate={handleNavigate}>
      {showDashboard && activeSection === 'academy' && (
        <div onClick={() => setShowDashboard(false)} style={{ cursor: 'pointer' }}>
          <Dashboard />
        </div>
      )}
      {!showDashboard && activeSection === 'academy' && <Academy />}
      {activeSection === 'tests' && <Tests />}
      {activeSection === 'library' && <Library />}
      {activeSection === 'trainer' && <Trainer />}
      {activeSection === 'practice' && <Practice />}
      {(activeSection === 'shift' || activeSection === 'discipline' || activeSection === 'profile') && (
        <div style={{ padding: '20px' }}>
          <h2 style={{ fontFamily: "'Unbounded', sans-serif", textTransform: 'uppercase', fontSize: '28px' }}>
            {activeSection === 'shift' ? 'Смена' : activeSection === 'discipline' ? 'Дисциплина' : 'Профиль'}
          </h2>
        </div>
      )}
    </Layout>
  );
}

export default App;

