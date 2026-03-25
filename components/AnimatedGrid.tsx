"use client";

import { useEffect, useRef } from "react";

// The draw loop reads window.__waveIntensity directly every frame.
// This avoids any React context propagation delays.
declare global {
  interface Window {
    __waveIntensity: number;
  }
}

// Reads current theme from data-theme attribute on <html>
export default function AnimatedGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Set a default if not yet set by the slider
  if (typeof window !== "undefined" && window.__waveIntensity === undefined) {
    window.__waveIntensity = 0;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (window.__waveIntensity === undefined) window.__waveIntensity = 0.3;

    let animationId: number;
    let time = 0;

    const CELL = 40;
    const MAX_AMP = 15;
    const MAX_SPEED = 0.004;
    const WAVE_FREQ = 0.018;

    const getIsDark = () =>
      document.documentElement.getAttribute("data-theme") === "dark";

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      const isDark = getIsDark();
      const intensity = window.__waveIntensity ?? 0;
      const amp = intensity * MAX_AMP;
      const speed = intensity * MAX_SPEED;

      ctx.clearRect(0, 0, W, H);

      // Fill background
      ctx.fillStyle = isDark ? "#0e0e0e" : "#f5f5f7";
      ctx.fillRect(0, 0, W, H);

      const lineColor = isDark
        ? "rgba(245, 245, 247, 0.08)"
        : "rgba(18, 18, 18, 0.12)";
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;

      // Vertical lines with wave
      for (let x = 0; x <= W + CELL; x += CELL) {
        ctx.beginPath();
        for (let y = 0; y <= H; y += 3) {
          const waveX =
            x +
            amp *
              Math.sin(y * WAVE_FREQ + time) *
              Math.cos(x * WAVE_FREQ * 0.5 + time * 0.7);
          if (y === 0) ctx.moveTo(waveX, y);
          else ctx.lineTo(waveX, y);
        }
        ctx.stroke();
      }

      // Horizontal lines with wave
      for (let y = 0; y <= H + CELL; y += CELL) {
        ctx.beginPath();
        for (let x = 0; x <= W; x += 3) {
          const waveY =
            y +
            amp *
              Math.sin(x * WAVE_FREQ + time * 1.1) *
              Math.cos(y * WAVE_FREQ * 0.5 + time * 0.8);
          if (x === 0) ctx.moveTo(x, waveY);
          else ctx.lineTo(x, waveY);
        }
        ctx.stroke();
      }

      time += speed;
      animationId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}
