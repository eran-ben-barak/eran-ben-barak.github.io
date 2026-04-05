"use client";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "../context/LanguageContext";
import { useState, useEffect } from "react";

const DEFAULT_INTENSITY = 0;

export default function SiteHeader() {
  const { t, lang } = useLanguage();
  const [intensity, setIntensity] = useState(DEFAULT_INTENSITY);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isRTL = lang === "he";

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // On mobile, hide header when scrolling down, show when scrolling up
      if (window.innerWidth <= 1024) {
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
          setIsVisible(false);
          setIsMenuOpen(false); // Close menu on scroll
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

  // Close menu when clicking away or navigating
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setIntensity(val);
    if (typeof window !== "undefined") {
      window.__waveIntensity = val;
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`site-header ${isVisible ? "" : "header-hidden"} ${isMenuOpen ? "menu-open" : ""}`}>
      <div className="header-left">
        <Link href="/" className="nav-btn logo-btn" onClick={closeMenu}>{t("header.name")}</Link>
        <div className="header-controls-desktop">
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
        </div>
      </div>

      <div className="header-center desktop-only">
        <ThemeToggle />
      </div>

      <nav className="nav-links header-right desktop-only">
        <Link href="/fonts" className="nav-btn">{t("nav.fonts")}</Link>
        <Link href="/designs" className="nav-btn">{t("nav.designs")}</Link>
        <Link href="/toolbox" className="nav-btn">{t("nav.toolbox")}</Link>
        <Link href="/about" className="nav-btn">{t("nav.about")}</Link>
        <LanguageToggle />
      </nav>

      {/* Mobile Hamburger */}
      <button 
        className={`hamburger ${isMenuOpen ? "active" : ""}`} 
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile Overlay Menu */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? "active" : ""}`} dir={isRTL ? "rtl" : "ltr"} style={{ backgroundColor: 'var(--bg-color)' }}>
        <nav className="mobile-nav-links">
          <Link href="/fonts" className="mobile-nav-item" onClick={closeMenu}>{t("nav.fonts")}</Link>
          <Link href="/designs" className="mobile-nav-item" onClick={closeMenu}>{t("nav.designs")}</Link>
          <Link href="/toolbox" className="mobile-nav-item" onClick={closeMenu}>{t("nav.toolbox")}</Link>
          <Link href="/about" className="mobile-nav-item" onClick={closeMenu}>{t("nav.about")}</Link>
        </nav>
        
        <div className="mobile-menu-footer">
          <div className="mobile-controls-row">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={intensity}
              onChange={handleChange}
              className="wave-slider mobile-slider"
              aria-label="Wave intensity"
            />
          </div>
          <div className="mobile-toggles-row">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
