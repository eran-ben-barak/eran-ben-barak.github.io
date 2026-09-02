"use client";

import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import styles from "./FontSpecimen.module.css";
import { motion, AnimatePresence } from "framer-motion";

interface PurchaseSectionProps {
  slug: string;
  fontName: string;
  hebrewName?: string;
  weights: { weight: number; label: string }[];
}

type Tier = "solo" | "studio" | "business";

const PRICES = {
  solo: 500,
  studio: 1000,
  business: 2000,
};

const CURRENCY_SYMBOL = "₪";

export default function PurchaseSection({ slug, fontName, hebrewName, weights }: PurchaseSectionProps) {
  const { t, lang } = useLanguage();
  const [tier, setTier] = useState<Tier>("solo");
  const [selectedWeights, setSelectedWeights] = useState<number[]>(weights.map(w => w.weight));
  
  const isRTL = lang === "he";
  const numSelected = selectedWeights.length;
  const isFullFamily = numSelected === weights.length;
  
  const basePrice = PRICES[tier];
  const totalPrice = isFullFamily ? Math.round(basePrice * numSelected * 0.75) : (basePrice * numSelected);

  const toggleWeight = (w: number) => {
    if (isFullFamily) {
      // When full family is selected and a specific style is pressed,
      // deselect everything except that style
      setSelectedWeights([w]);
    } else if (selectedWeights.includes(w)) {
      // Prevent deselecting if it's the only weight selected
      if (selectedWeights.length > 1) {
        setSelectedWeights(selectedWeights.filter(item => item !== w));
      }
    } else {
      setSelectedWeights([...selectedWeights, w]);
    }
  };

  const selectAll = () => setSelectedWeights(weights.map(w => w.weight));

  const selectedLabels = weights
    .filter(w => selectedWeights.includes(w.weight))
    .map(w => t(`weight.${w.label.toLowerCase()}`));

  const fontTitleForMail = isRTL && hebrewName ? hebrewName : fontName;
  const tierTitle = t(`purchase.${tier}_title`);
  const stylesText = isFullFamily 
    ? `${t("purchase.full_family")} (${selectedLabels.join(", ")})`
    : selectedLabels.join(", ");

  const mailSubject = fontTitleForMail;
  const mailBody = isRTL 
    ? `ברצוני לרכוש: ${fontTitleForMail}\nרמת רישיון: ${tierTitle}\nמשקלים: ${stylesText}`
    : `I would like to purchase: ${fontName}\nLicense Tier: ${tierTitle}\nSelected Styles: ${stylesText}`;

  const buyUrl = `mailto:info@eranbenbarak.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

  return (
    <div className={styles.sectionWrapper} id="purchase">
      <div className={styles.sectionHeader}>
        <span className={`${styles.sectionLabel} text-meta`}>
          {t("purchase.title")}
        </span>
      </div>

      <div className={styles.purchaseGrid}>
        {/* Tier Selection */}
        <div className={styles.purchaseColumn}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.5rem" }}>
            <h3 className="text-meta" style={{ opacity: 0.5 }}>{t("purchase.tier_label")}</h3>
          </div>
          <div className={styles.tierList}>
            {(["solo", "studio", "business"] as Tier[]).map(tKey => (
              <button
                key={tKey}
                className={`${styles.tierButton} ${tier === tKey ? styles.active : ""}`}
                onClick={() => setTier(tKey)}
              >
                <div className={styles.tierHeader}>
                  <span className="text-meta">{t(`purchase.${tKey}_title`)}</span>
                  <span className={styles.tierPriceHint}>
                    {CURRENCY_SYMBOL}{PRICES[tKey].toLocaleString()}
                  </span>
                </div>
                <p className={styles.tierDesc}>{t(`purchase.${tKey}_desc`)}</p>
              </button>
            ))}
          </div>
          
          <a 
            href="/legal/font-license" 
            className={`${styles.licenseLink} text-meta`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("purchase.license_link")} ↗
          </a>
        </div>

        {/* Style Selection */}
        <div className={styles.purchaseColumn}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.5rem" }}>
            <h3 className="text-meta" style={{ opacity: 0.5 }}>{t("purchase.select_styles")}</h3>
          </div>
          
          <div className={styles.weightSelector}>
            <button
              className={`${styles.weightButton} ${isFullFamily ? styles.active : ""}`}
              onClick={selectAll}
            >
              <span className="text-meta">{t("purchase.full_family")}</span>
            </button>
            
            {weights.map((w, idx) => {
              const isActive = selectedWeights.includes(w.weight);
              const isOnlyActive = selectedWeights.length === 1 && isActive;

              return (
                <button 
                  key={idx} 
                  className={`${styles.weightButton} ${isActive ? styles.active : ""}`}
                  onClick={() => toggleWeight(w.weight)}
                  disabled={isOnlyActive && isActive}
                >
                  <span className="text-meta">{t(`weight.${w.label.toLowerCase()}`)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className={styles.purchaseSummaryColumn}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.5rem" }}>
            <h3 className="text-meta" style={{ opacity: 0 }}>Summary</h3>
          </div>
          <div className={styles.purchaseSummary}>
            <div className={styles.totalContainer}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span className="text-meta" style={{ opacity: 0.5 }}>{t("purchase.total")}</span>
                <span className="text-meta" style={{ fontSize: "0.75rem", opacity: 0.5 }}>
                  {numSelected === 1 && lang === "he" ? t("fonts.styles_count_single") : `${numSelected} ${numSelected === 1 ? t("fonts.styles_count_single").toLowerCase() : t("specimen.styles").toLowerCase()}`}
                </span>
              </div>
              <div className={styles.priceDisplay}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`${totalPrice}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={styles.finalPrice}
                  >
                    {CURRENCY_SYMBOL}{totalPrice.toLocaleString()}
                  </motion.span>
                </AnimatePresence>
                
                {isFullFamily && (
                  <span className={styles.discountDisclaimer}>
                    {t("purchase.full_family_discount_disclaimer")}
                  </span>
                )}
              </div>
            </div>

            <a 
              href={buyUrl}
              className={styles.buyButton}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("purchase.buy_now")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
