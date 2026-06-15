import React from 'react';

/**
 * Circular perler-bead food icons (NOBEL-style bead art).
 * Each icon is a small char matrix; every non-space char is one round bead.
 * 'K' = black outline bead; other letters map to high-saturation food colours.
 */

type IconDef = { grid: string[]; colors: Record<string, string> };

const BURGER: IconDef = {
  colors: { K: '#151515', l: '#FFC45A', b: '#F6A735', s: '#FFF1C6', L: '#42C85A', C: '#FFD93D', T: '#F53D3D', M: '#7A3E22' },
  grid: [
    '....KKKKKKKK....',
    '..KKllllllllKK..',
    '.KllslllllslllK.',
    'KllllllllllllllK',
    'KbbbbbbbbbbbbbbK',
    'KLLLLLLLLLLLLLLK',
    'KCCCCCCCCCCCCCCK',
    'KTTTTTTTTTTTTTTK',
    'KMMMMMMMMMMMMMMK',
    'KbbbbbbbbbbbbbbK',
    '.KbbbbbbbbbbbbK.',
    '..KKKKKKKKKKKK..',
  ],
};

const COLA: IconDef = {
  colors: { K: '#151515', R: '#E4002B', r: '#9E1024', W: '#F7F7F3', S: '#E9E9E4' },
  grid: [
    '.........SS...',
    '.........SS...',
    '..KKKKKKKKKK..',
    '..KWWWWWWWWK..',
    '..KWWWWWWWWK..',
    '..KKKKKKKKKK..',
    '..KRRRRRRRRK..',
    '..KRWWWWWWRK..',
    '..KRWWWWWWRK..',
    '..KRRRRRRRRK..',
    '...KRRRRRRK...',
    '...KRRRRRRK...',
    '...KRRRRRRK...',
    '....KRRRRK....',
    '....KKKKKK....',
  ],
};

const WING: IconDef = {
  colors: { K: '#151515', O: '#F58220', G: '#FFC861', N: '#9A4B21', B: '#F2EFE6' },
  grid: [
    '....KKKK......',
    '..KKOOOOKK....',
    '.KOOOOOOOOK...',
    '.KOOOGGOOOK...',
    'KOOOGGGGOOOK..',
    'KOOOOGGOOOOK..',
    'KOOOOOOOOOOK..',
    'KOOOOOOOOOOK..',
    '.KOOOOOOOOK...',
    '.KNOOOOOONK...',
    '..KNNOONNK....',
    '...KNOONK.....',
    '.....KBBK.....',
    '.....KBBK.....',
    '....KBBBBK....',
    '.....KKKK.....',
  ],
};

const FRIES: IconDef = {
  colors: { K: '#151515', X: '#F71932', Y: '#FFD84A', W: '#FFFFFF' },
  grid: [
    '...Y..Y...Y.Y...',
    '..YY.YY..YYYYY..',
    '.YYKYYKYYKYYKYY.',
    '.YYKYYKYYKYYKYY.',
    '.YYKYYKYYKYYKYY.',
    'KKKKKKKKKKKKKKKK',
    'KXXXXXXXXXXXXXXK',
    'KXWWWWWWWWWWWWXK',
    'KXWWWWWWWWWWWWXK',
    'KXXXXXXXXXXXXXXK',
    '.KXXXXXXXXXXXXK.',
    '.KXXXXXXXXXXXXK.',
    '..KKKKKKKKKKKK..',
  ],
};

export const FOOD_ICONS: Record<string, IconDef> = { burger: BURGER, cola: COLA, wing: WING, fries: FRIES };

export default function BeadIcon({ name, size = '78%' }: { name: string; size?: string }) {
  const def = FOOD_ICONS[name];
  if (!def) return null;
  const rows = def.grid.length;
  const cols = Math.max(...def.grid.map(r => r.length));
  const r = 0.46;
  const dots: React.ReactNode[] = [];
  def.grid.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      const fill = def.colors[ch];
      if (!fill) continue;
      const cx = x + 0.5, cy = y + 0.5;
      dots.push(<circle key={`${x}-${y}`} cx={cx} cy={cy} r={r} fill={fill} />);
      // soft top-left highlight for the glossy bead look
      dots.push(<circle key={`h${x}-${y}`} cx={cx - 0.17} cy={cy - 0.17} r={0.15} fill="rgba(255,255,255,0.30)" />);
    }
  });
  return (
    <svg
      className="bead-food-svg"
      viewBox={`0 0 ${cols} ${rows}`}
      width={size} height={size}
      style={{ overflow: 'visible', filter: 'drop-shadow(2px 3px 1px rgba(0,0,0,0.16))' }}
      aria-hidden
    >
      {dots}
    </svg>
  );
}
