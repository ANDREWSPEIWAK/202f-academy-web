import { useState } from 'react';
import Layout, { NavSection } from './components/Layout';
import Landing from './screens/Landing';
import Home from './screens/Home';
import Path from './screens/Path';
import Tests from './screens/Tests';
import Shift from './screens/Shift';
import More from './screens/More';
import Library from './screens/Library';
import Trainer from './screens/Trainer';
import Practice from './screens/Practice';
import Profile from './screens/Profile';
import Discipline from './screens/Discipline';
import Wheel from './screens/Wheel';
import Admin from './screens/Admin';
import Skills from './screens/Skills';
import Training from './screens/Training';
import Journal from './screens/Journal';
import Certification from './screens/Certification';
import { useAuthStore } from './store/authStore';
import './App.css';

function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
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

  if (!isAuthenticated) {
    return <Landing />;
  }

  return (
    <Layout activeSection={activeSection} onNavigate={navigate}>
      {activeSection === 'home' && <Home onNavigate={navigate} onOpenStep={openStep} />}
      {activeSection === 'path' && <Path initialStepId={pathStepId} onGoToTest={goToTest} />}
      {activeSection === 'tests' && <Tests initialTestId={testId} />}
      {activeSection === 'shift' && <Shift />}
      {activeSection === 'more' && <More onNavigate={navigate} />}
      {activeSection === 'library' && <Library />}
      {activeSection === 'trainer' && <Trainer />}
      {activeSection === 'practice' && <Practice />}
      {activeSection === 'profile' && <Profile />}
      {activeSection === 'discipline' && <Discipline />}
      {activeSection === 'wheel' && <Wheel />}
      {activeSection === 'admin' && <Admin />}
      {activeSection === 'skills' && <Skills onNavigate={navigate} />}
      {activeSection === 'training' && <Training />}
      {activeSection === 'journal' && <Journal />}
      {activeSection === 'certification' && <Certification />}
    </Layout>
  );
}

export default App;
