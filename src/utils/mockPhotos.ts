const PALETTE: [string, string, string][] = [
  ['#FF6B6B', '#FF8E8E', '#FFB3B3'], // red
  ['#FF8C42', '#FFB347', '#FFD199'], // orange
  ['#FFD166', '#FFE08A', '#FFF1C2'], // yellow
  ['#A8E063', '#C6F08A', '#E0F9BC'], // yellow-green
  ['#56CCF2', '#82D8F7', '#B3EAFB'], // sky
  ['#6FCF97', '#92DDB5', '#C0EFD5'], // mint
  ['#BB86FC', '#CC99FD', '#DDBBFE'], // purple
  ['#F78FB3', '#FAA8C8', '#FDC7DC'], // pink
  ['#43B4C8', '#6CC9D8', '#A0DEE8'], // teal
  ['#F9CB40', '#FAD85A', '#FCEA9C'], // gold
  ['#EB5757', '#F07A7A', '#F5A5A5'], // crimson
  ['#219BE3', '#4FAFE9', '#8FCBF2'], // blue
  ['#27AE60', '#48C674', '#7EDAD0'], // green
  ['#9B51E0', '#B368F0', '#CEAAF8'], // violet
  ['#F2994A', '#F5B36B', '#F9D0A0'], // amber
  ['#2F80ED', '#5498F0', '#8BBCF6'], // cobalt
  ['#EB5757', '#CC3333', '#992222'], // dark red
  ['#6FCF97', '#4E9E73', '#2D7050'], // forest
  ['#F2C94C', '#D4A017', '#A07A00'], // ochre
  ['#56CCF2', '#3AA8E0', '#1E84C0'], // deep sky
];

function makeGradientDataUrl(colors: [string, string, string], size = 64): string {
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, colors[0]);
  grad.addColorStop(0.5, colors[1]);
  grad.addColorStop(1, colors[2]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // subtle circle overlay
  const radGrad = ctx.createRadialGradient(size * 0.6, size * 0.3, 0, size * 0.6, size * 0.3, size * 0.5);
  radGrad.addColorStop(0, 'rgba(255,255,255,0.3)');
  radGrad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = radGrad;
  ctx.fillRect(0, 0, size, size);

  return canvas.toDataURL('image/png');
}

let _cache: string[] | null = null;

export function getMockPhotos(): string[] {
  if (_cache) return _cache;
  _cache = PALETTE.map(c => makeGradientDataUrl(c));
  return _cache;
}
