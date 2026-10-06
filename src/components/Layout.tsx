import React from 'react';
import styles from './Layout.module.css';

export type NavSection = 'home' | 'path' | 'tests' | 'library' | 'trainer' | 'practice' | 'profile' | 'admin';

const ICONS: Record<string, React.ReactNode> = {
  home: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  ),
  path: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 20h5v-5h5v-5h5V5" />
    </svg>
  ),
  tests: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.5 2.5 2.5L16 9.5" />
    </svg>
  ),
  library: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h7v16H4z" />
      <path d="M13 4h7v16h-7z" />
    </svg>
  ),
  profile: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 5-5.5 8-5.5s6.5 1.5 8 5.5" />
    </svg>
  ),
};

const PRIMARY_TABS: { id: NavSection; label: string }[] = [
  { id: 'home', label: 'Главная' },
  { id: 'path', label: 'Путь' },
  { id: 'tests', label: 'Тесты' },
  { id: 'library', label: 'Библиотека' },
  { id: 'profile', label: 'Профиль' },
];

interface LayoutProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ activeSection, onNavigate, children }) => {
  const activeTab: NavSection =
    activeSection === 'trainer' || activeSection === 'practice'
      ? 'home'
      : activeSection === 'admin'
        ? 'profile'
        : activeSection;

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>202f</span>
          <span className={styles.brandName}>BaristaOS Academy</span>
        </div>
        <button
          type="button"
          className={styles.adminLink}
          onClick={() => onNavigate('admin')}
          aria-label="Панель администратора"
        >
          Admin
        </button>
      </header>

      <main className={styles.content}>{children}</main>

      <nav className={styles.tabBar} aria-label="Основная навигация">
        {PRIMARY_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            onClick={() => onNavigate(tab.id)}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            <span className={styles.tabIcon} aria-hidden="true">
              {ICONS[tab.id]}
            </span>
            <span className={styles.tabLabel}>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
