import React, { useEffect } from 'react';
import styles from './BurgerDrawer.module.css';

interface BurgerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: any) => void;
  activeSection: string;
}

const BurgerDrawer: React.FC<BurgerDrawerProps> = ({ isOpen, onClose, onNavigate }) => {
  const menuItems = [
    { id: 'academy', label: 'Путь' },
    { id: 'trainer', label: 'ТТК' },
    { id: 'tests', label: 'Тесты' },
    { id: 'library', label: 'Методики' },
    { id: 'practice', label: 'Вкусы' },
    { id: 'shift', label: 'Смена' },
    { id: 'discipline', label: 'Дисциплина' },
    { id: 'profile', label: 'Профиль' },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleNavigate = (section: string) => {
    onNavigate(section);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
      <div className={styles.drawer} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <button className={styles.closeButton} onClick={onClose} aria-label="Закрыть" type="button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={styles.menuItem}
              onClick={() => handleNavigate(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default BurgerDrawer;
