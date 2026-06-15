import React from 'react';
import AppIcon from './AppIcon';

interface DownloadModalProps { onClose: () => void; }

const PLATFORMS = [
  { icon: '📱', name: 'iOS App Store', badge: '现已可用', badgeCls: 'badge-green' },
  { icon: '🤖', name: 'Android / 安卓', badge: '敬请期待', badgeCls: 'badge-coming' },
  { icon: '🌐', name: 'Web 网页版', badge: '敬请期待', badgeCls: 'badge-coming' },
];

export default function DownloadModal({ onClose }: DownloadModalProps) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose} aria-label="关闭">✕</button>
        <div className="modal-icon-row">
          <AppIcon size={72} />
        </div>
        <div className="modal-title">下载 <span style={{ fontFamily: 'var(--font-family-brand)', fontWeight: 500 }}>Memory Beads</span></div>
        <div className="modal-sub">把相册里的每个小瞬间，<br />拼成一张独一无二的大回忆。</div>
        <div className="modal-status-list">
          {PLATFORMS.map(p => (
            <div key={p.name} className="modal-status-row">
              <div className="modal-status-left">
                <span>{p.icon}</span>
                <span>{p.name}</span>
              </div>
              <span className={`badge ${p.badgeCls}`}>{p.badge}</span>
            </div>
          ))}
        </div>
        <a
          className="btn btn-primary"
          href="https://apps.apple.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          App Store 下载
        </a>
      </div>
    </div>
  );
}
