"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../../../context/LanguageContext';

interface MosaicState {
  speed: number;    // 0–3
  offset: number;   // 1–50 px
  tileSize: number; // 2–100 px
}

interface TileInfo {
  x: number;
  y: number;
  data: number[][]; // [quadrant][r,g,b]
}

export default function MosaicClient() {
  const { t, lang } = useLanguage();
  const isRTL = lang === 'he';

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── State ──────────────────────────────────────────────────────────────────
  const [state, setState] = useState<MosaicState>({
    speed: 1.5,
    offset: 25,
    tileSize: 50,
  });
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  // ── Image sources ──────────────────────────────────────────────────────────
  const [img1Src, setImg1Src] = useState('/images/toolbox/mosaic/dst.jpg');
  const [img2Src, setImg2Src] = useState('/images/toolbox/mosaic/src.jpg');
  const [img1Name, setImg1Name] = useState('');
  const [img2Name, setImg2Name] = useState('');

  const [img1, setImg1] = useState<HTMLImageElement | null>(null);
  const [img2, setImg2] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const i1 = new window.Image();
    i1.crossOrigin = 'anonymous';
    i1.src = img1Src;
    i1.onload = () => setImg1(i1);
    i1.onerror = (err) => console.error('Failed to load Image 1:', img1Src, err);
  }, [img1Src]);

  useEffect(() => {
    const i2 = new window.Image();
    i2.crossOrigin = 'anonymous';
    i2.src = img2Src;
    i2.onload = () => setImg2(i2);
    i2.onerror = (err) => console.error('Failed to load Image 2:', img2Src, err);
  }, [img2Src]);

  // ── Mosaic Mapping Logic ───────────────────────────────────────────────────
  const [mapping, setMapping] = useState<number[][]>([]);
  const [targetColors, setTargetColors] = useState<string[][]>([]);
  const [sourceTiles, setSourceTiles] = useState<TileInfo[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!img1 || !img2) return;

    const computeMapping = () => {
      setIsProcessing(true);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const { tileSize } = state;

      const getStructuralData = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
        const data = c.getImageData(x, y, w, h).data;
        const midX = Math.floor(w / 2);
        const midY = Math.floor(h / 2);
        const getAvg = (qx1: number, qy1: number, qx2: number, qy2: number) => {
          let r = 0, g = 0, b = 0, count = 0;
          for (let i = qy1; i < qy2; i++) {
            for (let j = qx1; j < qx2; j++) {
              const idx = (i * w + j) * 4;
              r += data[idx];
              g += data[idx + 1];
              b += data[idx + 2];
              count++;
            }
          }
          return count > 0 ? [r / count, g / count, b / count] : [0, 0, 0];
        };
        return [
          getAvg(0, 0, midX, midY), getAvg(midX, 0, w, midY),
          getAvg(0, midY, midX, h), getAvg(midX, midY, w, h)
        ];
      };

      const targetW = img2.naturalWidth;
      const targetH = img2.naturalHeight;
      const tCols = Math.ceil(targetW / tileSize);
      const tRows = Math.ceil(targetH / tileSize);

      if (tCols * tRows > 250000) {
        console.warn('Grid too large, capping');
        setIsProcessing(false);
        return;
      }

      canvas.width = img1.naturalWidth;
      canvas.height = img1.naturalHeight;
      ctx.drawImage(img1, 0, 0);
      const sCols = Math.floor(canvas.width / tileSize);
      const sRows = Math.floor(canvas.height / tileSize);
      const tiles: TileInfo[] = [];
      for (let r = 0; r < sRows; r++) {
        for (let c = 0; c < sCols; c++) {
          const x = c * tileSize; const y = r * tileSize;
          tiles.push({ x, y, data: getStructuralData(ctx, x, y, tileSize, tileSize) });
        }
      }
      setSourceTiles(tiles);

      canvas.width = targetW;
      canvas.height = targetH;
      ctx.drawImage(img2, 0, 0, targetW, targetH);
      const newMapping: number[][] = [];
      const newTargetColors: string[][] = [];

      for (let r = 0; r < tRows; r++) {
        const rowMapping: number[] = [];
        const rowColors: string[] = [];
        for (let c = 0; c < tCols; c++) {
          const x = c * tileSize; const y = r * tileSize;
          const sw = Math.min(tileSize, targetW - x);
          const sh = Math.min(tileSize, targetH - y);
          if (sw <= 0 || sh <= 0) { rowMapping.push(0); continue; }
          const targetData = getStructuralData(ctx, x, y, sw, sh);
          let tr = 0, tg = 0, tb = 0;
          for (let q = 0; q < 4; q++) {
            tr += targetData[q][0]; tg += targetData[q][1]; tb += targetData[q][2];
          }
          rowColors.push(`rgb(${Math.round(tr/4)}, ${Math.round(tg/4)}, ${Math.round(tb/4)})`);
          let bestIdx = 0; let minDist = Infinity;
          for (let i = 0; i < tiles.length; i++) {
            const tile = tiles[i]; let dist = 0;
            for (let q = 0; q < 4; q++) {
              const dr = targetData[q][0] - tile.data[q][0];
              const dg = targetData[q][1] - tile.data[q][1];
              const db = targetData[q][2] - tile.data[q][2];
              dist += dr * dr + dg * dg + db * db;
            }
            if (dist < minDist) { minDist = dist; bestIdx = i; }
          }
          rowMapping.push(bestIdx);
        }
        newMapping.push(rowMapping);
        newTargetColors.push(rowColors);
      }
      setMapping(newMapping);
      setTargetColors(newTargetColors);
      setIsProcessing(false);
    };

    const timer = setTimeout(computeMapping, 300);
    return () => clearTimeout(timer);
  }, [img1, img2, state.tileSize]);

  // ── Canvas & animation ─────────────────────────────────────────────────────
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);
  const lastTimestampRef = useRef<number | null>(null);

  const drawMosaic = useCallback((
    ctx: CanvasRenderingContext2D, 
    W: number, H: number, 
    t: number, 
    speed: number, offset: number, tileSize: number
  ) => {
    ctx.clearRect(0, 0, W, H);
    if (!img1 || mapping.length === 0 || targetColors.length === 0 || sourceTiles.length === 0 || W === 0 || H === 0) return;

    const tRows = mapping.length;
    const tCols = mapping[0].length;
    const drawScale = W / (tCols * tileSize);
    const scaledTileSize = tileSize * drawScale;

    for (let r = 0; r < tRows; r++) {
      for (let c = 0; c < tCols; c++) {
        const tileIdx = mapping[r][c];
        const s = sourceTiles[tileIdx];
        if (!s) continue;
        const x = c * scaledTileSize;
        const y = r * scaledTileSize;
        const phase = t * speed + c * 0.35 + r * 0.25;
        const dx = Math.sin(phase) * offset;
        const dy = Math.cos(phase + 1.1) * offset;
        const bgColor = targetColors[r]?.[c] || '#000';
        ctx.fillStyle = bgColor;
        ctx.fillRect(x, y, scaledTileSize, scaledTileSize);
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, scaledTileSize, scaledTileSize);
        ctx.clip();
        ctx.drawImage(img1, s.x, s.y, tileSize, tileSize, x + dx, y + dy, scaledTileSize, scaledTileSize);
        ctx.restore();
      }
    }
  }, [img1, mapping, targetColors, sourceTiles]);

  const animate = useCallback((timestamp: number) => {
    if (lastTimestampRef.current === null) lastTimestampRef.current = timestamp;
    const dt = Math.min((timestamp - lastTimestampRef.current) / 1000, 0.1);
    lastTimestampRef.current = timestamp;
    timeRef.current += dt;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      rafRef.current = requestAnimationFrame(animate);
      return;
    }

    const { speed, offset, tileSize } = stateRef.current;
    drawMosaic(ctx, canvas.width, canvas.height, timeRef.current, speed, offset, tileSize);
    rafRef.current = requestAnimationFrame(animate);
  }, [drawMosaic]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container || mapping.length === 0) return;
      const tRows = mapping.length;
      const tCols = mapping[0].length;
      const aspectRatio = tCols / tRows;
      const containerW = container.clientWidth;
      const containerH = container.clientHeight;
      let newW = containerW;
      let newH = containerW / aspectRatio;
      if (newH > containerH) { newH = containerH; newW = containerH * aspectRatio; }
      const dpr = window.devicePixelRatio || 1;
      canvas.width = newW * dpr;
      canvas.height = newH * dpr;
      canvas.style.width = `${newW}px`;
      canvas.style.height = `${newH}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [mapping]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const fileInput1Ref = useRef<HTMLInputElement>(null);
  const fileInput2Ref = useRef<HTMLInputElement>(null);

  const handleFile1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImg1Src(URL.createObjectURL(file));
    setImg1Name(file.name);
    e.target.value = '';
  };

  const handleFile2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImg2Src(URL.createObjectURL(file));
    setImg2Name(file.name);
    e.target.value = '';
  };

  const [isRecording, setIsRecording] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportBlob, setExportBlob] = useState<{ blob: Blob; extension: string } | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const exportFilename = useRef('');

  const handleExportVideo = async () => {
    if (isRecording || !img2 || mapping.length === 0) return;
    // Cap the export resolution for stability. Browsers often fail MediaRecorder at very high resolutions.
    const maxDimension = 2048;
      let exportW = img2.naturalWidth;
    let exportH = img2.naturalHeight;
    if (exportW > maxDimension || exportH > maxDimension) {
      const scale = maxDimension / Math.max(exportW, exportH);
      exportW = Math.round(exportW * scale);
      exportH = Math.round(exportH * scale);
    }

    const { speed, offset, tileSize } = state;
    setIsRecording(true);
    setExportProgress(0);
    setExportBlob(null);
    setShowPopup(false);

    try {
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = exportW;
      exportCanvas.height = exportH;
      exportCanvas.style.position = 'fixed';
      exportCanvas.style.left = '-10000px';
      exportCanvas.style.top = '0';
      document.body.appendChild(exportCanvas);

      const exportCtx = exportCanvas.getContext('2d', { alpha: false });
      if (!exportCtx) throw new Error('Context fail');

      const fps = 30;
      let actualDurationSec = 4;
      let exportSpeed = speed;

      if (speed > 0) {
        const period = (2 * Math.PI) / speed;
        const numPeriods = Math.max(1, Math.ceil(4 / period));
        const idealDuration = numPeriods * period;
        const totalFrames = Math.round(idealDuration * fps);
        actualDurationSec = totalFrames / fps;
        exportSpeed = (numPeriods * 2 * Math.PI) / actualDurationSec;
      }

      drawMosaic(exportCtx, exportW, exportH, 0, exportSpeed, offset, tileSize);

      const stream = (exportCanvas as any).captureStream(30) as MediaStream;
      const mimeTypes = [
        'video/mp4; codecs="avc1.42E01E"',
        'video/mp4',
        'video/webm;codecs=vp9', 
        'video/webm'
      ];
      const mimeType = mimeTypes.find(m => MediaRecorder.isTypeSupported(m)) ?? 'video/webm';
      const extension = mimeType.includes('mp4') ? 'mp4' : 'webm';

      console.log('Mosaic: Starting export', { mimeType, exportW, exportH });

      const recorder = new MediaRecorder(stream, { 
        mimeType,
        videoBitsPerSecond: 8000000 
      });
      
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

      recorder.onstop = () => {
        if (document.body.contains(exportCanvas)) document.body.removeChild(exportCanvas);
        const blob = new Blob(chunks, { type: mimeType });
        console.log('Mosaic: Export finished', { totalSize: blob.size, chunks: chunks.length });

        if (blob.size === 0) {
          alert('Export failed: 0 bytes recorded.');
          setIsRecording(false);
          return;
        }

        exportFilename.current = `mosaic_${Date.now()}.${extension}`;
        setExportBlob({ blob, extension });
        setShowPopup(true);
        setIsRecording(false);
        setExportProgress(0);
      };

      recorder.start(1000); 

      const totalFrames = Math.round(actualDurationSec * fps);
      let processedFrames = 0;

      const recordFrame = () => {
        try {
          if (processedFrames >= totalFrames) {
            setExportProgress(100);
            setTimeout(() => recorder.stop(), 500);
            return;
          }
          drawMosaic(exportCtx, exportW, exportH, processedFrames * (1/fps), exportSpeed, offset, tileSize);
          processedFrames++;
          setExportProgress(Math.min(Math.round((processedFrames / totalFrames) * 100), 99));
          requestAnimationFrame(recordFrame);
        } catch (err) {
          console.error('Mosaic: recordFrame loop error', err);
          recorder.stop();
        }
      };
      
      recordFrame();
    } catch (err) {
      console.error('Mosaic: Export Error', err);
      alert('Failed to export video');
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
            description: isMp4 ? 'MP4' : 'WebM',
            accept: isMp4 ? { 'video/mp4': ['.mp4'] } : { 'video/webm': ['.webm'] }
          }]
        });
        const writable = await handle.createWritable();
        await writable.write(exportBlob.blob);
        await writable.close();
        return;
      } catch (e) {}
    }
    const url = URL.createObjectURL(exportBlob.blob);
    const a = document.createElement('a'); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const ControlSlider = ({ label, name, min, max, step }: any) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.8, textTransform: 'uppercase' }}>
        <label htmlFor={name}>{label}</label>
        <span>{state[name as keyof MosaicState]}</span>
      </div>
      <input
        type="range" id={name} name={name} min={min} max={max} step={step}
        value={state[name as keyof MosaicState]} onChange={handleChange}
        style={{ width: '100%', accentColor: 'var(--text-color)', cursor: 'pointer' }}
      />
    </div>
  );

  return (
    <>
      {showPopup && exportBlob && (
        <div onClick={() => setShowPopup(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(18, 18, 18, 0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: 'var(--bg-color)', border: '1.5px solid var(--border-color)', padding: '2.5rem', maxWidth: '480px', width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '1.5rem', direction: isRTL ? 'rtl' : 'ltr' }}>
            <button onClick={() => setShowPopup(false)} style={{ position: 'absolute', top: '1rem', [isRTL ? 'left' : 'right']: '1rem', background: 'transparent', border: 'none', color: 'var(--text-color)', cursor: 'pointer' }}>✕</button>
            <h2 style={{ fontSize: '1.5rem' }}>{t('mosaic.export')}</h2>
            <p>{exportFilename.current}</p>
            <button onClick={handleDownloadFile} className="nav-btn" style={{ width: '100%', padding: '0.75rem', fontWeight: 'bold' }}>{t('mosaic.save_video')}</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', flex: 1, height: '100%', direction: isRTL ? 'rtl' : 'ltr' }}>
        <div style={{
          width: isMobile ? '100%' : '320px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem',
          borderRight: isMobile ? 'none' : (isRTL ? 'none' : '1px solid var(--text-color)'),
          borderLeft: isMobile ? 'none' : (isRTL ? '1px solid var(--text-color)' : 'none'),
          borderBottom: isMobile ? '1px solid var(--text-color)' : 'none'
        }}>
          <h2>{t('mosaic.title')}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <label style={{ fontSize: '0.75rem' }}>{t('mosaic.source1')}</label>
            <button className="nav-btn" onClick={() => fileInput1Ref.current?.click()}>{img1Name || 'dst.jpg'}</button>
            <input ref={fileInput1Ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile1} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <label style={{ fontSize: '0.75rem' }}>{t('mosaic.source2')}</label>
            <button className="nav-btn" onClick={() => fileInput2Ref.current?.click()}>{img2Name || 'src.jpg'}</button>
            <input ref={fileInput2Ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile2} />
          </div>
          <ControlSlider label={t('mosaic.speed')} name="speed" min={0} max={3} step={0.1} />
          <ControlSlider label={t('mosaic.offset')} name="offset" min={1} max={50} step={1} />
          <ControlSlider label={t('mosaic.tile_size')} name="tileSize" min={2} max={100} step={1} />
          {isProcessing && <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{t('mosaic.rendering')}</div>}
          <div style={{ marginTop: 'auto' }}>
            <button onClick={handleExportVideo} disabled={isRecording || isProcessing} className="nav-btn" style={{ width: '100%', padding: '0.75rem', fontWeight: 'bold' }}>
              {isRecording ? `${t('mosaic.rendering')}... ${exportProgress}%` : t('mosaic.export')}
            </button>
          </div>
        </div>
        <div ref={containerRef} style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', overflow: 'hidden' }}>
          <canvas ref={canvasRef} style={{ display: 'block' }} />
        </div>
      </div>
    </>
  );
}
