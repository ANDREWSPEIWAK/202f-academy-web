import React from 'react';
import styles from './Modal.module.css';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  size?: 'small' | 'medium' | 'large';
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  children,
  onClose,
  size = 'medium',
  showCloseButton = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.modal} ${styles[size]}`} onClick={(e) => e.stopPropagation()}>
        {title && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            {showCloseButton && (
              <button className={styles.closeButton} onClick={onClose}>
                ✕
              </button>
            )}
          </div>
        )}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
