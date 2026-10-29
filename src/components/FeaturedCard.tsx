import React from 'react';
import styles from './FeaturedCard.module.css';

interface FeaturedCardProps {
  categoryColor?: string;
  categoryTag?: string;
  title: string;
  description?: string;
  time?: string;
  format?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({
  categoryColor = 'var(--yellow)',
  categoryTag,
  title,
  description,
  time,
  format,
  buttonText = '→',
  onButtonClick,
  className = '',
}) => {
  return (
    <div className={`${styles.featuredCard} ${className}`} style={{ background: categoryColor }}>
      {categoryTag && <div className={styles.categoryTag}>{categoryTag}</div>}
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}
      {(time || format) && (
        <div className={styles.meta}>
          {format && <span className={styles.chip}>{format}</span>}
          {time && <span className={styles.chip}>{time}</span>}
        </div>
      )}
      <button
        className={styles.button}
        onClick={onButtonClick}
        aria-label={buttonText}
        type="button"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default FeaturedCard;
