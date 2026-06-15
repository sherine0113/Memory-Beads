import React, { useEffect, useRef, useState } from 'react';
import AppIcon from '../components/AppIcon';
import { saveCanvas } from '../utils/downloadUtils';

interface SharePageProps {
  canvas: HTMLCanvasElement;
  onBack: () => void;
}

export default function SharePage({ canvas, onBack }: SharePageProps) {
  const [title, setTitle] = useState('');
  const previewRef = useRef<HTMLCanvasElement>(null);
  const CARD_W = 480;
  const IMG_H = 480;
  const FOOTER_H = 120;
  const CARD_H = IMG_H + FOOTER_H;

  useEffect(() => {
    drawCard();
  }, [title, canvas]);

  function drawCard() {
    const el = previewRef.current;
    if (!el) return;
    const ctx = el.getContext('2d')!;
    el.width = CARD_W;
    el.height = CARD_H;

    // background gradient
    const grad = ctx.createLinearGradient(0, 0, CARD_W, CARD_H);
    grad.addColorStop(0, '#FFF9EF');
    grad.addColorStop(1, '#EAF5DF');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CARD_W, CARD_H);

    // mosaic image
    ctx.drawImage(canvas, 0, 0, CARD_W, IMG_H);

    // footer area
    ctx.fillStyle = '#FFFFFF';
    ctx.globalAlpha = 0.9;
    ctx.fillRect(0, IMG_H, CARD_W, FOOTER_H);
    ctx.globalAlpha = 1;

    // title text
    const displayTitle = title.trim() || '我的记忆拼豆';
    ctx.font = 'bold 24px "Nunito", system-ui, sans-serif';
    ctx.fillStyle = '#2F332B';
    ctx.fillText(displayTitle, 24, IMG_H + 38);

    // tagline
    ctx.font = '14px "Nunito", system-ui, sans-serif';
    ctx.fillStyle = '#6D735F';
    ctx.fillText('用照片拼出的记忆 · Memory Beads', 24, IMG_H + 64);

    // brand badge
    ctx.font = 'bold 11px "Nunito", system-ui, sans-serif';
    ctx.fillStyle = '#4E8F45';
    ctx.fillText('✦ Memory Beads · 记忆拼豆', 24, IMG_H + 96);
  }

  const handleSave = () => {
    const el = previewRef.current;
    if (el) saveCanvas(el, `memory-beads-share-${title.trim() || 'card'}.png`);
  };

  return (
    <div className="share-wrap">
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 64, display: 'flex', alignItems: 'center', padding: '0 20px', background: 'rgba(255,249,239,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--color-border-light)', zIndex: 10, gap: 12 }}>
        <button className="demo-back-btn" onClick={onBack}>←</button>
        <div className="demo-header-title">做成分享卡</div>
      </div>

      <div className="share-header" style={{ marginTop: 'var(--space-4)' }}>
        <h2>给你的拼豆起个名字 🎴</h2>
        <p>会显示在分享卡下方，发给朋友时更有仪式感。</p>
      </div>

      <div className="share-input-wrap">
        <input
          className="share-input"
          placeholder="我的春天碎片"
          maxLength={40}
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>

      <div className="share-card-preview" style={{ maxWidth: 360 }}>
        <canvas
          ref={previewRef}
          style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 'var(--radius-xl)' }}
        />
      </div>

      <div className="share-actions" style={{ marginTop: 'var(--space-6)' }}>
        <button className="btn btn-primary btn-lg" onClick={handleSave}>
          💾 保存分享卡
        </button>
        <button className="btn btn-secondary" onClick={onBack}>
          返回修改
        </button>
      </div>
    </div>
  );
}
