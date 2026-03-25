"use client";

import styles from "./LanguageToggle.module.css";
import { useLanguage } from "../context/LanguageContext";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  const toggleLang = () => {
    setLang(lang === "en" ? "he" : "en");
  };
  return (
    <div 
      className={styles.toggleContainer} 
      onClick={toggleLang}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleLang();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Switch language to ${lang === "en" ? "Hebrew" : "English"}`}
    >
      <span className={`${styles.label} ${lang === 'he' ? styles.active : ''}`}>עב</span>
      <span className={styles.divider}>|</span>
      <span className={`${styles.label} ${lang === 'en' ? styles.active : ''}`}>EN</span>
    </div>
  );
}
