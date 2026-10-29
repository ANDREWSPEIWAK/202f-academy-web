import React from 'react';
import styles from './AppHeader.module.css';

interface AppHeaderProps {
  onMenuClick: () => void;
  onProfileClick: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onMenuClick, onProfileClick }) => {
  return (
    <header className={styles.header}>
      <button
        className={styles.iconButton}
        onClick={onMenuClick}
        aria-label="Меню"
        type="button"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      <div className={styles.logo}>
        <span className={styles.logoYellow}>202F</span> ACADEMY
      </div>
      <button
        className={styles.profileButton}
        onClick={onProfileClick}
        aria-label="Профиль"
        type="button"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </button>
    </header>
  );
};

export default AppHeader;
