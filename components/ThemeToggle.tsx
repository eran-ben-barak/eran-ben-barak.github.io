"use client";
import { useEffect, useState } from "react";
import styles from "./ThemeToggle.module.css";

const STATIC_THEMES = [
  { name: 'light', color: '#F5F5F7' },
  { name: 'dark', color: '#121212' }
];

export default function ThemeToggle() {
  const [activeTheme, setActiveTheme] = useState<string | null>(null);

  useEffect(() => {
    // 1. Check localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setActiveTheme(savedTheme);
      return;
    }

    // 2. Check system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setActiveTheme(prefersDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    if (activeTheme) {
      document.documentElement.setAttribute("data-theme", activeTheme);
      localStorage.setItem("theme", activeTheme);
    }
  }, [activeTheme]);

  if (!activeTheme) return <div className={styles.toggleGroupPlaceholder} />;

  return (
    <div className={styles.toggleGroup}>
      {STATIC_THEMES.map(theme => (
        <button 
          key={theme.name}
          className={`${styles.dot} ${activeTheme === theme.name ? styles.active : ''}`}
          style={{ background: theme.color }}
          onClick={() => setActiveTheme(theme.name)}
          aria-label={`Switch to ${theme.name} theme`}
        />
      ))}
    </div>
  );
}
