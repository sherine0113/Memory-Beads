import React, { useEffect, useState } from 'react';

export default function MouseGlowBackground() {
  const [pos, setPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <>
      {/* Ambient glow — smaller, very subtle */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          left: `${pos.x}%`, top: `${pos.y}%`,
          transform: 'translate(-50%, -50%)',
          width: 280, height: 280,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(134,242,143,0.09) 0%, rgba(107,216,255,0.05) 50%, transparent 70%)',
          filter: 'blur(32px)',
          transition: 'left 0.14s ease, top 0.14s ease',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Bottom cursor beam — narrower, lighter */}
      <div className="cursor-beam-wrap">
        <div
          className="cursor-beam-spot"
          style={{ left: `${pos.x}%` }}
        />
      </div>
    </>
  );
}
