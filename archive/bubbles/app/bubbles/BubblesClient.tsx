"use client";
import React, { useState, useRef, Suspense, useEffect } from 'react';
import BubblesCanvas, { BubblesCanvasRef } from '../../../components/Bubbles/BubblesCanvas';
import { FONTS_MAP } from '../../../utils/fontsMap';
import { useLanguage } from '../../../context/LanguageContext';

export interface BubblesState {
  text: string;
  fontFamily: string;
  fontUrl: string;
  minSize: number;
  maxSize: number;
  speed: number;
  noise: number;
  stickiness: number;
  mode: 'bw' | 'color';
  theme: 'dark' | 'light';
  textColor: string;
  bgColor: string;
}

export default function BubblesClient() {
  const { t, lang } = useLanguage();
  const isRTL = lang === 'he';
  const initialFamily = FONTS_MAP[2]; // Neoklass
  const initialStyle = initialFamily.styles[10]; // Black
  const [family, setFamily] = useState(initialFamily);
  const [style, setStyle] = useState(initialStyle);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const [state, setState] = useState<BubblesState>({
    text: "Bubbles",
    fontFamily: initialFamily.family,
    fontUrl: initialStyle.url,
    minSize: 0.2,
    maxSize: 0.8,
    speed: 1.0,
    noise: 0.3,
    stickiness: 0.5,
    mode: 'bw',
    theme: 'dark',
    textColor: "#ffffff",
    bgColor: "#000000",
  });

  useEffect(() => {
    setState(prev => ({ ...prev, fontUrl: style.url, fontFamily: family.family }));
  }, [style, family]);

  const [isRecording, setIsRecording] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportBlob, setExportBlob] = useState<{ blob: Blob; extension: string } | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const exportFilename = useRef('');
  const canvasRef = useRef<BubblesCanvasRef>(null);

  const handleExportVideo = async () => {
    if (isRecording) return;
    setIsRecording(true);
    setExportProgress(0);
    setExportBlob(null);
    setShowPopup(false);
    try {
      const data = await canvasRef.current?.exportVideo((percent) => {
        setExportProgress(percent);
      });
      if (data) {
        exportFilename.current = `bubbles_${Date.now()}.${data.extension}`;
        setExportBlob({ blob: data.blob, extension: data.extension });
        setShowPopup(true);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to export video");
    } finally {
      setIsRecording(false);
      setExportProgress(0);
    }
  };

  const handleDownloadFile = async () => {
    if (!exportBlob) return;
    const filename = exportFilename.current;

    if ('showSaveFilePicker' in window) {
      try {
        const isWebm = exportBlob.extension === 'webm';
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: filename,
          types: [{
            description: 'WebM Video with Alpha',
            accept: { 'video/webm': ['.webm'] }
          }]
        });
        const writable = await handle.createWritable();
        await writable.write(exportBlob.blob);
        await writable.close();
        return;
      } catch (e: any) {
        if (e.name === 'AbortError') return;
        console.warn('showSaveFilePicker failed, falling back:', e);
      }
    }

    const url = URL.createObjectURL(exportBlob.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setState(prev => ({
      ...prev,
      [name]: type === 'range' || type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFamily = FONTS_MAP.find(f => f.family === e.target.value);
    if (selectedFamily) {
      setFamily(selectedFamily);
      setStyle(selectedFamily.styles[0]);
    }
  };

  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStyle = family.styles.find(s => s.name === e.target.value);
    if (selectedStyle) setStyle(selectedStyle);
  };

  const ControlSlider = ({ label, name, min, max, step }: { label: string, name: keyof BubblesState, min: number, max: number, step: number }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: isMobile ? '0.65rem' : '0.75rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        <label htmlFor={name.toString()}>{label}</label>
        <span>{state[name as keyof BubblesState]}</span>
      </div>
      <input type="range" id={name.toString()} name={name} min={min} max={max} step={step} value={state[name as keyof BubblesState] as number} onChange={handleChange} style={{ width: '100%', accentColor: 'var(--text-color)', cursor: 'pointer', direction: 'ltr' }} />
    </div>
  );

  return (
    <>
      {showPopup && exportBlob && (
        <div
          onClick={() => setShowPopup(false)}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(18, 18, 18, 0.85)',
            zIndex: 2000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-color)',
              color: 'var(--text-color)',
              border: '1.5px solid var(--border-color)',
              padding: '2.5rem',
              maxWidth: '480px',
              width: '100%',
              position: 'relative',
              borderRadius: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              direction: isRTL ? 'rtl' : 'ltr',
              textAlign: isRTL ? 'right' : 'left'
            }}
          >
            <button
              onClick={() => setShowPopup(false)}
              style={{
                position: 'absolute', top: '1rem',
                [isRTL ? 'left' : 'right']: '1rem',
                background: 'transparent', border: 'none',
                fontSize: '1.25rem', cursor: 'pointer',
                color: 'var(--text-color)', lineHeight: 1,
                padding: '0.25rem 0.5rem'
              }}
            >
              ✕
            </button>

            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{t('bubbles.export')}</h2>
              <div style={{ borderTop: '1.5px solid var(--border-color)', paddingTop: '1rem', opacity: 0.7, fontSize: '0.85rem' }}>
                <p style={{ margin: 0 }}>{exportFilename.current}</p>
                <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-color)', opacity: 0.5 }}>Exported as High Quality WebM with alpha channel.</p>
              </div>
            </div>

            <button
              onClick={handleDownloadFile}
              className="nav-btn"
              style={{
                width: '100%', padding: '0.75rem',
                fontFamily: 'inherit', fontSize: '0.9rem',
                cursor: 'pointer', textAlign: 'center',
                fontWeight: 'bold', justifyContent: 'center'
              }}
            >
              {t('bubbles.save_video')}
            </button>
          </div>
        </div>
      )}

      <div style={{
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        height: '100%', width: '100%', background: 'transparent', color: 'var(--text-color)',
        fontFamily: 'var(--font-sans)',
        direction: isRTL ? 'rtl' : 'ltr',
        alignItems: 'stretch'
      }}>
        <div style={{ 
          width: isMobile ? '100%' : '320px', minWidth: isMobile ? '100%' : '320px', 
          height: isMobile ? 'auto' : '100%',
          flexShrink: 0,
          borderRight: isMobile ? 'none' : (isRTL ? 'none' : '1px solid var(--text-color)'),
          borderLeft: isMobile ? 'none' : (isRTL ? '1px solid var(--text-color)' : 'none'),
          borderBottom: isMobile ? '1px solid var(--text-color)' : 'none',
          zIndex: 10,
          padding: isMobile ? '1.25rem 0.75rem 0.6rem 0.75rem' : '2rem',
          display: 'flex', flexDirection: 'column',
          gap: isMobile ? '0.5rem' : '1.25rem',
          overflowY: isMobile ? 'visible' : 'auto',
          background: 'transparent',
          textAlign: isRTL ? 'right' : 'left'
        }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <h2 style={{ fontSize: isMobile ? '1rem' : '1.25rem', margin: 0 }}>{t('bubbles.title')}</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <label style={{ fontSize: '0.75rem', opacity: 0.8, textTransform: 'uppercase' }}>{t('bubbles.text')}</label>
            <textarea name="text" value={state.text} onChange={handleChange} rows={2} dir="auto"
              style={{ width: '100%', padding: '0.5rem', background: 'transparent', color: 'var(--text-color)', border: '1px solid var(--text-color)', fontFamily: 'inherit', resize: 'vertical' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr', gap: isMobile ? '0.5rem' : '0.75rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
              <label style={{ fontSize: isMobile ? '0.65rem' : '0.75rem', opacity: 0.8, textTransform: 'uppercase' }}>{t('bubbles.font')}</label>
              <select value={family.family} onChange={handleFamilyChange} style={{ padding: isMobile ? '0.25rem' : '0.4rem', border: '1px solid var(--text-color)', background: 'transparent', color: 'var(--text-color)', fontFamily: 'inherit', fontSize: isMobile ? '0.7rem' : '0.8rem' }}>
                {FONTS_MAP.map(f => <option key={f.family} value={f.family}>{f.family}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
              <label style={{ fontSize: isMobile ? '0.65rem' : '0.75rem', opacity: 0.8, textTransform: 'uppercase' }}>{t('bubbles.style')}</label>
              <select value={style.name} onChange={handleStyleChange} style={{ padding: isMobile ? '0.25rem' : '0.4rem', border: '1px solid var(--text-color)', background: 'transparent', color: 'var(--text-color)', fontFamily: 'inherit', fontSize: isMobile ? '0.7rem' : '0.8rem' }}>
                {family.styles.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', border: '1px solid var(--text-color)', padding: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{t('bubbles.size')}</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
               <ControlSlider label="Min" name="minSize" min={0.1} max={2.0} step={0.1} />
               <ControlSlider label="Max" name="maxSize" min={0.5} max={5.0} step={0.1} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <ControlSlider label={t('bubbles.speed')} name="speed" min={0} max={3} step={0.1} />
            <ControlSlider label={t('bubbles.noise')} name="noise" min={0} max={1} step={0.01} />
            <ControlSlider label={t('bubbles.stickiness')} name="stickiness" min={0} max={1} step={0.01} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button 
                  onClick={() => setState(s => ({ ...s, mode: 'bw' }))}
                  style={{ 
                    flex: 1, padding: '0.6rem', 
                    background: state.mode === 'bw' ? 'var(--text-color)' : 'transparent',
                    color: state.mode === 'bw' ? 'var(--bg-color)' : 'var(--text-color)',
                    border: '1px solid var(--text-color)',
                    fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold',
                    fontFamily: 'Monoklass', textTransform: 'uppercase'
                  }}
                >
                  {t('bubbles.mode_bw')}
                </button>
                <button 
                  onClick={() => setState(s => ({ ...s, mode: 'color' }))}
                  style={{ 
                    flex: 1, padding: '0.6rem', 
                    background: state.mode === 'color' ? 'var(--text-color)' : 'transparent',
                    color: state.mode === 'color' ? 'var(--bg-color)' : 'var(--text-color)',
                    border: '1px solid var(--text-color)',
                    fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold',
                    fontFamily: 'Monoklass', textTransform: 'uppercase'
                  }}
                >
                  {t('bubbles.mode_color')}
                </button>
            </div>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'center' }}>
                <button 
                  onClick={() => setState(s => ({ ...s, theme: 'light' }))}
                  aria-label="Light mode"
                  style={{ 
                    width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--border-color)', 
                    background: '#F5F5F7', cursor: 'pointer', padding: 0,
                    transform: state.theme === 'light' ? 'scale(1.2)' : 'scale(1.0)',
                    borderWidth: state.theme === 'light' ? '2px' : '1px',
                    borderColor: state.theme === 'light' ? 'var(--text-color)' : 'var(--border-color)',
                    transition: 'transform 0.1s'
                  }}
                />
                <button 
                  onClick={() => setState(s => ({ ...s, theme: 'dark' }))}
                  aria-label="Dark mode"
                  style={{ 
                    width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--border-color)', 
                    background: '#121212', cursor: 'pointer', padding: 0,
                    transform: state.theme === 'dark' ? 'scale(1.2)' : 'scale(1.0)',
                    borderWidth: state.theme === 'dark' ? '2px' : '1px',
                    borderColor: state.theme === 'dark' ? 'var(--text-color)' : 'var(--border-color)',
                    transition: 'transform 0.1s'
                  }}
                />
            </div>
          </div>

          <div style={{ marginTop: isMobile ? '1rem' : 'auto', paddingTop: '1rem' }}>
            <button
              onClick={handleExportVideo}
              disabled={isRecording}
              className="nav-btn"
              style={{ 
                width: '100%',
                padding: '0.75rem',
                fontFamily: 'inherit',
                fontSize: '0.85rem', 
                cursor: isRecording ? 'not-allowed' : 'pointer',
                justifyContent: 'center', fontWeight: 'bold',
                opacity: isRecording ? 0.6 : 1,
                textAlign: 'center'
              }}
            >
              {isRecording ? `${t('bubbles.rendering')}... ${exportProgress}%` : t('bubbles.export')}
            </button>
          </div>
        </div>
        
        <div style={{ position: 'relative', flexGrow: 1, height: isMobile ? '0' : '100%', minHeight: isMobile ? '60vw' : 'unset', background: state.theme === 'dark' ? '#000' : '#fff', cursor: 'grab', direction: 'ltr', overflow: 'hidden' }}>
          <Suspense fallback={<div style={{display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: state.theme === 'dark' ? '#fff' : '#000'}}>{t('bubbles.booting')}</div>}>
            <BubblesCanvas ref={canvasRef} state={state} isRecording={isRecording} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
