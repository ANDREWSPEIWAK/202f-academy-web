import React from 'react';
import styles from './Layout.module.css';

export type NavSection = 'academy' | 'tests' | 'library' | 'trainer' | 'practice';

interface LayoutProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  children: React.ReactNode;
}

const SECTION_TITLES: Record<NavSection, string> = {
  academy: 'Академия',
  tests: 'Тесты',
  library: 'Библиотека',
  trainer: 'Тренер',
  practice: 'Практика',
};

const Layout: React.FC<LayoutProps> = ({ activeSection, children }) => {
  const title = SECTION_TITLES[activeSection];

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
      </header>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};

export default Layout;