import React from 'react';
import styles from './Layout.module.css';
import { useAuthStore } from '../store/authStore';

export type NavSection = 'academy' | 'tests' | 'library' | 'trainer' | 'practice';

interface LayoutProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  children: React.ReactNode;
}

// Placeholder for Logo202 component - replace with actual logo implementation
const Logo202 = ({ size }: { size: number }) => {
  return (
    <div style={{
      width: size,
      height: size,
      backgroundColor: 'var(--cream)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      color: 'var(--heat)'
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
        <span className={styles.brandName}>202f Academy</span>
        {user && <span className={styles.userChip}>{user.name}</span>}
      </header>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};

export default Layout;