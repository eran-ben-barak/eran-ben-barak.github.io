"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "he";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const DICTIONARY: Record<Language, Record<string, string>> = {
  en: {
    "header.name": "Eran Ben Barak",
    "nav.fonts": "Fonts",
    "nav.designs": "Designs",
    "nav.about": "About",
    "hero.title": "An independent one-man type foundry and graphic design studio. Specializing in custom typefaces, logotypes, and branding.",
    "footer.rights": "All rights reserved.",
    "designs.manofim.title": "MANOFIM 17",
    "designs.manofim.description": "Branding for an art and performance festival in Jerusalem. The brief of this year was 'extreme points' and is visualized by industrial sharp design. I created a custom tri-lingual typeface for the project.",
    "designs.bustana.title": "BUSTANA",
    "designs.bustana.description": "Communal space for art and craft in Jerusalem. Shows, galleries, workshops and such. Design meant to tie it all together for publications.",
    "designs.sticky.title": "STICKY",
    "designs.sticky.description": "Started as a group project in school, Simon Memel, Lucrezia Noro and I explored the limitations of working with tape and imitating a sign painter. The monolingual nature of the tool, the limited angle, and the speed of writing were the considerations that affected the shapes of letters. After the project was over I was tasked to finalize the typeface for release at ECAL typefaces.",
    "designs.collaborators": "Collaborators",
    "designs.category.branding": "Branding",
    "designs.category.visual_language": "Visual Language",
    "designs.category.typeface_design": "Typeface Design",
    "designs.category.editorial_design": "Editorial Design",
    "fonts.page_title": "Typefaces",
    "fonts.styles_count": "styles with matching italic",
    "fonts.styles_count_single": "style",
    "about.page_title": "About",
    "about.bio1": "Hi, I'm Eran, an independent type and graphic designer originally from Israel, now based in Italy.",
    "about.bio2": "After working as a graphic designer in Israel for several years, I moved to Switzerland to complete my Master's in Type Design at ECAL. Today, I work independently, creating custom typefaces for brands and cultural institutions, specializing in the localization of Latin typefaces to Hebrew script, collaborating with international type foundries to publish my retail fonts, and of course providing graphic design services and branding solutions.",
    "about.what_i_do": "What I Do",
    "about.service1": "Custom typeface design for brands & cultural projects",
    "about.service2": "Hebrew localization & multi-script type design",
    "about.service3": "Logotype & lettering",
    "about.service4": "Graphic design & visual identity",
    "about.service5": "Type consultation",
    "about.education": "Education",
    "about.edu1": "Master in Type Design | ECAL, Lausanne, Switzerland",
    "about.edu2": "B.Des. in Visual Communication | Bezalel, Jerusalem, Israel",
    "about.contact": "Contact",
    "about.contact_text": "For custom type design, freelance inquiries, or collaborations:",
    "tag.sans-serif": "Sans-serif",
    "tag.serif": "Serif",
    "tag.display": "Display",
    "tag.text": "Text",
    "tag.classic": "Classic",
    "tag.monospace": "Monospace",
    "tag.wild": "Wild",
    "tag.latin": "Latin",
    "tag.hebrew": "Hebrew",
    "tag.latin_hebrew": "Latin + Hebrew",
    "tag.collaboration": "Collaboration",
    "tag.in-process": "In process",
    "tag.experimental": "Experimental",
    "tag.grotesque": "Grotesque",
    "tag.mathematical": "Mathematical",
    "tag.variable": "Variable",
    "specimen.styles": "Styles",
    "specimen.tester": "Interactive Tester & Showcase",
    "specimen.features": "OpenType Features",
    "specimen.charset": "Character Set",
    "specimen.about": "Specifications & About",
    "specimen.designer": "Designer",
    "specimen.year": "Year",
    "specimen.category": "Category",
    "specimen.script": "Script",
    "on": "On",
    "off": "Off",
    "weight.thin": "Thin",
    "weight.light": "Light",
    "weight.regular": "Regular",
    "weight.medium": "Medium",
    "weight.semibold": "Semibold",
    "weight.demibold": "Demibold",
    "weight.bold": "Bold",
    "weight.extrabold": "Extrabold",
    "weight.ultrabold": "Ultrabold",
    "weight.black": "Black",
    "purchase.title": "Licensing & Purchase",
    "purchase.tier_label": "License Tier",
    "purchase.solo_title": "Solo / Freelance",
    "purchase.solo_desc": "1–3 computers. Desktop + Static Web.",
    "purchase.studio_title": "Studio / Small Business",
    "purchase.studio_desc": "4–10 computers. Desktop + Web (50k) + 1 App.",
    "purchase.business_title": "Business / Pro",
    "purchase.business_desc": "11–25 computers. Desktop + Web (500k) + 5 Apps.",
    "purchase.select_styles": "Select Styles",
    "purchase.all_styles": "All Styles",
    "purchase.discount_note": "30% discount applied for 5+ styles",
    "purchase.buy_now": "Buy Now",
    "purchase.full_family": "Complete Family",
    "purchase.total": "Total",
    "purchase.currency_toggle": "Currency",
    "purchase.license_link": "View License Terms"
  },
  he: {
    "header.name": "ערן בן ברק",
    "nav.fonts": "פונטים",
    "nav.designs": "עיצובים",
    "nav.about": "אודות",
    "hero.title": "סטודיו עצמאי לעיצוב פונטים ועיצוב גרפי. מתמחה בעיצוב פונטים לחברות, לוגוטייפים ומיתוג.",
    "footer.rights": "כל הזכויות שמורות.",
    "designs.manofim.title": "מנופים 17",
    "designs.manofim.description": "מיתוג לפסטיבל אמנות ומופע בירושלים. הבריף השנה היה 'נקודות קצה' וקיבל ביטוי חזותי בעיצוב תעשייתי וחד. יצרתי פונט ייעודי תלת-לשוני עבור הפרויקט.",
    "designs.bustana.title": "בוסתנא",
    "designs.bustana.description": "מרכז קהילתי לאמנות ומלאכה בירושלים. גלריות, סדנאות והופעות. עיצוב שנועד לחבר את הכל לשפה אחת בפרסומים השונים.",
    "designs.sticky.title": "סטיקי",
    "designs.sticky.description": "הפרויקט החל כפרויקט קבוצתי בלימודים, בו סיימון ממל, לוקרציה נורו ואני חקרנו את המגבלות של עבודה עם נייר דבק (טייפ) וחיקוי של צייר שלטים. הטבע החד-לשוני של הכלי, הזווית המוגבלת ומהירות הכתיבה היו השיקולים שהשפיעו על צורות האותיות. לאחר סיום הפרויקט הוטלה עליי המשימה להשלים את הפונט להפצה ב-ECAL Typefaces.",
    "designs.collaborators": "בשיתוף עם",
    "designs.category.branding": "מיתוג",
    "designs.category.visual_language": "שפה חזותית",
    "designs.category.typeface_design": "עיצוב פונט",
    "designs.category.editorial_design": "עיצוב מערכתי",
    "fonts.page_title": "פונטים",
    "fonts.styles_count": "משקלים כולל איטליק תואם",
    "fonts.styles_count_single": "משקל אחד",
    "about.page_title": "אודות",
    "about.bio1": "היי, אני ערן, מעצב פונטים ומעצב גרפי עצמאי במקור מישראל, כיום מבוסס באיטליה.",
    "about.bio2": "לאחר שעבדתי כמעצב גרפי בישראל במשך מספר שנים, עברתי לשוויץ להשלים את התואר השני שלי בעיצוב פונטים ב-ECAL. כיום, אני עובד באופן עצמאי, יוצר פונטים מותאמים אישית למותגים ומוסדות תרבות, מתמחה בלוקליזציה של פונטים לטיניים לעברית, משתף פעולה עם בתי פונטים בינלאומיים להוצאת פונטים מסחריים, וכמובן מעניק שירותי עיצוב גרפי ופתרונות מיתוג.",
    "about.what_i_do": "מה אני עושה",
    "about.service1": "עיצוב פונטים בהתאמה אישית למותגים ופרויקטים תרבותיים",
    "about.service2": "לוקליזציה לעברית ועיצוב רב-לשוני",
    "about.service3": "לוגוטייפ וטיפוגרפיה",
    "about.service4": "עיצוב גרפי וזהות ויזואלית",
    "about.service5": "ייעוץ טיפוגרפי",
    "about.education": "השכלה",
    "about.edu1": "תואר שני בעיצוב פונטים | ECAL, לוזאנ, שוויץ",
    "about.edu2": "תואר ראשון בתקשורת חזותית | בצלאל, ירושלים, ישראל",
    "about.contact": "צרו קשר",
    "about.contact_text": "לשאלות לגבי עיצוב פונטים, עבודה כפרילאנס או שיתופי פעולה:",
    "tag.sans-serif": "סנס-סריף",
    "tag.serif": "סריף",
    "tag.display": "דיספליי",
    "tag.text": "טקסט",
    "tag.classic": "קלאסי",
    "tag.monospace": "מונוספייס",
    "tag.wild": "פרוע",
    "tag.latin": "לטינית",
    "tag.hebrew": "עברית",
    "tag.latin_hebrew": "לטינית + עברית",
    "tag.collaboration": "שיתוף פעולה",
    "tag.in-process": "בפיתוח",
    "tag.experimental": "אקספרימנטלי",
    "tag.grotesque": "גרוטסק",
    "tag.mathematical": "מתמטי",
    "tag.variable": "וריאבילי",
    "specimen.styles": "סגנונות",
    "specimen.tester": "טסטר אינטראקטיבי ותצוגה",
    "specimen.features": "תכונות אופנטייפ",
    "specimen.charset": "סט תווים",
    "specimen.about": "מפרט ואודות",
    "specimen.designer": "מעצב",
    "specimen.year": "שנה",
    "specimen.category": "קטגוריה",
    "specimen.script": "כתב",
    "on": "פעיל",
    "off": "כבוי",
    "weight.thin": "דק",
    "weight.light": "לייט",
    "weight.regular": "רגיל",
    "weight.medium": "מדיום",
    "weight.semibold": "חצי עבה",
    "weight.demibold": "דמי בולד",
    "weight.bold": "בולד",
    "weight.extrabold": "עבה מאוד",
    "weight.ultrabold": "אולטרה בולד",
    "weight.black": "בלאק",
    "weight.italic": "איטליק",
    "purchase.title": "רישיון ורכישה",
    "purchase.tier_label": "רמת רישיון",
    "purchase.solo_title": "סולו / פרילאנס",
    "purchase.solo_desc": "1–3 מחשבים. דסקטופ + ווב סטטי.",
    "purchase.studio_title": "סטודיו / עסק קטן",
    "purchase.studio_desc": "4–10 מחשבים. דסקטופ + ווב (50 אלף) + אפליקציה 1.",
    "purchase.business_title": "ביזנס / פרו",
    "purchase.business_desc": "11–25 מחשבים. דסקטופ + ווב (500 אלף) + 5 אפליקציות.",
    "purchase.select_styles": "בחירת משקלים",
    "purchase.all_styles": "כל המשקלים",
    "purchase.discount_note": "הנחה של 30% ברכישת 5 משקלים ומעלה",
    "purchase.buy_now": "רכישה",
    "purchase.full_family": "משפחה מלאה",
    "purchase.total": "סה״כ",
    "purchase.currency_toggle": "מטבע",
    "purchase.license_link": "תנאי הרישיון"
  }
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const userLang = navigator.language || (navigator as any).userLanguage;
    if (userLang && userLang.toLowerCase().includes("he")) {
      setLangState("he");
      document.documentElement.lang = "he";
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    document.documentElement.lang = newLang;
  };

  const t = (key: string) => DICTIONARY[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
