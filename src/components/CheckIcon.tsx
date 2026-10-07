import React from 'react';

/** Галочка в виде SVG — символ U+2713 отсутствует в части системных шрифтов. */
const CheckIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
);

export default CheckIcon;
