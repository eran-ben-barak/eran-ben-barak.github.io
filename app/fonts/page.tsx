"use client";

import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";
import PageTransition from "../../components/PageTransition";
import UnderConstructionStamp from "../../components/UnderConstructionStamp";

type FontEntry = {
  slug: string;
  name: string;
  hebrewName?: string;
  family: string;
  previewWeight: number;
  tags: string[];
  stylesInfo: string;
  hebrewStylesInfo: string;
  externalUrl?: string;
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
    slug: "monoklass", 
    name: "MonoKlass", 
    hebrewName: "מונוקלאס",
    family: "Monoklass", 
    previewWeight: 500, 
    tags: ["Sans-serif", "Latin + Hebrew", "Monospace"],
    stylesInfo: "5 styles with matching italic",
    hebrewStylesInfo: "5 משקלים כולל איטליק תואם"
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
    hebrewStylesInfo: "9 משקלים כולל איטליק תואם",
    externalUrl: "https://www.rosettatype.com/SkolarSansHebrew"
  },
  { 
    slug: "relic-hebrew", 
    name: "Relic Hebrew", 
    hebrewName: "רליק עברית",
    family: "'Relic Hebrew'", 
    previewWeight: 400, 
    tags: ["Serif", "Latin + Hebrew", "Collaboration"],
    stylesInfo: "1 style",
    hebrewStylesInfo: "משקל אחד",
    externalUrl: "https://www.eastofrome.com/fonts/relic"
  },
];

export default function FontsIndex() {
  const { t, lang } = useLanguage();
  const isRTL = lang === "he";

  const mainFonts = ALL_FONTS.filter((font) => !font.externalUrl);
  const collaborationFonts = ALL_FONTS.filter((font) => font.externalUrl);

  const renderFontCard = (font: FontEntry) => {
    const isExternal = Boolean(font.externalUrl);
    const tagsToShow = isExternal ? [] : font.tags;

    const CardContent = (
      <div 
        className="font-card-inner" 
        dir={isRTL ? "rtl" : "ltr"}
        style={isExternal ? { minHeight: "unset", padding: "0", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%" } : {}}
      >
        {tagsToShow.length > 0 && (
          <div className="font-card-meta">
            {tagsToShow.map((tag) => {
              const tagKey = `tag.${tag.toLowerCase().replace(/\s\+\s/g, "_").replace(/\s/g, "-")}`;
              const isSpecialTag = tag === "In process";
              const isInProcessTag = tag === "In process";
              
              return (
                <span 
                  key={tag} 
                  className={`font-card-tag ${isInProcessTag ? "tag-in-process" : (isSpecialTag ? "tag-special" : "")}`}
                >
                  {t(tagKey)}
                </span>
              );
            })}
          </div>
        )}
        <div 
          className="font-preview" 
          style={{ 
            fontFamily: font.family, 
            fontWeight: font.previewWeight,
            fontSize: isExternal ? "clamp(1.8rem, 4.8vw, 3.6rem)" : undefined,
            padding: isExternal ? "0" : undefined,
            margin: isExternal ? "0" : undefined,
            lineHeight: isExternal ? "1.1" : undefined,
            textAlign: "center"
          }}
        >
          {font.hebrewName ? `${font.name} ${font.hebrewName}` : font.name}
        </div>
        {!isExternal && (
          <div className="font-card-info text-meta" style={{ opacity: 0.8 }}>
            {isRTL ? font.hebrewStylesInfo : font.stylesInfo}
          </div>
        )}
      </div>
    );

    if (font.externalUrl) {
      return (
        <a 
          key={font.slug} 
          href={font.externalUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="font-card font-card-inverted"
          style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            minHeight: "75px", 
            padding: "1.2rem 1.5rem" 
          }}
        >
          {CardContent}
        </a>
      );
    }

    return (
      <Link 
        key={font.slug} 
        href={`/fonts/${font.slug}`} 
        className="font-card"
        style={{ position: "relative" }}
      >
        {CardContent}
      </Link>
    );
  };

  return (
    <PageTransition>
      <section>
        <div className="page-header-container" dir={isRTL ? "rtl" : "ltr"}>
          <h1 className="page-title">
            {t("fonts.page_title")}
          </h1>
        </div>
      
        <div className="fonts-grid">
          {mainFonts.map(renderFontCard)}
        </div>

        {collaborationFonts.length > 0 && (
          <>
            <h3 
              className="text-meta" 
              style={{ 
                marginTop: "4rem", 
                marginBottom: "1.5rem", 
                color: "var(--text-color)", 
                fontSize: "1.125rem", 
                textAlign: "center", 
                fontWeight: "normal" 
              }}
              dir={isRTL ? "rtl" : "ltr"}
            >
              {t("fonts.collaborations")}
            </h3>
            <div className="fonts-grid" style={{ gap: "1rem" }}>
              {collaborationFonts.map(renderFontCard)}
            </div>
          </>
        )}
      </section>
    </PageTransition>
  );
}
