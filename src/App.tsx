import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './screens/Dashboard';
import Academy from './screens/Academy';
import Tests from './screens/Tests';
import Library from './screens/Library';
import Trainer from './screens/Trainer';
import Practice from './screens/Practice';
import './App.css';

type NavSection = 'academy' | 'tests' | 'library' | 'trainer' | 'practice';

function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('academy');
  const [showDashboard, setShowDashboard] = useState(true);

  return (
    <Layout activeSection={activeSection} onNavigate={setActiveSection}>
      {showDashboard && activeSection === 'academy' && (
        <div onClick={() => setShowDashboard(false)} style={{ cursor: 'pointer' }}>
          <Dashboard onNavigate={setActiveSection} />
        </div>
      )}
      {!showDashboard && activeSection === 'academy' && <Academy />}
      {activeSection === 'tests' && <Tests />}
      {activeSection === 'library' && <Library />}
      {activeSection === 'trainer' && <Trainer />}
      {activeSection === 'practice' && <Practice />}
    </Layout>
  );
}

export default App;
