"use client";
import React, { useState, useRef, Suspense, useEffect } from 'react';
import MobiusRibbonCanvas, { MobiusRibbonCanvasRef } from '../../../components/MobiusRibbon/MobiusRibbonCanvas';
import { FONTS_MAP } from '../../../utils/fontsMap';
import { useLanguage } from '../../../context/LanguageContext';

export interface RibbonState {
  text: string;
  fontUrl: string;
  speed: number;
  intensity: number;
  hStack: number;
  vStack: number;
  stackDistance: number;
  textColor: string;
  bgColor: string;
}

export default function MobiusRibbonClient() {
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
  
  const [state, setState] = useState<RibbonState>({
    text: "Twister",
    fontUrl: initialStyle.url,
    speed: 1,
    intensity: 3,
    hStack: 1,
    vStack: 1,
    stackDistance: 0.05,
    textColor: "#ff0000",
    bgColor: "#2b00ff",
  });

  useEffect(() => {
    setState(prev => ({ ...prev, fontUrl: style.url }));
  }, [style]);

  const [isRecording, setIsRecording] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportBlob, setExportBlob] = useState<{ blob: Blob; extension: string } | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const exportFilename = useRef('');
  const canvasRef = useRef<MobiusRibbonCanvasRef>(null);

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
        exportFilename.current = `twister_${Date.now()}.${data.extension}`;
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
        const isMp4 = exportBlob.extension === 'mp4';
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: filename,
          types: [{
            description: isMp4 ? 'MP4 Video' : 'WebM Video',
            accept: isMp4
              ? { 'video/mp4': ['.mp4'] }
              : { 'video/webm': ['.webm'] }
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

  const ControlSlider = ({ label, name, min, max, step }: { label: string, name: keyof RibbonState, min: number, max: number, step: number }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: isMobile ? '0.65rem' : '0.75rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        <label htmlFor={name}>{label}</label>
        <span>{state[name]}</span>
      </div>
      <input type="range" id={name} name={name} min={min} max={max} step={step} value={state[name] as number} onChange={handleChange} style={{ width: '100%', accentColor: 'var(--text-color)', cursor: 'pointer', direction: 'ltr' }} />
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
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{t('twister.export')}</h2>
              <div style={{ borderTop: '1.5px solid var(--border-color)', paddingTop: '1rem', opacity: 0.7, fontSize: '0.85rem' }}>
                <p style={{ margin: 0 }}>{exportFilename.current}</p>
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
              {t('twister.save_video')}
            </button>
          </div>
        </div>
      )}

      <div style={{
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        height: '100%', width: '100%', background: 'transparent', color: 'var(--text-color)',
        fontFamily: 'var(--font-sans)',
        direction: isRTL ? 'rtl' : 'ltr'
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
          
          {isMobile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <h2 style={{ fontSize: '1rem', margin: 0 }}>{t('twister.title')}</h2>
              <input
                type="text"
                name="text"
                value={state.text}
                onChange={handleChange}
                dir="auto"
                style={{ width: '100%', padding: '0.3rem 0.5rem', background: 'transparent', color: 'var(--text-color)', border: '1px solid var(--text-color)', fontFamily: 'inherit', fontSize: '0.85rem', boxSizing: 'border-box' }}
              />
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '0.25rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0' }}>{t('twister.title')}</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <label style={{ fontSize: '0.75rem', opacity: 0.8, textTransform: 'uppercase' }}>{t('twister.text')}</label>
                <textarea name="text" value={state.text} onChange={handleChange} rows={2} dir="auto"
                  style={{ width: '100%', padding: '0.5rem', background: 'transparent', color: 'var(--text-color)', border: '1px solid var(--text-color)', fontFamily: 'inherit', resize: 'vertical' }} />
              </div>
            </>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr', gap: isMobile ? '0.5rem' : '0.75rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
              <label style={{ fontSize: isMobile ? '0.65rem' : '0.75rem', opacity: 0.8, textTransform: 'uppercase' }}>{t('twister.font')}</label>
              <select value={family.family} onChange={handleFamilyChange} style={{ padding: isMobile ? '0.25rem' : '0.4rem', border: '1px solid var(--text-color)', background: 'transparent', color: 'var(--text-color)', fontFamily: 'inherit', fontSize: isMobile ? '0.7rem' : '0.8rem' }}>
                {FONTS_MAP.map(f => <option key={f.family} value={f.family}>{f.family}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
              <label style={{ fontSize: isMobile ? '0.65rem' : '0.75rem', opacity: 0.8, textTransform: 'uppercase' }}>{t('twister.style')}</label>
              <select value={style.name} onChange={handleStyleChange} style={{ padding: isMobile ? '0.25rem' : '0.4rem', border: '1px solid var(--text-color)', background: 'transparent', color: 'var(--text-color)', fontFamily: 'inherit', fontSize: isMobile ? '0.7rem' : '0.8rem' }}>
                {family.styles.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
            </div>
          </div>

          {isMobile ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 0.75rem' }}>
              <ControlSlider label={t('twister.h_stack')} name="hStack" min={1} max={10} step={1} />
              <ControlSlider label={t('twister.v_stack')} name="vStack" min={1} max={10} step={1} />
              <ControlSlider label={t('twister.distance')} name="stackDistance" min={0.05} max={1.0} step={0.05} />
              <ControlSlider label={t('twister.intensity')} name="intensity" min={1} max={5} step={1} />
              <div style={{ gridColumn: '1 / -1' }}>
                <ControlSlider label={t('twister.rotation_speed')} name="speed" min={0} max={2} step={0.1} />
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', border: '1px solid var(--text-color)', padding: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{t('twister.array_density')}</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <ControlSlider label={t('twister.h_stack')} name="hStack" min={1} max={10} step={1} />
                  <ControlSlider label={t('twister.v_stack')} name="vStack" min={1} max={10} step={1} />
                </div>
                <ControlSlider label={t('twister.distance')} name="stackDistance" min={0.05} max={1.0} step={0.05} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <ControlSlider label={t('twister.intensity')} name="intensity" min={1} max={5} step={1} />
                <ControlSlider label={t('twister.rotation_speed')} name="speed" min={0} max={2} step={0.1} />
              </div>
            </>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr', gap: isMobile ? '0.5rem' : '0.75rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
              <label style={{ fontSize: isMobile ? '0.65rem' : '0.75rem', opacity: 0.8, textTransform: 'uppercase' }}>{t('twister.color')}</label>
              <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <input type="color" name="textColor" value={state.textColor} onChange={handleChange} style={{ width: '24px', height: '24px', padding: 0, border: 'none', cursor: 'pointer', backgroundColor: 'transparent', flexShrink: 0 }} />
                <input type="text" name="textColor" value={state.textColor} onChange={handleChange} placeholder="#000000" style={{ flex: 1, minWidth: 0, padding: '0.2rem 0.3rem', background: 'transparent', color: 'var(--text-color)', border: '1px solid var(--text-color)', fontFamily: 'var(--font-mono)', fontSize: isMobile ? '0.65rem' : '0.8rem', direction: 'ltr' }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
              <label style={{ fontSize: isMobile ? '0.65rem' : '0.75rem', opacity: 0.8, textTransform: 'uppercase' }}>{t('twister.background')}</label>
              <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <input type="color" name="bgColor" value={state.bgColor} onChange={handleChange} style={{ width: '24px', height: '24px', padding: 0, border: 'none', cursor: 'pointer', backgroundColor: 'transparent', flexShrink: 0 }} />
                <input type="text" name="bgColor" value={state.bgColor} onChange={handleChange} placeholder="#ffffff" style={{ flex: 1, minWidth: 0, padding: '0.2rem 0.3rem', background: 'transparent', color: 'var(--text-color)', border: '1px solid var(--text-color)', fontFamily: 'var(--font-mono)', fontSize: isMobile ? '0.65rem' : '0.8rem', direction: 'ltr' }} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: isMobile ? '0' : 'auto', paddingTop: isMobile ? '0' : '1rem' }}>
            <button
              onClick={handleExportVideo}
              disabled={isRecording}
              className="nav-btn"
              style={{ 
                width: '100%',
                padding: isMobile ? '0.4rem' : '0.75rem',
                fontFamily: 'inherit',
                fontSize: isMobile ? '0.75rem' : '0.85rem', 
                cursor: isRecording ? 'not-allowed' : 'pointer',
                justifyContent: 'center', fontWeight: 'bold',
                opacity: isRecording ? 0.6 : 1,
                textAlign: 'center'
              }}
            >
              {isRecording ? `${t('twister.rendering')}... ${exportProgress}%` : t('twister.export')}
            </button>
          </div>
        </div>
        
        <div style={{ position: 'relative', flexGrow: 1, height: isMobile ? '0' : '100%', minHeight: isMobile ? '60vw' : 'unset', background: state.bgColor, cursor: 'grab', direction: 'ltr' }}>
          <Suspense fallback={<div style={{display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#000'}}>{t('twister.booting')}</div>}>
            <MobiusRibbonCanvas ref={canvasRef} state={state} isRecording={isRecording} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
