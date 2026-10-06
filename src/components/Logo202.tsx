import React from 'react';

interface Logo202Props {
  size?: number;
  /** Монохромный режим — для водяных знаков */
  mono?: boolean;
  className?: string;
}

/** Изометрический кубический монограм «202»: гексагон, складывающийся в цифры 2-0-2. */
const Logo202: React.FC<Logo202Props> = ({ size = 28, mono = false, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    {/* Грани куба */}
    <polygon points="24,4 41.3,14 24,24 6.7,14" fill={mono ? 'currentColor' : '#c9f24b'} opacity={mono ? 0.9 : 1} />
    <polygon points="6.7,14 24,24 24,44 6.7,34" fill={mono ? 'currentColor' : '#6c5ce7'} opacity={mono ? 0.55 : 1} />
    <polygon points="24,24 41.3,14 41.3,34 24,44" fill={mono ? 'currentColor' : '#17140f'} opacity={mono ? 0.3 : 1} />

    {/* Ребра — каркас куба */}
    <path
      d="M24 4 41.3 14 41.3 34 24 44 6.7 34 6.7 14Z M6.7 14 24 24 41.3 14 M24 24V44"
      stroke={mono ? 'currentColor' : '#17140f'}
      strokeWidth="1.6"
      strokeLinejoin="round"
      fill="none"
    />

    {/* «0» — кольцо на верхней грани */}
    <ellipse cx="24" cy="14" rx="5.2" ry="2.9" stroke={mono ? 'currentColor' : '#17140f'} strokeWidth="2.2" fill="none" />

    {/* «2» на левой грани */}
    <text
      x="0"
      y="0"
      transform="translate(9.2 30.5) skewY(26)"
      fontFamily="'Space Grotesk', sans-serif"
      fontWeight="700"
      fontSize="11"
      fill={mono ? 'currentColor' : '#f2eee6'}
    >
      2
    </text>

    {/* «2» на правой грани */}
    <text
      x="0"
      y="0"
      transform="translate(28.4 39.5) skewY(-26)"
      fontFamily="'Space Grotesk', sans-serif"
      fontWeight="700"
      fontSize="11"
      fill={mono ? 'currentColor' : '#f2eee6'}
    >
      2
    </text>
  </svg>
);

export default Logo202;
