import React, { useEffect, useRef, useState } from 'react';
import { saveCanvas } from '../utils/downloadUtils';

interface ResultPageProps {
  canvas: HTMLCanvasElement;
  onRegenerate: () => void;
  onShare: () => void;
  onBack: () => void;
}

export default function ResultPage({ canvas, onRegenerate, onShare, onBack }: ResultPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const displayRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragStart = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  useEffect(() => {
    const el = displayRef.current;
    if (!el) return;
    const ctx = el.getContext('2d')!;
    el.width = canvas.width;
    el.height = canvas.height;
    ctx.drawImage(canvas, 0, 0);
  }, [canvas]);

  useEffect(() => {
    const el = displayRef.current;
    if (!el) return;
    el.style.transform = `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`;
  }, [zoom, offset]);

  const clampOffset = (ox: number, oy: number, z: number) => {
    const max = (canvas.width * (z - 1)) / 2;
    return { x: Math.max(-max, Math.min(max, ox)), y: Math.max(-max, Math.min(max, oy)) };
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const z = parseFloat(e.target.value);
    setZoom(z);
    setOffset(clampOffset(offset.x, offset.y, z));
    const pct = ((z - 1) / 2) * 100;
    e.target.style.setProperty('--pct', `${pct}%`);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    dragStart.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setOffset(clampOffset(dragStart.current.ox + dx, dragStart.current.oy + dy, zoom));
  };
  const onMouseUp = () => { dragStart.current = null; };

  return (
    <div className="result-wrap">
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 64, display: 'flex', alignItems: 'center', padding: '0 20px', background: 'rgba(255,249,239,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--color-border-light)', zIndex: 10, gap: 12 }}>
        <button className="demo-back-btn" onClick={onBack}>←</button>
        <div>
          <div className="demo-header-title">你的记忆拼豆</div>
          <div className="demo-header-step">滑动缩放查看细节</div>
        </div>
      </div>

      <div className="result-header" style={{ marginTop: 'var(--space-4)' }}>
        <h2>完成了！✨</h2>
        <p>拖动可以移动视角，滑动可以放大查看每一粒拼豆。</p>
      </div>

      <div className="bead-canvas-wrapper">
        <div
          className="bead-canvas-scroll"
          ref={containerRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          <canvas ref={displayRef} />
        </div>
      </div>

      <div className="zoom-controls">
        <div className="zoom-label">
          <span>1×</span>
          <span>缩放：{zoom.toFixed(1)}×</span>
          <span>3×</span>
        </div>
        <input
          type="range" className="zoom-slider"
          min={1} max={3} step={0.05} value={zoom}
          style={{ '--pct': `${((zoom - 1) / 2) * 100}%` } as React.CSSProperties}
          onChange={handleZoomChange}
        />
      </div>

      <div className="result-actions">
        <button className="btn btn-primary" onClick={() => saveCanvas(canvas, 'memory-beads.png')}>
          💾 保存图片
        </button>
        <button className="btn btn-secondary" onClick={onShare}>
          🎴 做成分享卡
        </button>
        <button className="btn btn-ghost btn-sm" onClick={onRegenerate}>
          重新生成
        </button>
      </div>
    </div>
  );
}
