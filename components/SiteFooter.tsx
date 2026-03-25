"use client";
import { useLanguage } from "../context/LanguageContext";

export default function SiteFooter() {
  const { t } = useLanguage();
  return (
    <footer className="site-footer" style={{ borderTop: "none", position: "relative", padding: "1.5rem" }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ margin: 0, textAlign: "center", fontSize: '0.9rem' }}>
          © {new Date().getFullYear()} Eran Ben Barak. {t("footer.rights")}
        </p>
      </div>
      <div style={{ position: "absolute", right: "2rem", top: "50%", transform: "translateY(-50%)", display: 'flex', alignItems: 'center' }}>
        <a href="https://instagram.com/eranbenbarak" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', color: 'var(--text-color)', opacity: 0.6, transition: 'opacity 0.2s' }} aria-label="Instagram">
          <svg width="24" height="24" viewBox="0 0 800 800" fill="currentColor">
            <path d="M545.8,108.3c80.4.2,145.6,65.4,145.8,145.8v291.7c-.2,80.4-65.4,145.6-145.8,145.8H254.2c-80.4-.2-145.6-65.4-145.8-145.8V254.2c.2-80.4,65.4-145.6,145.8-145.8h291.7M545.8,50H254.2c-112.3,0-204.2,91.9-204.2,204.2v291.7c0,112.3,91.9,204.2,204.2,204.2h291.7c112.3,0,204.2-91.9,204.2-204.2V254.2c0-112.3-91.9-204.2-204.2-204.2h-.1Z"/>
            <path d="M589.6,254.2c-24.2,0-43.8-19.6-43.8-43.8s19.6-43.8,43.8-43.8,43.8,19.6,43.8,43.8h0c0,24.1-19.5,43.7-43.6,43.8h-.2Z"/>
            <path d="M400,283.3c64.4,0,116.7,52.2,116.7,116.7s-52.2,116.7-116.7,116.7-116.7-52.2-116.7-116.7,52.3-116.6,116.7-116.7M400,225c-96.6,0-175,78.4-175,175s78.4,175,175,175,175-78.4,175-175-78.4-175-175-175Z"/>
          </svg>
        </a>
      </div>
    </footer>
  );
}
