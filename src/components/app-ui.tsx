// ===== 202f Academy — App UI primitives (эталон живого сайта) =====
// ProgressRing, Bar, Toasts, SectionHead, Pill, EmptyNote —
// кастомные компоненты, стилизованные под палитру 202f.

import * as React from 'react';
import { cn } from '../lib/utils';

export interface ProgressRingProps {
  value: number; // 0–100
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  children?: React.ReactNode;
}

export function ProgressRing({
  value,
  size = 110,
  stroke = 6,
  color = '#4FBBBC',
  track = '#33403f',
  children,
}: ProgressRingProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <svg
      width={size}
      height={size}
      className="transform -rotate-90"
      style={{ display: 'block', margin: '0 auto' }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={track}
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        style={{ strokeDasharray: circumference, strokeDashoffset: offset, transition: 'stroke-dashoffset 0.3s ease' }}
      />
      {children && (
        <g transform="rotate(90)" style={{ transformOrigin: `${size / 2}px ${size / 2}px` }}>
          <text
            x={size / 2}
            y={size / 2 + 6}
            textAnchor="middle"
            fill="#E2DAC2"
            fontFamily='"Space Mono", ui-monospace, "SF Mono", monospace'
            fontSize={Math.round(size * 0.32)}
            fontWeight="bold"
            letterSpacing="-0.02em"
          >
            {children}
          </text>
        </g>
      )}
    </svg>
  );
}

export interface BarProps {
  value: number; // 0–100
  color?: string;
  h?: number;
}

export function Bar({ value, color = '#4FBBBC', h = 6 }: BarProps) {
  return (
    <div className="w-full" style={{ height: h }}>
      <div
        className="relative overflow-hidden rounded-full"
        style={{ background: '#1a2121', height: h }}
      >
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color }}
        />
      </div>
    </div>
  );
}

export interface PillProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export function Pill({ children, color = '#4FBBBC', className }: PillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold',
        className,
      )}
      style={{
        background: `${color}22`,
        color,
        border: `1px solid ${color}55`,
      }}
    >
      {children}
    </span>
  );
}

export interface SectionHeadProps {
  kicker: string;
  title: string;
  sub?: string;
}

export function SectionHead({ kicker, title, sub }: SectionHeadProps) {
  return (
    <div className="space-y-1">
      <p className="kicker" style={{ color: '#4FBBBC' }}>
        {kicker}
      </p>
      <h1 className="font-display mt-1 text-3xl font-bold tracking-tight">{title}</h1>
      {sub && (
        <p className="mt-1 text-sm text-muted">{sub}</p>
      )}
    </div>
  );
}

export interface EmptyNoteProps {
  children: React.ReactNode;
}

export function EmptyNote({ children }: EmptyNoteProps) {
  return (
    <p className="py-8 text-center text-sm text-muted italic">{children}</p>
  );
}

export interface ToastsProps {}
export function Toasts() {
  // Рендерит тосты из стора — подключается в Layout или App
  return null;
}

export function useTicker(active: boolean, intervalMs = 1000) {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setCount((c) => c + 1), intervalMs);
    return () => clearInterval(id);
  }, [active, intervalMs]);
  return count;
}