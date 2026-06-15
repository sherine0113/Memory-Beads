import React, { useState } from 'react';

interface NavbarProps { onDownload: () => void; }

const NAV_LINKS = [
  { href: '#how', label: '玩法' },
  { href: '#features', label: '灵感' },
  { href: '#download', label: '下载' },
  { href: '#footer', label: '关于' },
];

export default function Navbar({ onDownload }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="mb-nav">
        <a className="mb-nav-logo" href="#top">xueying</a>

        <div className="mb-nav-links">
          {NAV_LINKS.map(l => (
            <a
              key={l.href} className="mb-nav-link" href={l.href}
            >
              {l.label}
            </a>
          ))}
        </div>

        <button
          className="mb-nav-menu"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="菜单"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {menuOpen && (
        <div className="mb-nav-drawer">
          {NAV_LINKS.map(l => (
            <a
              key={l.href} className="mb-nav-link" href={l.href}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
