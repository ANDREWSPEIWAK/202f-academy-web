import React from 'react';
import styles from './DetailCard.module.css';

interface DetailCardProps {
  kicker?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const DetailCard: React.FC<DetailCardProps> = ({ kicker, title, children, className = '' }) => {
  return (
    <div className={`${styles.detailCard} ${className}`}>
      {(kicker || title) && (
        <div className={styles.header}>
          {kicker && <div className={styles.kicker}>{kicker}</div>}
          {title && <h3 className={styles.title}>{title}</h3>}
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default DetailCard;
