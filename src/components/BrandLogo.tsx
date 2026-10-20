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
        src="/logo.png"
        alt={alt}
        draggable={false}
        loading="eager"
        decoding="async"
style={{
           width: '100%',
           height: '100%',
           objectFit: 'contain',
           mixBlendMode: 'lighten',
           userSelect: 'none',
         }}
      />
    </span>
  );
};

export default BrandLogo;
export { BrandLogo };
