import React, { useEffect, useRef, useState } from 'react';
import type { GenerateParams } from '../types';
import { generateMosaic } from '../utils/mosaicGenerator';

interface GeneratingPageProps {
  params: GenerateParams;
  onDone: (canvas: HTMLCanvasElement) => void;
  onError: () => void;
}

const MESSAGES = [
  '正在分析主图色彩…',
  '计算每张照片的平均色调…',
  '匹配最佳拼豆位置…',
  '绘制圆角拼豆…',
  '应用风格滤镜…',
  '最后的润色中…',
  '马上就好了！',
];

const DOT_COLORS = ['#7BBF6A', '#FFB84D', '#FF8FA3', '#56CCF2', '#BDECCB'];

export default function GeneratingPage({ params, onDone, onError }: GeneratingPageProps) {
  const [msgIdx, setMsgIdx] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx(i => (i + 1) % MESSAGES.length);
    }, 900);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const start = Date.now();
    generateMosaic(params.mainImage, params.tileImages, params.style, params.density)
      .then(canvas => {
        const elapsed = Date.now() - start;
        const delay = Math.max(0, 800 - elapsed);
        setTimeout(() => {
          if (!doneRef.current) { doneRef.current = true; onDone(canvas); }
        }, delay);
      })
      .catch(() => onError());
  }, [params, onDone, onError]);

  return (
    <div className="generating-wrap">
      <div className="generating-dots">
        {DOT_COLORS.map((c, i) => (
          <div key={i} className="gen-dot" style={{ background: c }} />
        ))}
      </div>
      <div className="generating-title">正在生成你的记忆拼豆…</div>
      <div className="generating-msg">{MESSAGES[msgIdx]}</div>
      <div className="generating-progress-bar">
        <div className="generating-progress-fill" />
      </div>
    </div>
  );
}
