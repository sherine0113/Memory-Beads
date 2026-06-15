import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import AppIcon from '../components/AppIcon';

interface LandingPageProps { onDownload: () => void; }

// Prefix a public-asset path with Vite's base URL so it resolves correctly
// when the site is served from a sub-path (e.g. GitHub Pages /Memory-Beads/).
const asset = (p: string) => import.meta.env.BASE_URL + p.replace(/^\//, '');

const APP_STORE_URL = 'https://play.google.com/store';

const HERO_BEADS = [
  { size: 18, color: '#86F28F', top: '18%', left: '7%', delay: 0 },
  { size: 12, color: '#FFE94A', top: '32%', right: '8%', delay: -1.4 },
  { size: 22, color: '#6BD8FF', bottom: '28%', left: '5%', delay: -2.8 },
  { size: 10, color: '#FF8BCB', top: '62%', right: '6%', delay: -0.7 },
  { size: 16, color: '#B58CFF', bottom: '18%', right: '14%', delay: -3.5 },
  { size: 8,  color: '#FFE94A', top: '48%', left: '3%', delay: -1.8 },
  { size: 14, color: '#86F28F', top: '14%', right: '20%', delay: -4.2 },
  { size: 20, color: '#6BD8FF', bottom: '38%', right: '5%', delay: -2.1 },
];

const FEATURES = [
  { icon: 'burger', label: 'ZOOM IN', tone: 'blue',  tag: '远看 / 近看', title: '远看是一颗拼豆，近看全是回忆', desc: '把同地点的照片分类成合集，生成专属的拼豆照片墙。远看是一幅完整图案，放大后，每一颗拼豆都是你在那里留下的一个瞬间。' },
  { icon: 'cola',   label: 'MEMORY',  tone: 'mint',  tag: '生活碎片',     title: '用相册碎片，拼出生活故事', desc: 'Memory Beads 会根据地点整理自拍、旅行和日常照片。那些散落在相册里的生活片段，会被重新拼成一张有趣的回忆图，让你用另一种方式回顾过去。' },
  { icon: 'wing',   label: 'STYLE',   tone: 'peach', tag: '一键生成',     title: '随机生成专属拼豆图案', desc: '根据每个相册合集里的照片数量，自动生成合适的拼豆图案。照片越多，拼豆越丰富，每次生成都有不一样的惊喜。' },
  { icon: 'fries',  label: 'EXPORT',  tone: 'pink',  tag: '可打印',       title: '可保存、可分享、可打印', desc: '生成后的作品可以保存成手机壁纸，也可以分享到社媒，或打印出来。不只是数字图片，也可以变成一份真实的纪念。' },
];

// scroll-driven layout: 4 cards go from a stacked deck (center) → diagonal spread
const STACK_STATE = [
  { x: -36, y: 0,  rotate: -8, scale: 0.92 },
  { x: -12, y: -8, rotate: -3, scale: 0.95 },
  { x: 14,  y: 6,  rotate: 4,  scale: 0.96 },
  { x: 36,  y: 12, rotate: 9,  scale: 0.92 },
];
const EXPANDED_STATE = [
  { x: -420, y: -86, rotate: -8, scale: 1 },
  { x: -140, y: -30, rotate: -3, scale: 1 },
  { x: 150,  y: 34,  rotate: 4,  scale: 1 },
  { x: 430,  y: 92,  rotate: 8,  scale: 1 },
];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const ANDROID_ICON_LG = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.523 15.341a.79.79 0 0 1-.789.789.79.79 0 0 1-.788-.789V10.8a.79.79 0 0 1 .788-.789.79.79 0 0 1 .789.789v4.54zm-10.057 0a.79.79 0 0 1-.789.789.79.79 0 0 1-.789-.789V10.8a.79.79 0 0 1 .789-.789.79.79 0 0 1 .789.789v4.54zM17.7 6.64l1.306-2.288a.27.27 0 0 0-.098-.368.27.27 0 0 0-.368.099l-1.325 2.32A8.23 8.23 0 0 0 12 4.559a8.23 8.23 0 0 0-5.215 1.844L5.46 4.083a.27.27 0 0 0-.368-.099.27.27 0 0 0-.098.368L6.3 6.64A7.94 7.94 0 0 0 2 13.328h20A7.94 7.94 0 0 0 17.7 6.64zM9.5 10.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
  </svg>
);

