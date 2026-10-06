import React from 'react';
import styles from './Layout.module.css';
import { useT } from '../i18n';
import { useAuthStore } from '../store/authStore';

export type NavSection =
  | 'home'
  | 'path'
  | 'tests'
  | 'shift'
  | 'more'
  | 'library'
  | 'trainer'
  | 'practice'
  | 'profile'
  | 'discipline'
  | 'wheel'
  | 'admin'
  | 'skills'
  | 'training'
  | 'journal'
  | 'certification';

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
  shift: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  ),
  more: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="5" cy="12" r="1.6" fill="currentColor" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <circle cx="19" cy="12" r="1.6" fill="currentColor" />
    </svg>
  ),
};

const PRIMARY_TABS: { id: NavSection; labelKey: string }[] = [
  { id: 'home', labelKey: 'nav.home' },
  { id: 'path', labelKey: 'nav.path' },
  { id: 'tests', labelKey: 'nav.tests' },
  { id: 'shift', labelKey: 'nav.shift' },
  { id: 'more', labelKey: 'nav.more' },
];

/** Секции, которые подсвечивают вкладку More */
const MORE_SECTIONS: NavSection[] = ['more', 'library', 'trainer', 'practice', 'profile', 'discipline', 'wheel', 'admin', 'skills', 'training', 'journal', 'certification'];

interface LayoutProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ activeSection, onNavigate, children }) => {
  const t = useT();
  const user = useAuthStore((s) => s.user);
  const activeTab: NavSection = MORE_SECTIONS.includes(activeSection) ? 'more' : activeSection;

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>202f</span>
          <span className={styles.brandName}>{t('app.name')}</span>
        </div>
        {user && <span className={styles.userChip}>{user.name}</span>}
      </header>

      <main className={styles.content}>{children}</main>

      <nav className={styles.tabBar} aria-label={t('app.name')}>
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
            <span className={styles.tabLabel}>{t(tab.labelKey)}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
