"use client";
import React, { useRef, useEffect, useImperativeHandle, forwardRef, useMemo } from "react";
import { AxisState } from "../../app/toolbox/axis/AxisClient";
import { FontAxis } from "../../utils/fontUtils";
import { ExportData } from "../../utils/useVideoExport";
import { buildSVG, STICKY_FALLBACK_AXES, wrapText } from "./AxisUtils";

export interface AxisCanvasRef {
  exportVideo: (onProgress?: (p: number) => void) => Promise<ExportData>;
}

interface Props {
  state: AxisState;
  availableAxes: FontAxis[];
  fontBuffer: ArrayBuffer | null;
}

const MARGIN_FRACTION = 0.08;

const AxisCanvas = forwardRef<AxisCanvasRef, Props>(
  ({ state, availableAxes, fontBuffer }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);

    // Synchronize current state to refs so the async animation loop can read them safely
    const sRef = useRef(state);
    const availRef = useRef(availableAxes);
    sRef.current = state;
    availRef.current = availableAxes;

    const rafRef = useRef<number>(0);
    const startTsRef = useRef<number>(0);
    const fontDeclRef = useRef<string>("");

    // PERFORMANCE: Memoize wrapped text. Only re-calculate when text/size/width change.
    const wrappedLines = useMemo(() => {
      const { width } = state.canvas;
      const maxW = width * (1 - MARGIN_FRACTION * 2);
      return wrapText(state.text, maxW, state.fontSize);
    }, [state.text, state.fontSize, state.canvas.width]);

    // Encode ArrayBuffer → base64 string once per font load
    useEffect(() => {
      if (!fontBuffer || fontBuffer.byteLength === 0) return;

      const view = new Uint8Array(fontBuffer.slice(0, 4));
      const sig = Array.from(view).map(b => b.toString(16).padStart(2, "0")).join("");
      let mime = "font/truetype";
      if (sig === "774f4632") mime = "font/woff2";
      else if (sig === "774f4646") mime = "font/woff";

      const bytes = new Uint8Array(fontBuffer);
      const chunkSize = 8192;
      let binary = "";
      for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
      }
      const b64 = btoa(binary);

      // Maximally permissive descriptors for all variable font ranges
      fontDeclRef.current = `@font-face{font-family:'StickyVar';src:url(data:${mime};base64,${b64});font-weight:1 999;font-style:oblique -90deg 90deg;}`;
    }, [fontBuffer]);

    /**
     * Renders a single SVG frame to the provided canvas.
     * Uses a persistent Image object to minimize object creation overhead.
     */
    const renderFrame = async (canvas: HTMLCanvasElement, svgStr: string): Promise<void> => {
      return new Promise((resolve) => {
        if (!imgRef.current) imgRef.current = new Image();
        const img = imgRef.current;
        const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        img.onload = () => {
          const ctx = canvas.getContext("2d");
          if (ctx) ctx.drawImage(img, 0, 0);
          URL.revokeObjectURL(url);
          resolve();
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          resolve(); // Resolve silently to keep loop running
        };
        img.src = url;
      });
    };

    // Export Handler
    useImperativeHandle(ref, () => ({
      exportVideo: async (onProgress) => {
        const canvas = canvasRef.current;
        if (!canvas) throw new Error("Canvas not ready");

        const s = sRef.current;
        const axes = availRef.current.length > 0 ? availRef.current : STICKY_FALLBACK_AXES;
        const fontDecl = fontDeclRef.current;
        if (!fontDecl) throw new Error("Font not yet encoded — wait a moment");

        const FPS = 60;
        const FRAME_MS = 1000 / FPS;
        const cycleSec = (2 * Math.PI) / (s.animation.speed || 1);
        const totalFrames = Math.round(cycleSec * FPS);

        cancelAnimationFrame(rafRef.current);

        // Pre-warm the browser's font cache for this SVG
        await renderFrame(canvas, buildSVG(s, axes, 0, fontDecl, wrappedLines));

        const canvasAny = canvas as any;
        const stream = canvasAny.captureStream ? canvasAny.captureStream(0) : (canvas as any).mozCaptureStream?.(0);
        const videoTrack = stream.getVideoTracks()[0];

        const candidates = [
          { mime: 'video/mp4; codecs="avc1.42E01E"', ext: 'mp4' },
          { mime: 'video/mp4', ext: 'mp4' },
          { mime: 'video/webm; codecs=vp9', ext: 'webm' },
          { mime: 'video/webm', ext: 'webm' },
        ];
        const chosen = candidates.find(c => MediaRecorder.isTypeSupported(c.mime)) ?? candidates[3];
        
        const recorder = new MediaRecorder(stream, {
          mimeType: chosen.mime,
          videoBitsPerSecond: 25_000_000,
        });
        const chunks: Blob[] = [];
        recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
        recorder.start(200);

        for (let f = 0; f < totalFrames; f++) {
          const frameStart = performance.now();
          const timeSec = f / FPS;
          await renderFrame(canvas, buildSVG(s, axes, timeSec, fontDecl, wrappedLines));
          if (videoTrack && 'requestFrame' in videoTrack) (videoTrack as any).requestFrame();
          if (onProgress) onProgress(Math.round(((f + 1) / totalFrames) * 98));

          const elapsed = performance.now() - frameStart;
          const remaining = FRAME_MS - elapsed;
          if (remaining > 1) await new Promise(r => setTimeout(r, remaining));
        }

        const result = await new Promise<ExportData>((resolve, reject) => {
          recorder.onstop = () => {
            const blob = new Blob(chunks, { type: chosen.mime.split(';')[0] });
            resolve({ url: URL.createObjectURL(blob), blob, extension: chosen.ext });
          };
          recorder.onerror = e => reject(e);
          recorder.stop();
        });

        if (onProgress) onProgress(100);
        
        // Restart loop
        startTsRef.current = 0;
        rafRef.current = requestAnimationFrame(function loop(ts) {
          if (startTsRef.current === 0) startTsRef.current = ts;
          const decl = fontDeclRef.current;
          if (decl) {
            const timeSec = (ts - startTsRef.current) / 1000;
            const svg = buildSVG(sRef.current, availRef.current.length > 0 ? availRef.current : STICKY_FALLBACK_AXES, timeSec, decl, wrappedLines);
            renderFrame(canvas, svg);
          }
          rafRef.current = requestAnimationFrame(loop);
        });

        return result;
      },
    }));

    // Main Preview Loop
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      let active = true;

      const loop = (tsMs: number) => {
        if (!active) return;
        if (startTsRef.current === 0) startTsRef.current = tsMs;
        const timeSec = (tsMs - startTsRef.current) / 1000;

        const s = sRef.current;
        const axes = availRef.current.length > 0 ? availRef.current : STICKY_FALLBACK_AXES;
        const fontDecl = fontDeclRef.current;

        if (fontDecl) {
          const svg = buildSVG(s, axes, timeSec, fontDecl, wrappedLines);
          renderFrame(canvas, svg);
        } else {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.fillStyle = s.colors.bg;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
        }

        if (active) rafRef.current = requestAnimationFrame(loop);
      };

      rafRef.current = requestAnimationFrame(loop);
      return () => {
        active = false;
        cancelAnimationFrame(rafRef.current);
      };
    }, [wrappedLines]); // Re-start loop if wrapping changes

    // Handle Scaling & Resizing
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = state.canvas.width;
      canvas.height = state.canvas.height;
      
      const parent = canvas.parentElement;
      if (!parent) return;

      const rescale = () => {
        const scale = Math.min((parent.clientWidth - 40) / canvas.width, (parent.clientHeight - 40) / canvas.height, 1);
        canvas.style.transform = `scale(${scale})`;
        canvas.style.transformOrigin = "center";
      };

      rescale();
      const ro = new ResizeObserver(rescale);
      ro.observe(parent);
      return () => ro.disconnect();
    }, [state.canvas.width, state.canvas.height]);

    return <canvas ref={canvasRef} style={{ display: "block" }} />;
  }
);

AxisCanvas.displayName = "AxisCanvas";
export default AxisCanvas;
