"use client";

import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";
import PageTransition from "../../components/PageTransition";

type FontEntry = {
  slug: string;
  name: string;
  hebrewName?: string;
  family: string;
  previewWeight: number;
  tags: string[];
  stylesInfo: string;
  hebrewStylesInfo: string;
};

const ALL_FONTS: FontEntry[] = [
  { 
    slug: "neoklass", 
    name: "NeoKlass", 
    hebrewName: "נאוקלאס",
    family: "Neoklass", 
    previewWeight: 900, 
    tags: ["Sans-serif", "Latin + Hebrew", "Grotesque"],
    stylesInfo: "6 styles with matching italic",
    hebrewStylesInfo: "6 משקלים כולל איטליק תואם"
  },
  { 
    slug: "olivia-display", 
    name: "Olivia Display", 
    hebrewName: "אוליביה דיספליי",
    family: "'Olivia Display'", 
    previewWeight: 700, 
    tags: ["Serif", "Latin + Hebrew", "Experimental", "Display"],
    stylesInfo: "7 styles",
    hebrewStylesInfo: "7 משקלים"
  },
  { 
    slug: "olivia-text", 
    name: "Olivia Text", 
    hebrewName: "אוליביה טקסט",
    family: "'Olivia Text'", 
    previewWeight: 400, 
    tags: ["Serif", "Latin + Hebrew", "Experimental", "Text"],
    stylesInfo: "5 styles",
    hebrewStylesInfo: "5 משקלים"
  },
  { 
    slug: "dafna", 
    name: "Dafna", 
    hebrewName: "דפנה",
    family: "Dafna", 
    previewWeight: 700, 
    tags: ["Serif", "Latin + Hebrew", "In process"],
    stylesInfo: "5 styles with matching italic",
    hebrewStylesInfo: "5 משקלים כולל איטליק תואם"
  },
  { 
    slug: "monoklass", 
    name: "MonoKlass", 
    hebrewName: "מונוקלאס",
    family: "Monoklass", 
    previewWeight: 500, 
    tags: ["Sans-serif", "Latin + Hebrew", "Monospace", "In process"],
    stylesInfo: "5 styles with matching italic",
    hebrewStylesInfo: "5 משקלים כולל איטליק תואם"
  },
  { 
    slug: "sticky", 
    name: "Sticky Variable", 
    family: "StickyVariable", 
    previewWeight: 100, 
    tags: ["Variable", "Latin", "Display"],
    stylesInfo: "Variable font",
    hebrewStylesInfo: "פונט וריאבילי"
  },
  { 
    slug: "wilson", 
    name: "Wilson typeface", 
    family: "Wilson", 
    previewWeight: 400, 
    tags: ["Display", "Latin", "Wild"],
    stylesInfo: "1 style",
    hebrewStylesInfo: "משקל אחד"
  },
  { 
    slug: "skolar-sans-hebrew", 
    name: "Skolar Sans Hebrew", 
    hebrewName: "סקולר סנס עברית",
    family: "'Skolar Sans Hebrew'", 
    previewWeight: 700, 
    tags: ["Sans-serif", "Latin + Hebrew", "Collaboration"],
    stylesInfo: "9 styles with matching italic",
    hebrewStylesInfo: "9 משקלים כולל איטליק תואם"
  },
];

export default function FontsIndex() {
  const { t, lang } = useLanguage();
  const isRTL = lang === "he";

  return (
    <PageTransition>
      <section>
        <div className="page-header-container" dir={isRTL ? "rtl" : "ltr"}>
          <h1 className="page-title">
            {t("fonts.page_title")}
          </h1>
        </div>
      
      <div className="fonts-grid">
        {ALL_FONTS.map((font) => {
          const isSkolar = font.slug === "skolar-sans-hebrew";
          const tagsToShow = isSkolar ? font.tags.filter(tag => tag === "Collaboration") : font.tags;
          
          const CardContent = (
            <div 
              className="font-card-inner" 
              dir={isRTL ? "rtl" : "ltr"}
              style={isSkolar ? { minHeight: "170px", padding: "1rem 3rem" } : {}}
            >
              <div className="font-card-meta">
                {tagsToShow.map(tag => {
                  const tagKey = `tag.${tag.toLowerCase().replace(/\s\+\s/g, "_").replace(/\s/g, "-")}`;
                  const isSpecialTag = tag === "Collaboration" || tag === "In process";
                  
                  return (
                    <span 
                      key={tag} 
                      className="text-meta"
                      style={{
                        padding: "0.3rem 0.8rem",
                        border: "1.5px solid var(--border-color)",
                        backgroundColor: isSpecialTag ? "var(--text-color)" : "transparent",
                        color: isSpecialTag ? "var(--bg-color)" : "inherit",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em"
                      }}
                    >
                      {t(tagKey)}
                    </span>
                  );
                })}
              </div>
              <div 
                className="font-preview" 
                style={{ 
                  fontFamily: font.family, 
                  fontWeight: font.previewWeight,
                  fontSize: isSkolar ? "clamp(1.8rem, 4.8vw, 3.6rem)" : undefined 
                }}
              >
                {font.hebrewName ? `${font.name} ${font.hebrewName}` : font.name}
              </div>
              {!isSkolar && (
                <div className="font-card-info text-meta" style={{ opacity: 0.8 }}>
                  {isRTL ? font.hebrewStylesInfo : font.stylesInfo}
                </div>
              )}
            </div>
          );

          if (isSkolar) {
            return (
              <a 
                key={font.slug} 
                href="https://www.rosettatype.com/SkolarSansHebrew" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-card font-card-inverted"
              >
                {CardContent}
              </a>
            );
          }

          return (
            <Link key={font.slug} href={`/fonts/${font.slug}`} className="font-card">
              {CardContent}
            </Link>
          );
        })}
      </div>
    </section>
    </PageTransition>
  );
}
