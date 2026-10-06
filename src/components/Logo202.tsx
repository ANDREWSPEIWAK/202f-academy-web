import React from 'react';

interface Logo202Props {
  size?: number;
  /** Сохранён для совместимости. */
  mono?: boolean;
  className?: string;
}

/**
 * Логотип-маскот. Исходник — белая графика на чёрном фоне; обрезаем по рамке
 * знака, а `lighten` убирает чёрный фон, так что на любой тёмной плашке
 * остаётся только белый рисунок.
 */
const Logo202: React.FC<Logo202Props> = ({ size = 28, className }) => (
  <span
    className={className}
    aria-hidden="true"
    style={{
      display: 'block',
      position: 'relative',
      width: size,
      height: size,
      overflow: 'hidden',
      flexShrink: 0,
    }}
  >
    <img
      src="/logo.jpg"
      alt=""
      draggable={false}
      style={{
        position: 'absolute',
        width: '175.2%',
        maxWidth: 'none',
        left: '-29.8%',
        top: '-32.9%',
        mixBlendMode: 'lighten',
        userSelect: 'none',
      }}
    />
  </span>
);

export default Logo202;
