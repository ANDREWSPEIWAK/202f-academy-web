import React from 'react';
import styles from './Layout.module.css';
import { useAuthStore } from '../store/authStore';

export type NavSection = 'academy' | 'tests' | 'library' | 'trainer' | 'practice';

interface LayoutProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  children: React.ReactNode;
}

// Mock translation function - in a real app, this would come from i18next or similar
const t = (key: string): string => {
  // Simple mock that returns the key itself - in dev, this helps identify missing translations
  // In production, this would be replaced with actual i18n implementation
  return key;
};

// Placeholder for Logo202 component - replace with actual logo implementation
const Logo202 = ({ size }: { size: number }) => {
  return (
    <div style={{
      width: size,
      height: size,
      backgroundColor: '#e8e1d9',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      color: '#5c3d2e'
    }}>
      AW
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ activeSection, onNavigate, children }) => {
  const user = useAuthStore(state => state.user);
  
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <span className={styles.brandMark}>
          <Logo202 size={26} />
        </span>
        <span className={styles.brandName}>{t('app.name')}</span>
        {user && <span className={styles.userChip}>{user.name}</span>}
      </header>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};

export default Layout;