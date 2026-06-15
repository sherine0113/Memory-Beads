import React, { useState, useRef, useCallback } from 'react';
import type { GenerateParams, StyleType, DensityType } from '../types';
import { getMockPhotos } from '../utils/mockPhotos';

interface CreatePageProps {
  onBack: () => void;
  onGenerate: (params: GenerateParams) => void;
  showToast: (msg: string) => void;
}

const STYLES: { key: StyleType; label: string; desc: string; emoji: string; colors: [string, string] }[] = [
  { key: 'spring', label: '春日绿意', desc: '清新绿调，治愈系', emoji: '🌿', colors: ['#7BBF6A', '#EAF5DF'] },
  { key: 'dopamine', label: '多巴胺', desc: '活力橙黄，能量满满', emoji: '🌟', colors: ['#FFB84D', '#FFF0B8'] },
  { key: 'retro', label: '复古胶片', desc: '暖棕色调，岁月感', emoji: '📷', colors: ['#C8A87A', '#F5EDE0'] },
  { key: 'clear', label: '纯净清透', desc: '原色直出，最真实', emoji: '💎', colors: ['#56CCF2', '#EAF3FF'] },
  { key: 'mono', label: '极简黑白', desc: '去色处理，极简风', emoji: '🖤', colors: ['#888', '#eee'] },
];

const DENSITIES: { key: DensityType; label: string; desc: string; grid: string; icon: string }[] = [
  { key: 'light', label: '轻盈', desc: '快速生成', grid: '20×20', icon: '○' },
  { key: 'standard', label: '标准', desc: '平衡效果', grid: '32×32', icon: '◉' },
  { key: 'hd', label: '高清', desc: '细节最多', grid: '48×48', icon: '⬛' },
];

const STEPS = ['上传主图', '导入相册', '选风格', '生成'];