// Four floating cards: front = bead mosaic (rendered from the photo),
// back (hover-flip) = the real landscape photo.
const FLOAT_CARDS = [
  { real: asset('/real-1.jpg'), pos: 'mb-card-tl', float: 'mb-float-slow' },
  { real: asset('/real-2.jpg'), pos: 'mb-card-tr', float: 'mb-float-medium' },
  { real: asset('/real-3.jpg'), pos: 'mb-card-bl', float: 'mb-float-medium' },
  { real: asset('/real-4.jpg'), pos: 'mb-card-br', float: 'mb-float-slow' },
];

// Turn a loaded photo into a wall of round fuse-beads on the given canvas.
function renderBeads(canvas: HTMLCanvasElement, img: HTMLImageElement) {
  const W = 540, H = 420;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const COLS = 46;
  const cell = W / COLS;
  const ROWS = Math.round(H / cell);
  const radius = cell * 0.42;

  const buf = document.createElement('canvas');
  buf.width = COLS; buf.height = ROWS;
  const bctx = buf.getContext('2d');
  if (!bctx) return;
  bctx.drawImage(img, 0, 0, COLS, ROWS);
  const data = bctx.getImageData(0, 0, COLS, ROWS).data;

  ctx.fillStyle = '#f0f1ee';
  ctx.fillRect(0, 0, W, H);
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const i = (y * COLS + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const cx = x * cell + cell / 2;
      const cy = y * cell + cell / 2;
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.beginPath(); ctx.arc(cx, cy, radius + 0.8, 0, Math.PI * 2); ctx.fill();
      const grad = ctx.createRadialGradient(cx - radius * 0.35, cy - radius * 0.35, radius * 0.12, cx, cy, radius);
      grad.addColorStop(0, `rgb(${Math.min(r + 55, 255)},${Math.min(g + 55, 255)},${Math.min(b + 55, 255)})`);
      grad.addColorStop(0.55, `rgb(${r},${g},${b})`);
      grad.addColorStop(1, `rgb(${(r * 0.7) | 0},${(g * 0.7) | 0},${(b * 0.7) | 0})`);
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.beginPath(); ctx.arc(cx - radius * 0.32, cy - radius * 0.32, radius * 0.18, 0, Math.PI * 2); ctx.fill();
    }
  }
}

// Render text with every "Memory Beads" shown in the handwritten brand style.
function brand(text: string): React.ReactNode {
  const parts = text.split('Memory Beads');
  return parts.flatMap((p, i) =>
    i === 0 ? [p] : [<span key={i} className="mb-wordmark">Memory Beads</span>, p],
  );
}

