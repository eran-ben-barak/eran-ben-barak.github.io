"use client";

import { useLanguage } from "../../context/LanguageContext";
import { motion } from "framer-motion";
import PageTransition, { titleVariants } from "../../components/PageTransition";

export function AboutClient() {
  const { t, lang } = useLanguage();
  const isRTL = lang === "he";

  return (
    <PageTransition>
      <motion.section 
        className="about-section" 
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="about-layout">
          <div className="about-content-col">
            <div className="page-header-container" dir={isRTL ? "rtl" : "ltr"}>
              <motion.h1 
                className="page-title"
                variants={titleVariants}
              >
                {t("about.page_title")}
              </motion.h1>
            </div>
          
          <div className="about-content text-editorial">
            <p>
              {t("about.bio1")}
            </p>
            <p>
              {t("about.bio2")}
            </p>

            <h3 className="text-meta" style={{ marginTop: "4rem", marginBottom: "1.5rem", color: "var(--border-color)", fontWeight: "normal" }}>
              {t("about.what_i_do")}
            </h3>
            <ul className="about-list" style={{ listStyle: "none", padding: 0 }}>
              <li style={{ padding: "0.5rem 0", borderBottom: "1px solid var(--border-color)" }}>{t("about.service1")}</li>
              <li style={{ padding: "0.5rem 0", borderBottom: "1px solid var(--border-color)" }}>{t("about.service2")}</li>
              <li style={{ padding: "0.5rem 0", borderBottom: "1px solid var(--border-color)" }}>{t("about.service3")}</li>
              <li style={{ padding: "0.5rem 0", borderBottom: "1px solid var(--border-color)" }}>{t("about.service4")}</li>
              <li style={{ padding: "0.5rem 0", borderBottom: "1px solid var(--border-color)" }}>{t("about.service5")}</li>
            </ul>

            <h3 className="text-meta" style={{ marginTop: "4rem", marginBottom: "1.5rem", color: "var(--border-color)", fontWeight: "normal" }}>
              {t("about.education")}
            </h3>
            <p style={{ marginBottom: "1rem" }}>
              {t("about.edu1")}
            </p>
            <p style={{ marginBottom: "1rem" }}>
              {t("about.edu2")}
            </p>

            <h3 className="text-meta" style={{ marginTop: "4rem", marginBottom: "1.5rem", color: "var(--border-color)", fontWeight: "normal" }}>
              {t("about.contact")}
            </h3>
            <p>
              {t("about.contact_text")}{" "}
              <a href="mailto:info@eranbenbarak.com" className="contact-link" style={{ textDecorationThickness: "2px", textUnderlineOffset: "4px" }}>
                info@eranbenbarak.com
              </a>
            </p>
          </div>
        </div>

        <motion.div 
          className="about-photo-col"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="about-photo-placeholder">
            <img 
              src="/images/about/eran-portrait.jpg" 
              alt="Eran Ben Barak"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </motion.div>
      </div>
    </motion.section>
    </PageTransition>
  );
}
