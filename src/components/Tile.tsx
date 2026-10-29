import React from 'react';
import styles from './Tile.module.css';

interface TileProps {
  number?: string | number;
  children: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

const Tile: React.FC<TileProps> = ({ number, children, onClick, selected = false, className = '' }) => {
  return (
    <div
      className={`${styles.tile} ${onClick ? styles.clickable : ''} ${selected ? styles.selected : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {number !== undefined && <div className={styles.number}>{number}</div>}
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Tile;
