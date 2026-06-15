export interface RGB { r: number; g: number; b: number; }

export function colorDistance(a: RGB, b: RGB): number {
  const dr = a.r - b.r, dg = a.g - b.g, db = a.b - b.b;
  return dr * dr + dg * dg + db * db;
}

export function getAverageColor(
  img: HTMLImageElement | HTMLCanvasElement,
  sx = 0, sy = 0, sw?: number, sh?: number
): RGB {
  const size = 16;
  const c = document.createElement('canvas');
  c.width = size; c.height = size;
  const ctx = c.getContext('2d')!;
  if (img instanceof HTMLImageElement) {
    ctx.drawImage(img, sx, sy, sw ?? img.naturalWidth, sh ?? img.naturalHeight, 0, 0, size, size);
  } else {
    ctx.drawImage(img, sx, sy, sw ?? img.width, sh ?? img.height, 0, 0, size, size);
  }
  const data = ctx.getImageData(0, 0, size, size).data;
  let r = 0, g = 0, b = 0, count = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 10) continue;
    r += data[i]; g += data[i + 1]; b += data[i + 2]; count++;
  }
  if (!count) return { r: 128, g: 128, b: 128 };
  return { r: Math.round(r / count), g: Math.round(g / count), b: Math.round(b / count) };
}

export function hexToRgb(hex: string): RGB {
  const n = parseInt(hex.replace('#', ''), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
