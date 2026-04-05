"use client";

import { useState, useEffect } from "react";
import styles from "./FontSpecimen.module.css";
import TypeTester from "./TypeTester";
import PurchaseSection from "./PurchaseSection";
import { useLanguage } from "../context/LanguageContext";
import UnderConstructionStamp from "./UnderConstructionStamp";

type WeightEntry = { weight: number; label: string; italic?: boolean; italicAngle?: number };

interface FontSpecimenProps {
  font: {
    name: string;
    family: string;
    defaultText: string;
    sampleText: string;
    category: string;
    script: string;
    year: string;
    weights: WeightEntry[];
    charset: {
      uppercase?: string;
      lowercase?: string;
      numerals?: string;
      punctuation?: string;
      hebrew?: string;
    };
    features: string[];
    themedContent?: { text: string; footnote: string }[];
    hebrewThemedContent?: { text: string; footnote: string }[];
    aboutInfo?: string;
    hebrewAboutInfo?: string;
    hebrewName?: string;
    isVariable?: boolean;
    variableAxes?: { axis: string; min: number; max: number; default: number }[];
    tags: string[];
    testerSizes?: number[];
  };
}

export default function FontSpecimenDisplay({ font }: FontSpecimenProps) {
  const { t, lang } = useLanguage();
  const [hoverChar, setHoverChar] = useState<string | null>(null);
  const [randomWeightIndices, setRandomWeightIndices] = useState<number[]>([]);
  const [randomAxesStates, setRandomAxesStates] = useState<Record<string, Record<string, number>>>({});
  const isRTL = lang === "he";

  // Sizes for the combined showcase
  const showcaseSizes = font.testerSizes || [20, 40, 60, 80, 120];

  useEffect(() => {
    // Generate random styles on mount to avoid hydration mismatch
    const indices = showcaseSizes.map(() => Math.floor(Math.random() * font.weights.length));
    setRandomWeightIndices(indices);

    if (font.isVariable && font.variableAxes) {
      const axesStates: Record<string, Record<string, number>> = {};
      showcaseSizes.forEach((_, idx) => {
        const itemAxes: Record<string, number> = {};
        font.variableAxes!.forEach((ax) => {
          const range = ax.max - ax.min;
          const val = ax.min + Math.random() * range;
          itemAxes[ax.axis] = ax.max <= 1 ? Number(val.toFixed(2)) : Math.round(val);
        });
        axesStates[`${idx}`] = itemAxes;
      });
      setRandomAxesStates(axesStates);
    }
  }, [font.weights.length, showcaseSizes.length, font.isVariable, font.variableAxes]); // eslint-disable-line react-hooks/exhaustive-deps

  // Use Intl.Segmenter to split characters by true graphemes (keeps base letter and Nikud together)
  const segmenter = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter('en', { granularity: 'grapheme' }) : null;
  const splitChars = (str?: string) => {
    if (!str) return [];
    if (segmenter) {
      return Array.from(segmenter.segment(str)).map(s => s.segment).filter(s => s.trim() !== "");
    }
    // Fallback if Segmenter is unavailable (matches 1 char + optional hebrew marks)
    const matches = str.match(/[\s\S][\u0591-\u05C7]*/gu);
    return matches ? matches.filter(s => s.trim() !== "") : [];
  };

  // Combine all characters for the full set
  const allChars = [
    ...splitChars(font.charset.uppercase),
    ...splitChars(font.charset.lowercase),
    ...splitChars(font.charset.hebrew),
    ...splitChars(font.charset.numerals),
    ...splitChars(font.charset.punctuation),
  ];

  return (
    <section 
      className={`${styles.specimenContainer} ${isRTL ? styles.rtl : ""}`}
      dir={isRTL ? "rtl" : "ltr"}
      translate={font.family === "StickyVariable" ? "no" : undefined}
    >
      {/* 1. Header: Boxed Tags + Big Centered Name */}
      <div className={styles.specimenHeader} style={{ position: "relative" }}>
        {font.tags.includes("In process") && (
          <UnderConstructionStamp 
            size={180} 
            className={styles.stampOverlay} 
            offsetRange={30}
          />
        )}
        <div className={styles.specimenTags} style={{ flexWrap: "wrap", rowGap: "0.5rem", marginBottom: "2rem" }}>
          {font.tags.map(tag => {
            const tagKey = `tag.${tag.toLowerCase().replace(" + ", "_").replace(" ", "-")}`;
            return (
              <span 
                key={tag} 
                className={`${styles.specimenTag} text-meta`}
                style={
                  tag === "In process" 
                  ? { backgroundColor: "#f8cf27", color: "#121212", borderColor: "#f8cf27" } 
                  : (tag === "Collaboration" ? { backgroundColor: "var(--text-color)", color: "var(--bg-color)" } : {})
                }
              >
                {t(tagKey)}
              </span>
            );
          })}
        </div>
        <h1 
          className={font.family === "StickyVariable" ? styles.stickyAnimatedHeadline : styles.specimenTitle} 
          style={{ fontFamily: font.family }}
        >
          {font.name} {font.family !== "StickyVariable" && font.hebrewName}
        </h1>
      </div>

      {/* 2. Styles Waterfall */}
      <div className={styles.sectionWrapper}>
        <div className={styles.sectionHeader}>
          <span className={`${styles.sectionLabel} text-meta`}>
            {t("specimen.styles")}
          </span>
        </div>
        <div className={styles.stylesWaterfall}>
          {font.weights.map((w, idx) => {
            const baseLabel = w.label.replace(/\s*Italic/i, "").trim().toLowerCase();
            const weightKey = baseLabel ? `weight.${baseLabel}` : "weight.regular";
            const weightName = t(weightKey);
            const isItalic = w.italic || w.label.toLowerCase().includes("italic");
            const italicSuffix = isRTL ? ` ${t("weight.italic")}` : " Italic";
            
            // For the "Italic" weight specifically, we don't want "Regular Italic" in English or "רגיל איטליק" in Hebrew if it's just meant as "Italic"
            const weightDisplay = (isItalic && baseLabel === "") 
              ? (isRTL ? t("weight.italic") : "Italic")
              : (isItalic ? `${weightName}${italicSuffix}` : weightName);

            const baseFontName = font.family === "StickyVariable" ? "Sticky" : (font.family === "Wilson" ? "Wilson" : font.name);
            const label = (isRTL && font.hebrewName)
              ? `${font.hebrewName} ${weightDisplay}`
              : `${baseFontName} ${w.label}`;

            return (
              <div 
                key={idx} 
                className={styles.waterfallItem}
              >
                <span className={`${styles.waterfallLabel} text-meta`}>{w.weight}</span>
                <span 
                  className={styles.waterfallText}
                  style={{ 
                    fontFamily: font.family, 
                    fontWeight: w.weight,
                    fontStyle: isItalic ? "italic" : "normal",
                    fontVariationSettings: font.isVariable 
                      ? `"wght" ${w.weight}${w.italicAngle !== undefined ? `, "ital" ${w.italicAngle}` : ''}` 
                      : undefined
                  }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Combined Tester & Showcase */}
      <div className={styles.sectionWrapper}>
        <div className={styles.sectionHeader}>
          <span className={`${styles.sectionLabel} text-meta`}>
            {t("specimen.tester")}
          </span>
        </div>
        <div className={styles.combinedShowcase} key={lang}>
          {showcaseSizes.map((size: number, idx: number) => {
            // Use random index if available, fallback to default sequence for server render
            const weightIdx = randomWeightIndices.length > 0 ? randomWeightIndices[idx] : (idx % font.weights.length);
            const weightEntry = font.weights[weightIdx];
            
            // Choose text based on language
            const baseText = isRTL 
              ? (font.hebrewThemedContent?.[idx]?.text || font.themedContent?.[idx]?.text || font.sampleText)
              : (font.themedContent?.[idx]?.text || font.sampleText);
            
            // Repeat text for smaller sizes so textarea is not too empty
            const repeatCount = size <= 40 ? 4 : (size <= 60 ? 2 : 1);
            const themedText = Array(repeatCount).fill(baseText).join(" ");
            
            // Dynamic leading based on font size
            const initialLineHeight = size <= 20 ? 1.5 : (size <= 40 ? 1.3 : (size <= 60 ? 1.2 : (size <= 80 ? 1.1 : 1.0)));

            return (
              <TypeTester 
                key={`${size}-${weightEntry.label}-${idx}-${randomWeightIndices.length}`}
                fontFamily={font.family}
                defaultText={themedText}
                isVariable={font.isVariable}
                variableAxes={font.variableAxes}
                initialAxesStates={randomAxesStates[`${idx}`]}
                weights={font.weights}
                initialSize={size}
                initialWeight={weightEntry.weight}
                initialItalic={weightEntry.italic}
                initialLineHeight={initialLineHeight}
                hasSwash={font.features?.includes("swsh")}
              />
            );
          })}
        </div>
      </div>

      {/* 5. Character Set */}
      <div className={styles.sectionWrapper}>
        <div className={styles.sectionHeader}>
          <span className={`${styles.sectionLabel} text-meta`}>
            {t("specimen.charset")}
          </span>
        </div>
        <div className={styles.characterContainer}>
          <div className={styles.characterGrid}>
            {allChars.map((char, index) => (
              <div
                key={index}
                className={styles.charBox}
                onMouseEnter={() => setHoverChar(char)}
                onMouseLeave={() => setHoverChar(null)}
                style={{ fontFamily: font.family }}
              >
                {char}
              </div>
            ))}
          </div>
          {hoverChar && (
            <div className={styles.charPreview}>
              <div className={styles.charPreviewInner} style={{ fontFamily: font.family }}>
                {hoverChar}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 6. Purchase or External Link Section */}
      {(() => {
        const familyLower = font.family.toLowerCase();
        
        // Olivia Fonts (Internal Purchase)
        if (familyLower.includes("olivia")) {
          return (
            <PurchaseSection 
              slug={font.family.toLowerCase().replace(/'/g, "").replace(/ /g, "-")}
              fontName={font.name}
              weights={font.weights}
            />
          );
        }

        // External Link Fonts
        const externalLinks: Record<string, { text: string; link: string }> = {
          neoklass: { 
            text: t("specimen.neoklass_link"), 
            link: "https://fontef.com/neoklass" 
          },
          stickyvariable: { 
            text: t("specimen.sticky_link"), 
            link: "https://ecal-typefaces.ch/" 
          },
          wilson: { 
            text: t("specimen.wilson_link"), 
            link: "https://type-department.com/products/wilson?_pos=1&_psq=wilson&_ss=e&_v=1.0" 
          },
          "'skolar sans hebrew'": { 
            text: t("specimen.skolar_link"), 
            link: "https://www.rosettatype.com/SkolarSansHebrew" 
          }
        };

        const external = externalLinks[familyLower];
        if (external) {
          return (
            <div className={styles.sectionWrapper}>
              <div className={styles.sectionHeader}>
                <span className={`${styles.sectionLabel} text-meta`}>{t("purchase.title")}</span>
              </div>
              <div className={styles.aboutGrid} style={{ alignItems: "center" }}>
                <div className="text-editorial" style={{ margin: 0 }}>
                  {external.text}
                </div>
                <div>
                  <a 
                    href={external.link} 
                    className={styles.buyButton} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ width: "auto", display: "inline-block", padding: "1rem 3rem" }}
                  >
                    {t("purchase.buy_now")}
                  </a>
                </div>
              </div>
            </div>
          );
        }

        // In Process Fonts
        if (font.tags.includes("In process")) {
          return (
            <div className={styles.sectionWrapper}>
              <div className={styles.sectionHeader}>
                <span className={`${styles.sectionLabel} text-meta`}>{t("purchase.title")}</span>
              </div>
              <div className="text-editorial">
                {t("specimen.in_process")}
              </div>
            </div>
          );
        }

        return null;
      })()}

      {/* 7. About Section */}
      {(font.aboutInfo || font.hebrewAboutInfo) && (
        <div className={styles.sectionWrapper}>
          <div className={styles.sectionHeader}>
            <span className={`${styles.sectionLabel} text-meta`}>
              {t("specimen.about")}
            </span>
          </div>
          <div className={styles.aboutGrid}>
            <div className={`${styles.aboutMeta} text-meta`}>
              <div className={styles.aboutMetaRow}>
                <span className={styles.aboutMetaLabel} style={{ opacity: 0.5 }}>{t("specimen.year")}</span>
                <span>{font.year}</span>
              </div>
            </div>
            <div className={`${styles.aboutText} text-editorial`}>
              {isRTL ? (font.hebrewAboutInfo || font.aboutInfo) : font.aboutInfo}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
