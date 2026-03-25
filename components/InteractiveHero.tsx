"use client";

import { useLanguage } from "../context/LanguageContext";
import { motion, useScroll, useSpring, useTransform, useVelocity, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import styles from "./HeroAnimations.module.css";

export default function InteractiveHero() {
  const { t, lang } = useLanguage();
  const isRTL = lang === "he";
  const text = t("hero.title");

  return (
    <div className={styles.heroContainer}>
      <TerminalHero text={text} isRTL={isRTL} />
    </div>
  );
}

function TerminalHero({ text, isRTL }: { text: string; isRTL: boolean }) {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Reset when text changes (language switch)
    setDisplayedText("");
    setIndex(0);
  }, [text]);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 40); // Speed of typing
      return () => clearTimeout(timeout);
    }
  }, [index, text]);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div className={styles.scanlines} />
      <h1 
        className={`${styles.title} ${styles.terminalTitle}`} 
        dir={isRTL ? "rtl" : "ltr"} 
        style={{ textAlign: isRTL ? "right" : "left" }}
      >
        <span style={{ display: "inline-block", position: "relative" }}>
          <span className={styles.prompt}>{"> "}</span>
          {displayedText}
          <span className={styles.cursor} />
        </span>
      </h1>
    </div>
  );
}
