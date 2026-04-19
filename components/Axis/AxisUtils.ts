import { AxisState } from "../../app/toolbox/axis/AxisClient";
import { FontAxis } from "../../utils/fontUtils";

export const STICKY_FALLBACK_AXES: FontAxis[] = [
  { tag: "wght", name: "Weight", minValue: 51, defaultValue: 80, maxValue: 111 },
  { tag: "ital", name: "Italic", minValue: -7, defaultValue: 0, maxValue: 9 },
];

const MARGIN_FRACTION = 0.08;
const CHAR_DELAY = 0.08;

/**
 * Escapes characters for inclusion in XML/SVG tags.
 */
export function escXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Simple word-wrapping logic for a given pixel width and font size.
 */
export function wrapText(text: string, maxPx: number, fontSize: number): string[] {
  const avgW = fontSize * 0.52; // Approximate width factor for StickyVariable
  const result: string[] = [];
  
  for (const para of text.split("\n")) {
    const words = para.split(" ");
    let line = "";
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (test.length * avgW > maxPx && line) {
        result.push(line);
        line = w;
      } else {
        line = test;
      }
    }
    if (line) result.push(line);
  }
  return result;
}

/**
 * Calculates a specific axis value at a given time and character index.
 */
export function getVal(
  tag: string,
  charIdx: number,
  axes: FontAxis[],
  s: AxisState,
  timeSec: number
): number {
  const axis = axes.find((a) => a.tag === tag);
  if (!axis) return 0;
  
  // If the axis isn't being animated, return its default value.
  if (!s.animation.activeAxes.includes(tag)) return axis.defaultValue;
  
  const phaseOffset = (s.animation.axisOffsets[tag] ?? 0) * 2 * Math.PI;
  let t = timeSec * s.animation.speed + phaseOffset;
  
  if (s.animation.mode === "staggered" || s.animation.mode === "pulse") {
    // Note the * 2 here — we want enough stagger visible across short words.
    t -= charIdx * CHAR_DELAY * s.animation.speed * 2;
  }
  
  const step = (Math.cos(t) + 1) / 2;
  return axis.minValue + step * (axis.maxValue - axis.minValue);
}

/**
 * Builds the SVG string representing a single frame of the animation.
 * This SVG is self-contained with its own @font-face data URL.
 */
export function buildSVG(
  s: AxisState,
  axes: FontAxis[],
  timeSec: number,
  fontDecl: string,
  lines: string[]
): string {
  const { width, height } = s.canvas;
  const lineH = s.fontSize * s.lineHeight;
  const totalH = lines.length * lineH;
  const startY = (height - totalH) / 2;
  const cx = width / 2;

  let els = "";

  lines.forEach((line, li) => {
    // Vertical centering logic within the text block
    const baseY = (startY + li * lineH + s.fontSize * 0.78).toFixed(1);

    if (s.animation.mode === "staggered" || s.animation.mode === "pulse") {
      const chars = line.split("");
      let tspans = "";
      chars.forEach((ch, ci) => {
        const gi = li * 200 + ci; // Global character index
        
        // Dynamically build fvs from ALL axes
        const fvs = axes
          .map(axis => `'${axis.tag}' ${getVal(axis.tag, gi, axes, s, timeSec).toFixed(2)}`)
          .join(',');
          
        let sz = s.fontSize;
        if (s.animation.mode === "pulse") {
          const pCos = (Math.cos(timeSec * s.animation.speed - gi * CHAR_DELAY * s.animation.speed) + 1) / 2;
          sz *= 1 + pCos * 0.2;
        }
        
        const style = `font-size:${sz.toFixed(1)}px;font-variation-settings:${fvs};font-feature-settings:'calt' 1,'liga' 1`;
        tspans += `<tspan style="${style}">${escXml(ch)}</tspan>`;
      });
      els += `<text x="${cx}" y="${baseY}" text-anchor="middle" font-family="StickyVar, sans-serif" font-size="${s.fontSize}" fill="${s.colors.fg}">${tspans}</text>`;
    } else {
      // Linear (Standard) Mode: Whole line animates together
      const fvs = axes
        .map(axis => `'${axis.tag}' ${getVal(axis.tag, 0, axes, s, timeSec).toFixed(2)}`)
        .join(',');
      const style = `font-variation-settings:${fvs};font-feature-settings:'calt' 1,'liga' 1`;
      els += `<text x="${cx}" y="${baseY}" text-anchor="middle" font-family="StickyVar, sans-serif" font-size="${s.fontSize}" fill="${s.colors.fg}" style="${style}">${escXml(line)}</text>`;
    }
  });

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
    `<defs><style>${fontDecl}</style></defs>` +
    `<rect width="${width}" height="${height}" fill="${s.colors.bg}"/>` +
    els +
    `</svg>`
  );
}
