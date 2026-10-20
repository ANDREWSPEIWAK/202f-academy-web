import React from 'react';

interface BrandLogoProps {
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  /** Сохранён для совместимости. */
  mono?: boolean;
  className?: string;
  alt?: string;
}

const SIZE_MAP: Record<'sm' | 'md' | 'lg' | 'xl', number> = {
  sm: 38,
  md: 44,
  lg: 72,
  xl: 96,
};

/**
 * Официальный бренд-знак 202F: оригинальный рисунок из /logo.jpg.
 * Чёрный фон убирается через mix-blend-mode: lighten, остаётся белая графика.
 */
const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', className, alt = '202F Academy' }) => {
  const px = typeof size === 'number' ? size : SIZE_MAP[size];
  return (
    <span
      className={className}
      role="img"
      aria-label={alt}
      style={{
        display: 'block',
        position: 'relative',
        width: px,
        height: px,
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <img
        src="/logo.jpg"
        alt=""
        draggable={false}
        loading="eager"
        decoding="async"
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
};

export default BrandLogo;
export { BrandLogo };