import { useState } from 'react';
import Layout from './components/Layout';
import Home from './screens/Home';
import Path from './screens/Path';
import Tests from './screens/Tests';
import Shift from './screens/Shift';
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
import Academy from './screens/Academy';

// MorePlaceholder for sections not yet implemented
const MorePlaceholder = () => {
  return (
    <div className="p-6 text-center text-[#6b6b5c]">
      <p className="text-sm">Раздел в разработке</p>
    </div>
  );
};

export default function App() {
  const [activeSection, setActiveSection] = useState<'home' | 'path' | 'tests' | 'shift' | 'more' | 'library' | 'trainer' | 'practice' | 'profile' | 'discipline' | 'wheel' | 'admin' | 'skills' | 'training' | 'journal' | 'certification' | 'academy'>('path');

  // Pass onNavigate to all screens that need it
  const ScreenWithNavigation = ({ Component, section }: { Component: React.ComponentType<any>; section: 'home' | 'path' | 'tests' | 'shift' | 'more' | 'library' | 'trainer' | 'practice' | 'profile' | 'discipline' | 'wheel' | 'admin' | 'skills' | 'training' | 'journal' | 'certification' | 'academy' }) => {
    // Only Home needs onNavigate and onOpenStep for now
    if (section === 'home') {
      return <Home onNavigate={setActiveSection} onOpenStep={() => {}} />;
    }
    // For other sections, just render the component
    return <Component />;
  };

  return (
    <Layout activeSection={activeSection} onNavigate={setActiveSection}>
      {activeSection === 'home' && <ScreenWithNavigation Component={Home} section="home" />}
      {activeSection === 'path' && <ScreenWithNavigation Component={Path} section="path" />}
      {activeSection === 'tests' && <ScreenWithNavigation Component={Tests} section="tests" />}
      {activeSection === 'shift' && <ScreenWithNavigation Component={Shift} section="shift" />}
      {activeSection === 'more' && <ScreenWithNavigation Component={MorePlaceholder} section="more" />}
      {activeSection === 'library' && <ScreenWithNavigation Component={Library} section="library" />}
      {activeSection === 'trainer' && <ScreenWithNavigation Component={Trainer} section="trainer" />}
      {activeSection === 'practice' && <ScreenWithNavigation Component={Practice} section="practice" />}
      {activeSection === 'profile' && <ScreenWithNavigation Component={Profile} section="profile" />}
      {activeSection === 'discipline' && <ScreenWithNavigation Component={Discipline} section="discipline" />}
      {activeSection === 'wheel' && <ScreenWithNavigation Component={Wheel} section="wheel" />}
      {activeSection === 'admin' && <ScreenWithNavigation Component={Admin} section="admin" />}
      {activeSection === 'skills' && <ScreenWithNavigation Component={Skills} section="skills" />}
      {activeSection === 'training' && <ScreenWithNavigation Component={Training} section="training" />}
      {activeSection === 'journal' && <ScreenWithNavigation Component={Journal} section="journal" />}
      {activeSection === 'certification' && <ScreenWithNavigation Component={Certification} section="certification" />}
      {activeSection === 'academy' && <ScreenWithNavigation Component={Academy} section="academy" />}
    </Layout>
  );
}
