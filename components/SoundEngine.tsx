"use client";

import { useEffect, useRef, useState } from "react";

// Shared AudioContext — created once on first interaction
let sharedCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!sharedCtx || sharedCtx.state === "closed") {
    sharedCtx = new AudioContext();
  }
  return sharedCtx;
}

// Play a single typewriter click
function playClick(ctx: AudioContext, master: GainNode) {
  const now = ctx.currentTime;

  // ── Transient click body ─────────────────────────────────────────────
  const dur = 0.005 + Math.random() * 0.007; // 5–12 ms
  const bufLen = Math.ceil(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) {
    // Exponential decay envelope
    const env = Math.pow(1 - i / bufLen, 2.5);
    data[i] = (Math.random() * 2 - 1) * env;
  }

  const src = ctx.createBufferSource();
  src.buffer = buf;

  // Highpass filter for that crisp "type" quality
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 2200 + Math.random() * 1600; // 2.2–3.8 kHz

  // Peak filter — adds character like a metal type bar
  const peak = ctx.createBiquadFilter();
  peak.type = "peaking";
  peak.frequency.value = 1200 + Math.random() * 800;
  peak.gain.value = 4;
  peak.Q.value = 1.2;

  const gain = ctx.createGain();
  // Subtle velocity variation
  gain.gain.value = 0.22 + Math.random() * 0.18;

  src.connect(hp);
  hp.connect(peak);
  peak.connect(gain);
  gain.connect(master);
  src.start(now);

  // ── Very short low-end thump underneath (key mechanism) ─────────────
  const thumpLen = Math.ceil(ctx.sampleRate * 0.02);
  const thumpBuf = ctx.createBuffer(1, thumpLen, ctx.sampleRate);
  const td = thumpBuf.getChannelData(0);
  for (let i = 0; i < thumpLen; i++) {
    td[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / thumpLen, 3);
  }
  const thumpSrc = ctx.createBufferSource();
  thumpSrc.buffer = thumpBuf;

  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 280;

  const thumpGain = ctx.createGain();
  thumpGain.gain.value = 0.12;

  thumpSrc.connect(lp);
  lp.connect(thumpGain);
  thumpGain.connect(master);
  thumpSrc.start(now);
}

export default function SoundEngine() {
  // ON by default
  const [active, setActive] = useState(true);
  const masterRef = useRef<GainNode | null>(null);
  const activeRef = useRef(true); // ref so the keydown handler always sees current value

  // Create / destroy master gain when active state changes
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!activeRef.current) return;

      // Only fire on printable chars + space + backspace in textareas/inputs
      const target = e.target as HTMLElement;
      const isTypingField =
        target.tagName === "TEXTAREA" ||
        target.tagName === "INPUT" ||
        target.isContentEditable;

      if (!isTypingField) return;

      // Ignore modifier-only presses, arrows, function keys, etc.
      const ignore = ["Shift", "Control", "Alt", "Meta", "CapsLock", "Tab",
        "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
        "Home", "End", "PageUp", "PageDown", "Insert", "Delete",
        "Escape", "F1", "F2", "F3", "F4", "F5", "F6",
        "F7", "F8", "F9", "F10", "F11", "F12"];
      if (ignore.includes(e.key)) return;

      try {
        const ctx = getCtx();
        if (ctx.state === "suspended") ctx.resume();

        // Reuse master or rebuild if context changed
        if (!masterRef.current || masterRef.current.context !== ctx) {
          const m = ctx.createGain();
          m.gain.value = 0.9;
          m.connect(ctx.destination);
          masterRef.current = m;
        }

        playClick(ctx, masterRef.current);
      } catch {
        // Silently ignore any audio errors
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, []);


  const toggle = () => setActive((v) => !v);

  return (
    <button
      onClick={toggle}
      className={`sound-btn${active ? " sound-btn--on" : ""}`}
      aria-label={active ? "Mute typing sounds" : "Enable typing sounds"}
      title={active ? "Typing sounds on" : "Typing sounds off"}
    >
      {active ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <line x1="23" y1="9" x2="17" y2="15"/>
          <line x1="17" y1="9" x2="23" y2="15"/>
        </svg>
      )}
    </button>
  );
}
