import { getAverageColor, colorDistance, RGB } from './colorUtils';
import type { StyleType, DensityType } from '../types';

const GRID_SIZE: Record<DensityType, number> = { light: 20, standard: 32, hd: 48 };
const CANVAS_SIZE = 576;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function applyStyle(ctx: CanvasRenderingContext2D, style: StyleType, w: number, h: number) {
  if (style === 'clear') return;
  if (style === 'spring') {
    ctx.fillStyle = 'rgba(123,191,106,0.08)';
    ctx.fillRect(0, 0, w, h);
  } else if (style === 'dopamine') {
    ctx.fillStyle = 'rgba(255,184,77,0.10)';
    ctx.fillRect(0, 0, w, h);
  } else if (style === 'retro' || style === 'mono') {
    const imgData = ctx.getImageData(0, 0, w, h);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      if (style === 'mono') {
        const gray = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
        d[i] = d[i + 1] = d[i + 2] = gray;
      } else {
        // sepia
        const r = d[i], g = d[i + 1], b = d[i + 2];
        d[i]     = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
        d[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
        d[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }
}

export async function generateMosaic(
  mainSrc: string,
  tileSrcs: string[],
  style: StyleType,
  density: DensityType
): Promise<HTMLCanvasElement> {
  const N = GRID_SIZE[density];
  const tileSize = Math.floor(CANVAS_SIZE / N);
  const actualSize = tileSize * N;

  // load all images concurrently
  const [mainImg, ...tileImgs] = await Promise.all([
    loadImage(mainSrc),
    ...tileSrcs.map(s => loadImage(s)),
  ]);

  // precompute tile average colors
  const tileColors: RGB[] = tileImgs.map(img => getAverageColor(img));

  // sample main image at NxN
  const sampleCanvas = document.createElement('canvas');
  sampleCanvas.width = N; sampleCanvas.height = N;
  const sCtx = sampleCanvas.getContext('2d')!;
  sCtx.drawImage(mainImg, 0, 0, N, N);
  const sampleData = sCtx.getImageData(0, 0, N, N).data;

  // result canvas
  const result = document.createElement('canvas');
  result.width = actualSize; result.height = actualSize;
  const rCtx = result.getContext('2d')!;

  const radius = tileSize * 0.18;

  for (let row = 0; row < N; row++) {
    for (let col = 0; col < N; col++) {
      const idx = (row * N + col) * 4;
      const cellColor: RGB = { r: sampleData[idx], g: sampleData[idx + 1], b: sampleData[idx + 2] };

      // find closest tile
      let bestIdx = 0, bestDist = Infinity;
      for (let t = 0; t < tileColors.length; t++) {
        const dist = colorDistance(cellColor, tileColors[t]);
        if (dist < bestDist) { bestDist = dist; bestIdx = t; }
      }

      const x = col * tileSize, y = row * tileSize;

      // draw tile with rounded clip
      rCtx.save();
      rCtx.beginPath();
      rCtx.roundRect(x, y, tileSize, tileSize, radius);
      rCtx.clip();
      rCtx.drawImage(tileImgs[bestIdx], x, y, tileSize, tileSize);
      rCtx.restore();

      // thin gap
      rCtx.clearRect(x + tileSize - 1, y, 1, tileSize);
      rCtx.clearRect(x, y + tileSize - 1, tileSize, 1);
    }
  }

  applyStyle(rCtx, style, actualSize, actualSize);
  return result;
}
