import React from 'react';

interface Logo202Props {
  size?: number;
  /** Сохранён для совместимости: логотип всегда рисуется currentColor. */
  mono?: boolean;
  className?: string;
}

/**
 * Изометрический кубический монограм: чёрно-белый гексагон с буквами на гранях.
 * Сверху «0» (вместо «P» референса), слева «N», справа «S».
 * Рисуется через currentColor — на тёмных фонах остаётся белым.
 */
const Logo202: React.FC<Logo202Props> = ({ size = 28, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    className={className}
    aria-hidden="true"
    style={{ color: 'inherit' }}
  >
    {/* Внешний контур куба */}
    <path
      d="M50 5 L89 27.5 V72.5 L50 95 L11 72.5 V27.5 Z"
      strokeWidth="5"
      strokeLinejoin="miter"
    />

    {/* Рёбра между гранями */}
    <path d="M11 27.5 L50 50 L89 27.5 M50 50 V95" strokeWidth="2.6" strokeLinejoin="miter" />

    {/* Верхняя грань: «0» + сплошная полоса у правого ребра */}
    <g transform="matrix(0.39 -0.225 0.39 0.225 11 27.5)">
      <rect x="22" y="18" width="44" height="64" rx="22" strokeWidth="12" />
      <rect x="82" y="14" width="18" height="72" fill="currentColor" stroke="none" />
    </g>

    {/* Левая грань: «N» */}
    <g transform="matrix(0.39 0.225 0 0.45 11 27.5)">
      <path d="M24 86 V16 L76 86 V16" strokeWidth="12" strokeLinejoin="miter" />
    </g>

    {/* Правая грань: «S» */}
    <g transform="matrix(0.39 -0.225 0 0.45 50 50)">
      <path d="M78 20 H26 V48 H74 V82 H22" strokeWidth="12" strokeLinejoin="miter" />
    </g>
  </svg>
);

export default Logo202;
