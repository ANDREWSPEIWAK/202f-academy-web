import React, { useId } from 'react';

interface Logo202Props {
  size?: number;
  /** Сохранён для совместимости: логотип всегда рисуется currentColor. */
  mono?: boolean;
  className?: string;
}

/**
 * Изометрический кубический монограм из трёх сплошных граней с жирными
 * скруглёнными буквами-вырезами: сверху «0», слева «N», справа «S».
 * Рисуется через currentColor — на тёмных фонах остаётся белым.
 */
const Logo202: React.FC<Logo202Props> = ({ size = 28, className }) => {
  const maskId = `logo202-${useId().replace(/:/g, '')}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      style={{ color: 'inherit' }}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
          <rect width="100" height="100" fill="#fff" />
          <g fill="none" stroke="#000" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round">
            {/* Верхняя грань: «0» */}
            <g transform="matrix(0.39 -0.225 0.39 0.225 11 27.5)">
              <ellipse cx="50" cy="50" rx="16" ry="27" />
            </g>
            {/* Левая грань: «N» */}
            <g transform="matrix(0.39 0.225 0 0.45 11 27.5)">
              <path d="M30 78 V22 L70 78 V22" />
            </g>
            {/* Правая грань: «S» */}
            <g transform="matrix(0.39 -0.225 0 0.45 50 50)">
              <path d="M72 24 H32 V50 H68 V76 H28" />
            </g>
          </g>
        </mask>
      </defs>

      <g
        mask={`url(#${maskId})`}
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      >
        <polygon points="17.2,27.5 50,8.7 82.8,27.5 50,45.5" />
        <polygon points="13.1,34.3 45.9,52.3 45.9,89.1 13.1,70.3" />
        <polygon points="54.1,52.3 86.9,34.3 86.9,70.3 54.1,89.1" />
      </g>
    </svg>
  );
};

export default Logo202;
