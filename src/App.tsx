import React, { useState, useCallback } from 'react';
import type { AppStep, GenerateParams } from './types';
import Particles from './components/Particles';
import LandingPage from './pages/LandingPage';
import CreatePage from './pages/CreatePage';
import GeneratingPage from './pages/GeneratingPage';
import ResultPage from './pages/ResultPage';
import SharePage from './pages/SharePage';
import Toast from './components/Toast';
import DownloadModal from './components/DownloadModal';

export default function App() {
  const [step, setStep] = useState<AppStep>('landing');
  const [genParams, setGenParams] = useState<GenerateParams | null>(null);
  const [resultCanvas, setResultCanvas] = useState<HTMLCanvasElement | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showDownload, setShowDownload] = useState(false);

  const showToast = useCallback((msg: string) => setToast(msg), []);
  const clearToast = useCallback(() => setToast(null), []);

  return (
    <>
      {/* Full-page drifting particle background (behind all content) */}
      <div className="page-particles" aria-hidden>
        <Particles
          particleColors={["#F1DCF2", "#DCEEFF", "#DFF6E9", "#FFE9CC", "#EBE2FF"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover
          alphaParticles={false}
          disableRotation={false}
          pixelRatio={1}
        />
      </div>

      {step === 'landing' && (
        <LandingPage
          onDownload={() => setShowDownload(true)}
        />
      )}
      {step === 'create' && (
        <CreatePage
          onBack={() => setStep('landing')}
          onGenerate={(params) => { setGenParams(params); setStep('generating'); }}
          showToast={showToast}
        />
      )}
      {step === 'generating' && genParams && (
        <GeneratingPage
          params={genParams}
          onDone={(canvas) => { setResultCanvas(canvas); setStep('result'); }}
          onError={() => { showToast('生成失败，请重试'); setStep('create'); }}
        />
      )}
      {step === 'result' && resultCanvas && (
        <ResultPage
          canvas={resultCanvas}
          onRegenerate={() => setStep('create')}
          onShare={() => setStep('share')}
          onBack={() => setStep('create')}
        />
      )}
      {step === 'share' && resultCanvas && (
        <SharePage
          canvas={resultCanvas}
          onBack={() => setStep('result')}
        />
      )}
      {toast && <Toast message={toast} onDone={clearToast} />}
      {showDownload && <DownloadModal onClose={() => setShowDownload(false)} />}
    </>
  );
}