export default function LandingPage({ onDownload }: LandingPageProps) {
  const beadRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const featSectionRef = useRef<HTMLElement>(null);
  const featCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Render the bead-mosaic front for each floating card once.
  useEffect(() => {
    let cancelled = false;
    FLOAT_CARDS.forEach((card, i) => {
      const img = new Image();
      img.onload = () => {
        const cv = beadRefs.current[i];
        if (!cancelled && cv) renderBeads(cv, img);
      };
      img.src = card.real;
    });
    return () => { cancelled = true; };
  }, []);

  // Scroll-driven: stacked deck (center) → diagonal spread, then idle float.
  useEffect(() => {
    const section = featSectionRef.current;
    if (!section) return;
    let raf = 0;
    const apply = () => {
      raf = 0;
      // mobile: cards live in normal flow (CSS)
      if (window.innerWidth <= 768) return;
      const vh = window.innerHeight;
      const range = Math.max(section.offsetHeight - vh, 1);
      const scrolled = Math.min(Math.max(-section.getBoundingClientRect().top, 0), range);
      const p = scrolled / range;                       // 0..1 through the section
      const t = easeOutCubic(clamp01((p - 0.18) / 0.6)); // expand window 0.18→0.78
      const vw = window.innerWidth;
      const f = Math.min(1, Math.max(0.6, vw / 1240));   // shrink spread on small screens
      featCardsRef.current.forEach((el, i) => {
        if (!el) return;
        const s = STACK_STATE[i], e = EXPANDED_STATE[i];
        el.style.setProperty('--tx', `${lerp(s.x, e.x * f, t)}px`);
        el.style.setProperty('--ty', `${lerp(s.y, e.y * f, t)}px`);
        el.style.setProperty('--rot', `${lerp(s.rotate, e.rotate, t)}deg`);
        el.style.setProperty('--scl', `${lerp(s.scale, e.scale, t)}`);
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply); };
    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div id="top">
      <Navbar onDownload={onDownload} />

      {/* ── HERO (floating flip-card layout) ── */}
      <section className="mb-hero">
        {/* decorative handwritten notes */}
        <span className="mb-hand-note mb-note-1">your photos, re-beaded</span>
        <span className="mb-hand-note mb-note-2">flip to see the real view ✧</span>

        {/* four floating cards */}
        <div className="mb-card-area">
          {FLOAT_CARDS.map((card, i) => (
            <div key={i} className={`mb-floating-card ${card.pos}`}>
              <div className={`mb-card-floatwrap ${card.float}`}>
                <div className="mb-card-inner">
                  <div className="mb-card-face mb-card-front">
                    <canvas ref={el => { beadRefs.current[i] = el; }} />
                  </div>
                  <div className="mb-card-face mb-card-back">
                    <img src={card.real} alt="风景照片" draggable={false} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* center stack */}
        <div className="mb-hero-center">
          <h1 className="mb-hero-title fade-up">Memory Beads</h1>
          <p className="mb-hero-subtitle fade-up fade-up-d1">
            把你的相册变成一张专属拼豆照片墙。<br />
            远看是一幅画，近看全是你的生活碎片。
          </p>
          <button
            className="mb-hero-cta fade-up fade-up-d2"
            onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          >
            继续浏览
            <span className="mb-hero-cta-icon" aria-hidden>↓</span>
          </button>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-section" id="how">
        <div className="section-inner text-center">
          <h2 className="section-title">不用会设计，也能拼出回忆</h2>
          <p className="section-sub">授权相册、自动归类、一键生成。<br />照片会按地点变成合集，再被拼成一张属于你的记忆墙。</p>
          <div className="steps-row">
            {[
              { n: '1', title: '授权相册，让照片成为拼豆素材', desc: '打开 Memory Beads，授权访问你的相册。它会读取你允许使用的照片，把散落在手机里的瞬间，变成可以被重新拼起来的创作素材。', shot: asset('/mock-1.png') },
              { n: '2', title: '按地点整理，生成你的回忆合集', desc: 'Memory Beads 会根据照片中的地点信息，自动整理出不同地点的回忆合集。一次旅行、一座城市、一段校园生活，都可以被归成一个专属记忆包。', shot: asset('/mock-2.png') },
              { n: '3', title: '点进合集，生成专属拼豆记忆墙', desc: '选择一个回忆合集，Memory Beads 会根据照片数量生成对应规模的拼豆画。远看是一幅完整画面，放大后，每一颗拼豆都是一张被装饰过的照片卡片，记录着它的时间、地点和那段生活片段。', shot: asset('/mock-3.png') },
            ].map(step => (
              <div key={step.n} className="step-item">
                <div className="step-num-circle">{step.n}</div>
                <img className="step-mockup" src={step.shot} alt={step.title} draggable={false} />
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{brand(step.desc)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES（为什么选 · 滚动展开卡组）── */}
      <section className="feature-stack-section" id="features" ref={featSectionRef}>
        <div className="feature-stack-sticky">
          <h2 className="why-title feat-stack-title">
            为什么选 <span className="brand-hand">Memory Beads</span>
          </h2>
          <div className="feature-card-stack">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                ref={el => { featCardsRef.current[i] = el; }}
                className={`feature-card feature-card-${f.tone}`}
              >
                <div className="feature-card-inner">
                  <span className="halftone" aria-hidden />
                  <span className="pin" aria-hidden />
                  <div className="feature-card-content">
                    <h3 className="feature-card-title">{f.title}</h3>
                    <p className="feature-card-body">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOWNLOAD ── */}
      <section className="download-section" id="download">
        <div className="download-inner">
          <div className="download-icon-wrap" style={{ display: 'flex', justifyContent: 'center' }}>
            <AppIcon size={80} />
          </div>
          <h2 className="section-title text-center">随时随地，拼豆你的回忆</h2>
          <div className="download-qr">
            <img src={asset('/qr.png')} alt="Android 下载二维码" />
            <span className="download-qr-cap">扫码下载 Android 版</span>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer" id="footer">
        <div className="footer-thanks">Memory Beads<span className="footer-heart" aria-hidden>💚</span></div>
        <div className="footer-tagline">把相册里的小瞬间，拼成一张大回忆</div>
        <div className="footer-dots">
          {['#86F28F','#FFE94A','#FF8BCB','#6BD8FF','#B58CFF','#DDFADB','#FFF5A8','#FFE1F0'].map((c, i) => (
            <span key={i} className="footer-dot" style={{ background: c, animationDelay: `${i * 0.22}s` }} />
          ))}
        </div>
        <div className="footer-copy">© 2026 <span className="mb-wordmark">Memory Beads</span> · 纯本地处理 · 你的照片只属于你</div>
      </footer>
    </div>
  );
}
