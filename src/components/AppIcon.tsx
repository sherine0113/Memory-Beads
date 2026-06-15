import React from 'react';

/**
 * mbeads app icon — a pixel/grid "flame" mark made of rounded squares,
 * drawn 1:1 from the design tokens (8×8 grid, 48px blocks, 8px radius, 5px gap).
 */

const COLORS: Record<string, string> = {
  y: '#F8C90B',   // yellow
  o: '#F0831F',   // orange
  l: '#FBE9A5',   // light yellow
  r: '#EF4B3E',   // red
  d: '#C83A2E',   // dark red
};

// 8×8 grid; '.' = empty cell
const GRID = [
  ['.', 'y', '.', 'o', '.', 'y', '.', '.'],
  ['l', 'y', '.', 'y', 'o', 'y', 'l', '.'],
  ['y', 'o', 'y', 'y', 'y', 'o', 'y', 'y'],
  ['r', 'r', 'r', 'r', 'r', 'r', 'r', 'r'],
  ['r', 'r', 'r', 'r', 'r', 'r', 'r', 'r'],
  ['r', 'r', 'r', 'y', 'y', 'r', 'r', 'r'],
  ['r', 'r', 'r', 'r', 'r', 'r', 'r', 'r'],
  ['.', 'd', 'd', 'd', 'd', 'd', 'd', '.'],
];

const BLOCK = 48, GAP = 5, RADIUS = 8;
const VB = 8 * BLOCK + 7 * GAP; // 419

interface AppIconProps { size?: number; }

export default function AppIcon({ size = 64 }: AppIconProps) {
  return (
    <div
      className="mbeads-mark"
      style={{
        width: size, height: size,
        borderRadius: Math.round(size * 0.24),
        background: '#F7F8FA',
        boxShadow: '0 8px 22px rgba(40, 50, 80, 0.16)',
        display: 'grid', placeItems: 'center',
      }}
      aria-label="mbeads"
    >
      <svg width="65%" height="65%" viewBox={`0 0 ${VB} ${VB}`} aria-hidden>
        {GRID.flatMap((row, ri) =>
          row.map((c, ci) => {
            const fill = COLORS[c];
            if (!fill) return null;
            return (
              <rect
                key={`${ri}-${ci}`}
                x={ci * (BLOCK + GAP)} y={ri * (BLOCK + GAP)}
                width={BLOCK} height={BLOCK} rx={RADIUS}
                fill={fill}
              />
            );
          }),
        )}
      </svg>
    </div>
  );
}

/** Horizontal logo lockup: mark + "mbeads" wordmark. */
export function BrandLockup({ size = 44 }: { size?: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: Math.round(size * 0.32) }}>
      <AppIcon size={size} />
      <span style={{
        fontFamily: '"Nunito", "PingFang SC", sans-serif',
        fontWeight: 700, fontSize: Math.round(size * 0.86),
        letterSpacing: '-0.01em', color: '#1d2a22', lineHeight: 1,
      }}>
        mbeads
      </span>
    </span>
  );
}
