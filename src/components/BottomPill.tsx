import React from 'react';
import styles from './BottomPill.module.css';

type NavSection = 'academy' | 'tests' | 'library' | 'trainer' | 'practice';

interface BottomPillProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
}

const BottomPill: React.FC<BottomPillProps> = ({ activeSection, onNavigate }) => {
  const navItems = [
    { id: 'academy' as NavSection, label: 'Путь', ariaLabel: 'Путь', icon: PathIcon },
    { id: 'trainer' as NavSection, label: 'ТТК', ariaLabel: 'ТТК', icon: TTKIcon },
    { id: 'tests' as NavSection, label: 'Тесты', ariaLabel: 'Тесты', icon: TestsIcon },
    { id: 'library' as NavSection, label: 'Методики', ariaLabel: 'Методики', icon: LibraryIcon },
    { id: 'practice' as NavSection, label: 'Вкусы', ariaLabel: 'Вкусы', icon: FlavorsIcon },
  ];

  return (
    <nav className={styles.pill} role="navigation" aria-label="Основная навигация">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        return (
          <button
            key={item.id}
            className={`${styles.navButton} ${isActive ? styles.active : ''}`}
            onClick={() => onNavigate(item.id)}
            aria-label={item.ariaLabel}
            aria-current={isActive ? 'page' : undefined}
            type="button"
          >
            {isActive ? (
              <div className={styles.activeCircle}>
                <Icon />
              </div>
            ) : (
              <Icon />
            )}
          </button>
        );
      })}
    </nav>
  );
};

function PathIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="19" r="2"></circle>
      <circle cx="18" cy="5" r="2"></circle>
      <path d="M12 19h4.5a3.5 3.5 0 0 0 0-7h-8a3.5 3.5 0 0 1 0-7H6"></path>
    </svg>
  );
}

function TTKIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="9 12 11 14 15 10"></polyline>
    </svg>
  );
}

function TestsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  );
}

function LibraryIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
  );
}

function FlavorsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M2 12h20"></path>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  );
}

export default BottomPill;
