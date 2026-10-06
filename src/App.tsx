import { useState } from 'react';
import Layout, { NavSection } from './components/Layout';
import Home from './screens/Home';
import Path from './screens/Path';
import Tests from './screens/Tests';
import Library from './screens/Library';
import Trainer from './screens/Trainer';
import Practice from './screens/Practice';
import Profile from './screens/Profile';
import Admin from './screens/Admin';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('home');
  const [pathStepId, setPathStepId] = useState<string | null>(null);
  const [testId, setTestId] = useState<string | null>(null);

  const openStep = (stepId: string) => {
    setPathStepId(stepId);
    setActiveSection('path');
  };

  const goToTest = (id: string) => {
    setTestId(id);
    setActiveSection('tests');
  };

  const navigate = (section: NavSection) => {
    setPathStepId(null);
    setTestId(null);
    setActiveSection(section);
  };

  return (
    <Layout activeSection={activeSection} onNavigate={navigate}>
      {activeSection === 'home' && <Home onNavigate={navigate} onOpenStep={openStep} />}
      {activeSection === 'path' && <Path initialStepId={pathStepId} onGoToTest={goToTest} />}
      {activeSection === 'tests' && <Tests initialTestId={testId} />}
      {activeSection === 'library' && <Library />}
      {activeSection === 'trainer' && <Trainer />}
      {activeSection === 'practice' && <Practice />}
      {activeSection === 'profile' && <Profile />}
      {activeSection === 'admin' && <Admin />}
    </Layout>
  );
}

export default App;
