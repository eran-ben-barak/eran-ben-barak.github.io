"use client";

import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import styles from "./FontSpecimen.module.css";
import { motion, AnimatePresence } from "framer-motion";

interface PurchaseSectionProps {
  slug: string;
  fontName: string;
  weights: { weight: number; label: string }[];
}

type Tier = "solo" | "studio" | "business";
type Currency = "NIS" | "USD" | "EUR";

const PRICES = {
  NIS: { solo: 500, studio: 1000, business: 2000 },
  USD: { solo: 130, studio: 260, business: 520 },
  EUR: { solo: 120, studio: 240, business: 480 },
};

const CURRENCY_SYMBOLS = {
  NIS: "₪",
  USD: "$",
  EUR: "€",
};

const PRODUCT_MAPPING: Record<string, string> = {
  "olivia-display": "329694cd-6d8c-470c-aff6-738dd74ebb77",
  "olivia-text": "0f603866-79af-4f23-b079-a7746d12d235",
};

export default function PurchaseSection({ slug, fontName, weights }: PurchaseSectionProps) {
  const { t, lang } = useLanguage();
  const [tier, setTier] = useState<Tier>("solo");
  const [currency, setCurrency] = useState<Currency>("NIS");
  const [selectedWeights, setSelectedWeights] = useState<number[]>(weights.map(w => w.weight));
  
  const isRTL = lang === "he";
  const numSelected = selectedWeights.length;
  const isFullFamily = numSelected === weights.length;
  
  const basePrice = PRICES[currency][tier];
  const totalPrice = isFullFamily ? Math.round(basePrice * numSelected * 0.75) : (basePrice * numSelected);

  const toggleWeight = (w: number) => {
    // If we click a single weight, we only want that weight selected
    setSelectedWeights([w]);
  };

  const selectAll = () => setSelectedWeights(weights.map(w => w.weight));  const productId = PRODUCT_MAPPING[slug];
  const buyUrl = productId 
    ? `https://eranbenbarak.lemonsqueezy.com/checkout/buy/${productId}?currency=${currency}`
    : `https://eranbenbarak.lemonsqueezy.com/`;

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
                    {CURRENCY_SYMBOLS[currency]}{PRICES[currency][tKey]}
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
            <div className={styles.currencyToggle}>
              {(["NIS", "USD", "EUR"] as Currency[]).map(c => (
                <button 
                  key={c} 
                  className={`${styles.currencyBtn} ${currency === c ? styles.active : ""}`}
                  onClick={() => setCurrency(c)}
                >
                  {c}
                </button>
              ))}
            </div>

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
                    key={`${totalPrice}-${currency}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={styles.finalPrice}
                  >
                    {CURRENCY_SYMBOLS[currency]}{totalPrice.toLocaleString()}
                  </motion.span>
                </AnimatePresence>
                
                {isFullFamily && (
                  <span className={styles.discountDisclaimer}>
                    {t("purchase.full_family_discount_disclaimer")}
                  </span>
                )}

                {(currency === "USD" || currency === "EUR") && (
                  <span className="text-meta" style={{ fontSize: "0.65rem", opacity: 0.5, marginTop: "0.5rem", textTransform: "none" }}>
                    * Prices are approximate and may vary at checkout due to currency conversion.
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
