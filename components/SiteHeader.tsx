"use client";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import SoundEngine from "./SoundEngine";
import { useLanguage } from "../context/LanguageContext";
import { useState, useEffect } from "react";

const DEFAULT_INTENSITY = 0;

export default function SiteHeader() {
  const { t } = useLanguage();
  const [intensity, setIntensity] = useState(DEFAULT_INTENSITY);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // On mobile, hide header when scrolling down, show when scrolling up
      if (window.innerWidth <= 768) {
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setIntensity(val);
    if (typeof window !== "undefined") {
      window.__waveIntensity = val;
    }
  };

  return (
    <header className={`site-header ${isVisible ? "" : "header-hidden"}`}>
      <div className="header-left">
        <Link href="/" className="nav-btn">{t("header.name")}</Link>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={intensity}
          onChange={handleChange}
          className="wave-slider"
          aria-label="Wave intensity"
        />
        <SoundEngine />
      </div>
      <div className="header-center">
        <ThemeToggle />
      </div>
      <nav className="nav-links header-right">
        <Link href="/fonts" className="nav-btn">{t("nav.fonts")}</Link>
        <Link href="/designs" className="nav-btn">{t("nav.designs")}</Link>
        <Link href="/about" className="nav-btn">{t("nav.about")}</Link>
        <LanguageToggle />
      </nav>
    </header>
  );
}
