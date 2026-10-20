import React, { useState } from 'react';
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
import More from './screens/More';
import type { NavSection } from './components/Layout';

const SCREENS: Record<NavSection, React.ComponentType<any>> = {
  home: Home,
  path: Path,
  tests: Tests,
  shift: Shift,
  more: More,
  library: Library,
  trainer: Trainer,
  practice: Practice,
  profile: Profile,
  discipline: Discipline,
  wheel: Wheel,
  admin: Admin,
  skills: Skills,
  training: Training,
  journal: Journal,
  certification: Certification,
  academy: Academy,
};


export default function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('path');
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);

  const Screen = SCREENS[activeSection];

  return (
    <Layout activeSection={activeSection} onNavigate={setActiveSection}>
      {Screen && (activeSection === "more" ? <Screen onNavigate={setActiveSection} /> : activeSection === "home" ? <Screen onNavigate={setActiveSection} onOpenStep={(id:string)=>{ setOpenTaskId(id); setActiveSection("training"); }} /> : activeSection === "skills" ? <Screen onNavigate={setActiveSection} /> : activeSection === "training" ? <Screen initialTaskId={openTaskId} /> : <Screen />)}
    </Layout>
  );
}
