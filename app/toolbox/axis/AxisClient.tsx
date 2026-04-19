"use client";

import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { FONTS_MAP } from '../../../utils/fontsMap';
import { parseFontAxes, registerFont, fetchFontAsBuffer, FontAxis } from '../../../utils/fontUtils';
import AxisCanvas, { AxisCanvasRef } from '../../../components/Axis/AxisCanvas';

export interface AxisState {
  text: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  colors: {
    fg: string;
    bg: string;
    shadow: string;
  };
  animation: {
    mode: 'linear' | 'staggered' | 'pulse';
    speed: number;
    activeAxes: string[]; // Which axes are currently animating
    axisOffsets: Record<string, number>; // Phase offset per axis (0 to 1)
  };
  canvas: {
    width: number;
    height: number;
    preset: string;
  };
}

const PRESETS = [
  { name: 'Instagram Post', w: 1080, h: 1350 },
  { name: 'Square', w: 1080, h: 1080 },
  { name: 'Stories', w: 1080, h: 1920 },
  { name: 'Landscape', w: 1920, h: 1080 },
];

export default function AxisClient() {
  const { t, lang } = useLanguage();
  const isRTL = lang === 'he';

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // -- State --
  const [state, setState] = useState<AxisState>({
    text: "Swing",
    fontFamily: 'StickyVariable',
    fontSize: 400,
    lineHeight: 1.1,
    letterSpacing: 0,
    colors: {
      fg: '#ff00ff',
      bg: '#23e7ac',
      shadow: '#ffffff'
    },
    animation: {
      mode: 'staggered',
      speed: 1.0,
      activeAxes: ['wght', 'ital'],
      axisOffsets: { wght: 0, ital: 0.25 }
    },
    canvas: {
      width: 1080,
      height: 1350,
      preset: 'Instagram Post'
    }
  });

  const [availableAxes, setAvailableAxes] = useState<FontAxis[]>([]);
  const [currentAxesValues, setCurrentAxesValues] = useState<Record<string, number>>({});
  const [fontBuffer, setFontBuffer] = useState<ArrayBuffer | null>(null); // passed to AxisCanvas for SVG font embedding
  const [isRecording, setIsRecording] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportBlob, setExportBlob] = useState<{ blob: Blob; extension: string } | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showSizePopup, setShowSizePopup] = useState(false);
  const [customSize, setCustomSize] = useState({ w: 1080, h: 1350 });
  const exportFilename = useRef('');
  const canvasRef = useRef<AxisCanvasRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // -- Font Loading --
  const loadFont = useCallback(async (buffer: ArrayBuffer | null, family: string) => {
    const axes = await parseFontAxes(buffer || new ArrayBuffer(0), family);
    setAvailableAxes(axes);
    
    // Set default values for axes
    const initials: Record<string, number> = {};
    axes.forEach(a => initials[a.tag] = a.defaultValue);
    setCurrentAxesValues(initials);
    
    // Set default offsets
    const offsets: Record<string, number> = {};
    axes.forEach((a, i) => offsets[a.tag] = i * 0.2);

    setState(prev => ({
      ...prev,
      fontFamily: family,
      animation: {
        ...prev.animation,
        activeAxes: axes.length > 0 ? (axes.some(a => a.tag === 'ital') ? ['wght', 'ital'] : [axes[0].tag]) : [],
        axisOffsets: { ...prev.animation.axisOffsets, ...offsets }
      }
    }));
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        await document.fonts.ready;
        const buffer = await fetchFontAsBuffer('/assets/fonts/Sticky-Variable.woff2');
        await registerFont('StickyVariable', buffer, {
          weight: '51 111',
          style: 'oblique -7deg 9deg',
        });
        setFontBuffer(buffer); // triggers AxisCanvas to encode buffer → base64 → embedded SVG font
        await loadFont(buffer, 'StickyVariable');
      } catch (err) {
        console.error('Failed to load default font:', err);
      }
    };
    init();
  }, [loadFont]);

  // -- Handlers --
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const buffer = await file.arrayBuffer();
    const family = `UserFont-${Date.now()}`;
    await registerFont(family, buffer);
    setFontBuffer(buffer); // triggers re-encode for user font
    await loadFont(buffer, family);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'range' || type === 'number' ? parseFloat(value) : value;

    if (name.startsWith('anim_')) {
      const field = name.replace('anim_', '');
      setState(prev => ({
        ...prev,
        animation: { ...prev.animation, [field]: val }
      }));
    } else if (name.startsWith('color_')) {
        const field = name.replace('color_', '');
        setState(prev => ({
          ...prev,
          colors: { ...prev.colors, [field]: value }
        }));
    } else {
      setState(prev => ({ ...prev, [name as keyof AxisState]: val }));
    }
  };

  const handleAxisToggle = (tag: string) => {
    setState(prev => {
      const active = prev.animation.activeAxes.includes(tag)
        ? prev.animation.activeAxes.filter(t => t !== tag)
        : [...prev.animation.activeAxes, tag];
      return { ...prev, animation: { ...prev.animation, activeAxes: active } };
    });
  };

  const handleOffsetChange = (tag: string, offset: number) => {
    setState(prev => ({
      ...prev,
      animation: {
        ...prev.animation,
        axisOffsets: { ...prev.animation.axisOffsets, [tag]: offset }
      }
    }));
  };

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const presetName = e.target.value;
    if (presetName === 'Custom') {
      setShowSizePopup(true);
      return;
    }
    const preset = PRESETS.find(p => p.name === presetName);
    if (preset) {
      setState(prev => ({
        ...prev,
        canvas: { ...prev.canvas, width: preset.w, height: preset.h, preset: preset.name }
      }));
    }
  };

  const handleCustomSizeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setState(prev => ({
      ...prev,
      canvas: { ...prev.canvas, width: customSize.w, height: customSize.h, preset: 'Custom' }
    }));
    setShowSizePopup(false);
  };

  const handleExport = async () => {
    if (isRecording) return;
    setIsRecording(true);
    setExportProgress(0);
    try {
      const data = await canvasRef.current?.exportVideo((p) => setExportProgress(p));
      if (data) {
        exportFilename.current = `axis_${Date.now()}.${data.extension}`;
        setExportBlob(data);
        setShowPopup(true);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to export video');
    } finally {
      setIsRecording(false);
    }
  };

  const handleDownload = () => {
    if (!exportBlob) return;
    const url = URL.createObjectURL(exportBlob.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = exportFilename.current;
    a.click();
    URL.revokeObjectURL(url);
  };

  // -- Helpers --
  interface ControlSliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (v: number) => void;
    active?: boolean;
    onToggle?: () => void;
  }

  const ControlSlider = ({ label, value, min, max, step, onChange, active, onToggle }: ControlSliderProps) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', opacity: active === false ? 0.5 : 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', textTransform: 'uppercase' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onToggle && (
            <input 
              type="checkbox" 
              checked={active} 
              onChange={() => onToggle()} 
              style={{ cursor: 'pointer', accentColor: 'var(--text-color)' }}
            />
          )}
          <label>{label}</label>
        </div>
        <span>{typeof value === 'number' ? value.toFixed(step >= 1 ? 0 : 2) : value}</span>
      </div>
      <input 
        type="range" min={min} max={max} step={step} value={value} 
        onChange={e => onChange(parseFloat(e.target.value))} 
        style={{ width: '100%', accentColor: 'var(--text-color)', cursor: 'pointer' }}
      />
    </div>
  );

  return (
    <div style={{
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row',
      height: '100%', width: '100%', background: 'transparent', color: 'var(--text-color)',
      fontFamily: 'var(--font-sans)',
      direction: isRTL ? 'rtl' : 'ltr',
    }}>
      {/* Settings Panel */}
      <div style={{
        width: isMobile ? '100%' : '340px',
        padding: '1.5rem',
        borderRight: isMobile ? 'none' : '1px solid var(--text-color)',
        borderBottom: isMobile ? '1px solid var(--text-color)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        overflowY: 'auto',
        zIndex: 10
      }}>
        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Variable</h2>

        {/* Text Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.75rem', opacity: 0.8, textTransform: 'uppercase' }}>{t('axis.text') || 'Text'}</label>
          <textarea
            name="text" value={state.text} onChange={handleChange} rows={2}
            style={{ width: '100%', padding: '0.5rem', background: 'transparent', color: 'var(--text-color)', border: '1px solid var(--text-color)', fontFamily: 'inherit', resize: 'vertical' }}
          />
        </div>

        {/* Font Uploader */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.75rem', opacity: 0.8, textTransform: 'uppercase' }}>{t('axis.font') || 'Font'}</label>
          <button className="nav-btn" onClick={() => fileInputRef.current?.click()} style={{ justifyContent: 'center' }}>
            {state.fontFamily === 'StickyVariable' ? 'Default: Sticky' : 'Custom Font loaded'}
          </button>
          <input ref={fileInputRef} type="file" accept=".ttf,.otf,.woff2" style={{ display: 'none' }} onChange={handleFileUpload} />
        </div>

        {/* Animation Mode */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.75rem', opacity: 0.8, textTransform: 'uppercase' }}>{t('axis.mode') || 'Animation Mode'}</label>
          <div style={{ display: 'flex', gap: '4px' }}>
            {['linear', 'staggered', 'pulse'].map(m => (
              <button
                key={m}
                className="nav-btn"
                onClick={() => setState(s => ({ ...s, animation: { ...s.animation, mode: m as any } }))}
                style={{
                  flex: 1,
                  padding: '0.5rem 0.2rem',
                  fontSize: '0.65rem',
                  display: 'flex',
                  justifyContent: 'center',
                  background: state.animation.mode === m ? 'var(--text-color)' : 'transparent',
                  color: state.animation.mode === m ? 'var(--bg-color)' : 'var(--text-color)',
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Global Sliders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.75rem', border: '1px solid var(--text-color)' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.6 }}>Typography & Timing</span>
          <ControlSlider label="Size" value={state.fontSize} min={20} max={600} step={1} onChange={(v: number) => setState(s => ({ ...s, fontSize: v }))} />
          <ControlSlider label="Leading" value={state.lineHeight} min={0.6} max={2.5} step={0.01} onChange={(v: number) => setState(s => ({ ...s, lineHeight: v }))} />
          <ControlSlider label="Speed" value={state.animation.speed} min={0} max={3} step={0.1} onChange={(v: number) => handleChange({ target: { name: 'anim_speed', value: v.toString(), type: 'number' } } as any)} />
        </div>

        {/* Axis toggles (checkboxes side by side) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.75rem', opacity: 0.8, textTransform: 'uppercase' }}>Axis</label>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
            {availableAxes.map(axis => (
              <div key={axis.tag} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <input
                  type="checkbox"
                  id={`axis-toggle-${axis.tag}`}
                  checked={state.animation.activeAxes.includes(axis.tag)}
                  onChange={() => handleAxisToggle(axis.tag)}
                  style={{ cursor: 'pointer', width: '14px', height: '14px', accentColor: 'var(--text-color)' }}
                />
                <label htmlFor={`axis-toggle-${axis.tag}`} style={{ fontSize: '0.8rem', textTransform: 'uppercase', cursor: 'pointer', userSelect: 'none' }}>
                  {axis.tag}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr', gap: isMobile ? '0.5rem' : '0.85rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <label style={{ fontSize: isMobile ? '0.65rem' : '0.75rem', opacity: 0.8, textTransform: 'uppercase' }}>{t('twister.color') || 'Foreground'}</label>
            <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <input type="color" name="color_fg" value={state.colors.fg} onChange={handleChange} style={{ width: '24px', height: '24px', padding: 0, border: 'none', cursor: 'pointer', backgroundColor: 'transparent', flexShrink: 0 }} />
              <input type="text" name="color_fg" value={state.colors.fg} onChange={handleChange} placeholder="#FFFFFF" style={{ flex: 1, minWidth: 0, padding: '0.2rem 0.3rem', background: 'transparent', color: 'var(--text-color)', border: '1px solid var(--text-color)', fontFamily: 'var(--font-mono)', fontSize: isMobile ? '0.65rem' : '0.8rem', direction: 'ltr' }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <label style={{ fontSize: isMobile ? '0.65rem' : '0.75rem', opacity: 0.8, textTransform: 'uppercase' }}>{t('twister.background') || 'Background'}</label>
            <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <input type="color" name="color_bg" value={state.colors.bg} onChange={handleChange} style={{ width: '24px', height: '24px', padding: 0, border: 'none', cursor: 'pointer', backgroundColor: 'transparent', flexShrink: 0 }} />
              <input type="text" name="color_bg" value={state.colors.bg} onChange={handleChange} placeholder="#F52F2F" style={{ flex: 1, minWidth: 0, padding: '0.2rem 0.3rem', background: 'transparent', color: 'var(--text-color)', border: '1px solid var(--text-color)', fontFamily: 'var(--font-mono)', fontSize: isMobile ? '0.65rem' : '0.8rem', direction: 'ltr' }} />
            </div>
          </div>
        </div>

        {/* Canvas Presets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.75rem', opacity: 0.8, textTransform: 'uppercase' }}>Canvas Size</label>
          <select value={state.canvas.preset} onChange={handlePresetChange} style={{ padding: '0.5rem', background: 'transparent', color: 'var(--text-color)', border: '1px solid var(--text-color)', fontFamily: 'inherit' }}>
            {PRESETS.map(p => <option key={p.name} value={p.name}>{p.name} ({p.w}x{p.h})</option>)}
            <option value="Custom">Custom...</option>
          </select>
        </div>

        {/* Export Button */}
        <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
          <button
            onClick={handleExport}
            disabled={isRecording}
            className="nav-btn"
            style={{ width: '100%', padding: '0.75rem', justifyContent: 'center', fontWeight: 'bold', opacity: isRecording ? 0.6 : 1 }}
          >
            {isRecording ? `Rendering... ${exportProgress}%` : t('axis.export') || 'Export Video'}
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div style={{
        flexGrow: 1,
        height: isMobile ? '50vh' : '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <AxisCanvas
          ref={canvasRef}
          state={state}
          availableAxes={availableAxes}
          fontBuffer={fontBuffer}
        />
      </div>

      {/* Popups */}
      {showPopup && exportBlob && (
        <div onClick={() => setShowPopup(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(18, 18, 18, 0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: 'var(--bg-color)', border: '1.5px solid var(--border-color)', padding: '2rem', maxWidth: '400px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', direction: isRTL ? 'rtl' : 'ltr' }}>
            <h3 style={{ margin: 0 }}>Export Ready</h3>
            <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>{exportFilename.current}</p>
            <button onClick={handleDownload} className="nav-btn" style={{ width: '100%', padding: '0.75rem', justifyContent: 'center', fontWeight: 'bold' }}>Download Video</button>
            <button onClick={() => setShowPopup(false)} className="nav-btn" style={{ width: '100%', padding: '0.75rem', justifyContent: 'center', opacity: 0.6 }}>Close</button>
          </div>
        </div>
      )}
      {showSizePopup && (
        <div onClick={() => setShowSizePopup(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(18, 18, 18, 0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: 'var(--bg-color)', border: '1.5px solid var(--border-color)', padding: '2rem', maxWidth: '400px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem', direction: isRTL ? 'rtl' : 'ltr' }}>
            <h3 style={{ margin: 0 }}>Custom Canvas Size</h3>
            <form onSubmit={handleCustomSizeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Width (px)</label>
                  <input type="number" value={customSize.w} onChange={e => setCustomSize(s => ({ ...s, w: parseInt(e.target.value) || 0 }))} style={{ padding: '0.5rem', background: 'transparent', color: 'var(--text-color)', border: '1px solid var(--text-color)', width: '100%' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Height (px)</label>
                  <input type="number" value={customSize.h} onChange={e => setCustomSize(s => ({ ...s, h: parseInt(e.target.value) || 0 }))} style={{ padding: '0.5rem', background: 'transparent', color: 'var(--text-color)', border: '1px solid var(--text-color)', width: '100%' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="submit" className="nav-btn" style={{ flex: 1, padding: '0.75rem', justifyContent: 'center', fontWeight: 'bold' }}>Apply</button>
                <button type="button" onClick={() => setShowSizePopup(false)} className="nav-btn" style={{ flex: 1, padding: '0.75rem', justifyContent: 'center', opacity: 0.6 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