export default function CreatePage({ onBack, onGenerate, showToast }: CreatePageProps) {
  const [step, setStep] = useState(0);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [albumImages, setAlbumImages] = useState<string[]>([]);
  const [style, setStyle] = useState<StyleType>('spring');
  const [density, setDensity] = useState<DensityType>('standard');
  const mainInputRef = useRef<HTMLInputElement>(null);
  const albumInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const readFile = (file: File): Promise<string> =>
    new Promise(res => { const r = new FileReader(); r.onload = e => res(e.target!.result as string); r.readAsDataURL(file); });

  const handleMainFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) { showToast('请选择图片文件'); return; }
    const src = await readFile(file);
    setMainImage(src);
  }, [showToast]);

  const handleAlbumFiles = useCallback(async (files: FileList) => {
    const srcs = await Promise.all(
      Array.from(files).filter(f => f.type.startsWith('image/')).slice(0, 50).map(readFile)
    );
    setAlbumImages(prev => [...prev, ...srcs].slice(0, 50));
  }, []);

  const useMockPhotos = useCallback(() => {
    setAlbumImages(getMockPhotos());
    showToast('✅ 已加载 20 张示例照片');
  }, [showToast]);

  const goNext = () => {
    if (step === 0 && !mainImage) { showToast('请先上传一张主图'); return; }
    if (step === 2) {
      const tiles = albumImages.length > 0 ? albumImages : getMockPhotos();
      if (albumImages.length === 0) showToast('✅ 自动使用示例照片');
      onGenerate({ mainImage: mainImage!, tileImages: tiles, style, density });
      return;
    }
    setStep(s => s + 1);
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="demo-wrap">
      <div className="demo-phone-frame">
        {/* Header */}
        <div className="demo-header">
          <button className="demo-back-btn" onClick={step === 0 ? onBack : () => setStep(s => s - 1)}>←</button>
          <div>
            <div className="demo-header-title">{STEPS[step]}</div>
            <div className="demo-header-step">步骤 {step + 1} / {STEPS.length}</div>
          </div>
        </div>

        {/* Progress */}
        <div className="demo-progress">
          <div className="demo-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Body */}
        <div className="demo-body">
          {/* Step 0: main image */}
          {step === 0 && (
            <>
              <div className="demo-step-title">选一张主图</div>
              <div className="demo-step-sub">这张图会被"拼豆化"，选你最想留住的那一张吧。</div>
              <input ref={mainInputRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => e.target.files?.[0] && handleMainFile(e.target.files[0])} />
              {mainImage ? (
                <div>
                  <img src={mainImage} className="upload-preview-square" alt="主图预览" />
                  <button className="upload-replace" onClick={() => mainInputRef.current?.click()}>重新选择</button>
                </div>
              ) : (
                <div
                  className={`upload-box${dragOver ? ' drag-over' : ''}`}
                  onClick={() => mainInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => {
                    e.preventDefault(); setDragOver(false);
                    const f = e.dataTransfer.files?.[0]; if (f) handleMainFile(f);
                  }}
                >
                  <div className="upload-icon">🖼️</div>
                  <div className="upload-hint"><strong>点击选择</strong>或拖入照片</div>
                  <div className="upload-hint" style={{ marginTop: 4, fontSize: 11 }}>JPG · PNG · WEBP</div>
                </div>
              )}
            </>
          )}

          {/* Step 1: album */}
          {step === 1 && (
            <>
              <div className="demo-step-title">导入你的相册</div>
              <div className="demo-step-sub">这些照片会成为拼豆的素材。照片越多样，效果越好！</div>
              <input ref={albumInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
                onChange={e => e.target.files && handleAlbumFiles(e.target.files)} />
              {albumImages.length > 0 && (
                <>
                  <div className="album-count">已选 {albumImages.length} 张</div>
                  <div className="album-grid">
                    {albumImages.slice(0, 20).map((src, i) => (
                      <div key={i} className="album-thumb">
                        <img src={src} className="album-thumb-img" alt="" />
                        <button className="album-thumb-del" onClick={() =>
                          setAlbumImages(prev => prev.filter((_, j) => j !== i))}>✕</button>
                      </div>
                    ))}
                    {albumImages.length > 20 && (
                      <div className="album-thumb" style={{ background: 'var(--color-bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--color-text-secondary)', borderRadius: 'var(--radius-xs)' }}>
                        +{albumImages.length - 20}
                      </div>
                    )}
                  </div>
                </>
              )}
              <div className="album-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => albumInputRef.current?.click()}>
                  + 添加照片
                </button>
                <button className="btn btn-ghost btn-sm" onClick={useMockPhotos}>
                  用示例照片
                </button>
              </div>
              {albumImages.length === 0 && (
                <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 'var(--space-3)' }}>
                  不上传也没关系，点"下一步"会自动使用示例照片。
                </p>
              )}
            </>
          )}

          {/* Step 2: style + density */}
          {step === 2 && (
            <>
              <div className="demo-step-title">选风格</div>
              <div className="demo-step-sub">挑一款你喜欢的色调。</div>
              <div className="style-grid">
                {STYLES.map(s => (
                  <div
                    key={s.key}
                    className={`style-card${style === s.key ? ' selected' : ''}`}
                    onClick={() => setStyle(s.key)}
                  >
                    <div className="style-card-swatch" style={{ background: `linear-gradient(135deg, ${s.colors[0]}, ${s.colors[1]})` }} />
                    <div className="style-card-info">
                      <div className="style-card-name">{s.emoji} {s.label}</div>
                      <div className="style-card-desc">{s.desc}</div>
                    </div>
                    <div className="style-check">✓</div>
                  </div>
                ))}
              </div>

              <div className="demo-step-sub" style={{ marginTop: 'var(--space-5)' }}>选密度</div>
              <div className="density-grid">
                {DENSITIES.map(d => (
                  <div
                    key={d.key}
                    className={`density-card${density === d.key ? ' selected' : ''}`}
                    onClick={() => setDensity(d.key)}
                  >
                    <div className="density-icon">{d.icon}</div>
                    <div className="density-name">{d.label}</div>
                    <div className="density-desc">{d.desc}</div>
                    <div className="density-grid-label">{d.grid}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sticky footer */}
        <div className="demo-sticky-footer">
          <button className="btn btn-primary" onClick={goNext}>
            {step === 2 ? '✨ 生成我的记忆拼豆' : '下一步 →'}
          </button>
        </div>
      </div>
    </div>
  );
}
