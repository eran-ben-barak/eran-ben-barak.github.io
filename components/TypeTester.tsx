"use client";

import { useState } from "react";
import styles from "./TypeTester.module.css";

type WeightEntry = { weight: number; label: string; italic?: boolean };

interface TypeTesterProps {
  fontFamily: string;
  defaultText: string;
  isVariable?: boolean;
  weights?: WeightEntry[];
  initialSize?: number;
  initialWeight?: number;
  initialItalic?: boolean;
  initialLineHeight?: number;
  hasSwash?: boolean;
  variableAxes?: { axis: string; min: number; max: number; default: number }[];
  initialAxesStates?: Record<string, number>;
}

export default function TypeTester({ 
  fontFamily, 
  defaultText, 
  isVariable = false, 
  weights = [],
  initialSize = 90,
  initialWeight,
  initialItalic = false,
  initialLineHeight = 1.0,
  hasSwash = false,
  variableAxes = [],
  initialAxesStates
}: TypeTesterProps) {
  const [text, setText] = useState(defaultText);
  const [size, setSize] = useState(initialSize);
  const [weight, setWeight] = useState(initialWeight ?? (weights.length > 0 ? weights[0].weight : 400));
  const [lineHeight, setLineHeight] = useState(initialLineHeight);
  const [isItalic, setIsItalic] = useState(initialItalic);
  const [swashEnabled, setSwashEnabled] = useState(false);

  // States for all variable axes
  const [axesStates, setAxesStates] = useState<Record<string, number>>(() => {
    if (initialAxesStates) return initialAxesStates;
    const initial: Record<string, number> = {};
    variableAxes.forEach(ax => {
      initial[ax.axis] = ax.default;
    });
    // Special handling for initial weight if it matches a variable axis
    // Use the weight already determined above.
    if (variableAxes.some(ax => ax.axis === "wght")) {
      initial["wght"] = weight;
    }
    return initial;
  });

  const handleAxisChange = (axis: string, value: number) => {
    setAxesStates(prev => ({ ...prev, [axis]: value }));
    if (axis === "wght") setWeight(value);
  };

  const variationSettings = isVariable 
    ? Object.entries(axesStates).map(([axis, val]) => `"${axis}" ${val}`).join(", ")
    : undefined;

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        {!isVariable && weights.length > 1 && (
          <label className={styles.label}>
            <select 
              className={styles.select}
              value={weights.findIndex(w => w.weight === weight && !!w.italic === isItalic)}
              onChange={(e) => {
                const idx = Number(e.target.value);
                setWeight(weights[idx].weight);
                setIsItalic(!!weights[idx].italic);
              }}
            >
              {weights.map((w, i) => (
                <option key={i} value={i}>{w.label}</option>
              ))}
            </select>
          </label>
        )}

        {isVariable && variableAxes.map(ax => {
          const axisName = ax.axis === "wght" ? "Weight" : (ax.axis === "ital" ? "Italic" : ax.axis.toUpperCase());
          return (
            <label key={ax.axis} className={styles.label}>
              <span>{axisName} <b>{axesStates[ax.axis]}</b></span>
              <input 
                className={styles.slider} 
                type="range" 
                min={ax.min} 
                max={ax.max} 
                step={ax.max <= 1 ? "0.01" : "1"}
                value={axesStates[ax.axis]} 
                onChange={(e) => handleAxisChange(ax.axis, Number(e.target.value))} 
              />
            </label>
          );
        })}

        <label className={styles.label}>
          <span>Size <b>{size}px</b></span>
          <input className={styles.slider} type="range" min="12" max="250" value={size} aria-label="Font size" onChange={(e) => setSize(Number(e.target.value))} />
        </label>
        
        <label className={styles.label}>
          <span>Leading <b>{lineHeight}</b></span>
          <input className={styles.slider} type="range" min="0.5" max="2.5" step="0.1" value={lineHeight} aria-label="Line height" onChange={(e) => setLineHeight(Number(e.target.value))} />
        </label>

        {hasSwash && (
          <button 
            className={`${styles.swashBtn} ${swashEnabled ? styles.swashBtnActive : ""}`}
            onClick={() => setSwashEnabled(!swashEnabled)}
            style={{
              fontFamily: fontFamily,
              fontFeatureSettings: '"swsh" 1',
            }}
            title="Toggle Swash"
          >
            Swash
          </button>
        )}
      </div>
      
      <textarea
        className={styles.textarea}
        spellCheck="false"
        value={text}
        placeholder="Type something to preview..."
        aria-label="Font preview text area"
        onChange={(e) => setText(e.target.value)}
        style={{
          fontFamily: fontFamily,
          fontSize: `${size}px`,
          fontWeight: weight,
          lineHeight: lineHeight,
          fontStyle: isItalic ? "italic" : "normal",
          fontFeatureSettings: swashEnabled ? '"swsh" 1' : '"swsh" 0',
          fontVariationSettings: variationSettings,
        }}
      />
    </div>
  );
}
