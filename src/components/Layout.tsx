import React, { useState } from 'react';
import AppHeader from './AppHeader';
import BottomPill from './BottomPill';
import BurgerDrawer from './BurgerDrawer';
import styles from './Layout.module.css';

export type NavSection = 'academy' | 'tests' | 'library' | 'trainer' | 'practice' | 'shift' | 'discipline' | 'profile';

interface LayoutProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ activeSection, onNavigate, children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleMenuClick = () => {
    setIsDrawerOpen(true);
  };

  const handleProfileClick = () => {
    onNavigate('profile' as NavSection);
  };

  const handleDrawerNavigate = (section: any) => {
    onNavigate(section);
  };

  return (
    <div className={styles.layout}>
      <AppHeader onMenuClick={handleMenuClick} onProfileClick={handleProfileClick} />
      <main className={styles.main}>
        {children}
      </main>
      <BottomPill activeSection={activeSection as any} onNavigate={onNavigate as any} />
      <BurgerDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onNavigate={handleDrawerNavigate}
        activeSection={activeSection}
      />
    </div>
  );
};

export default Layout;
