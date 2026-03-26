"use client";

import { useLanguage } from "../../../context/LanguageContext";

export default function LicensePage() {
  const { lang } = useLanguage();
  return (
    <div 
      dir={lang === "he" ? "rtl" : "ltr"}
      style={{ maxWidth: "800px", margin: "0 auto", padding: "8rem 2rem" }}
    >
      <LicenseContent lang={lang} />
    </div>
  );
}

function LicenseContent({ lang }: { lang: string }) {
  if (lang === "he") {
    return (
      <article className="text-editorial" style={{ lineHeight: "1.7", textAlign: "right" }}>
        <h1 className="page-title" style={{ fontSize: "2.5rem", marginBottom: "3rem" }}>מדריך רישוי</h1>
        
        <p style={{ marginBottom: "2.5rem" }}>
          פונטים הם סוג מיוחד של תוכנה. כשרוכשים ממני פונט, אתם למעשה רוכשים רישיון להשתמש בו בעבודה שלכם. המדריך הזה מסביר איך הרישוי שלי עובד בשפה פשוטה, כדי שתוכלו לבחור את סוג הרישיון המתאים לצרכים שלכם.
        </p>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2 className="text-meta" style={{ marginBottom: "1.2rem", opacity: 0.5 }}>הבסיס</h2>
          <p>
            כל הרישיונות שלי הם לצמיתות (Perpetual) וכלל-עולמיים. זה אומר שברגע שקניתם פונט, תוכלו להשתמש בו לנצח במספר בלתי מוגבל של פרויקטים, כל עוד הם עומדים במגבלות של רמת הרישיון שרכשתם.
          </p>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2 className="text-meta" style={{ marginBottom: "1.2rem", opacity: 0.5 }}>מה מותר לעשות עם הרישיון</h2>
          <ul style={{ paddingInlineStart: "1.5rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            <li><strong>שימוש רחב:</strong> שימוש בפונטים ללוגואים, מיתוג, פוסטרים, ספרים, רשתות חברתיות ופרסום.</li>
            <li><strong>מחשבים:</strong> רישיון סולו (Solo) בסיסי מכסה התקנה על עד 3 מכשירים. אם אתם צוות גדול יותר, ניתן לבחור סוג רישיון גבוהה יותר במעמד הרכישה.</li>
            <li><strong>שותפים חיצוניים:</strong> ניתן לשתף את קבצי הפונט באופן זמני עם בית דפוס או מפתח עבור עבודה על הפרויקטים שלכם בלבד. רק בקשו מהם למחוק את הקבצים לאחר סיום העבודה!</li>
            <li><strong>הטמעה ברשת:</strong> ברכישת רישיון סטודיו או ביזנס, ניתן להטמיע את הפונטים באתרים שלכם (Self-hosting) באמצעות @font-face עד למגבלת התעבורה של רמת הרישיון.</li>
          </ul>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2 className="text-meta" style={{ marginBottom: "1.2rem", opacity: 0.5 }}>תמיכה ושקט נפשי</h2>
          <p>
            חשוב לי שתיהנו מהשימוש בפונטים. אם נתקלתם בבאג טכני או שיש לכם שאלה לגבי השימוש בהם, אעשה את כל מה שאוכל כדי לעזור ולתת מענה.
          </p>
        </section>

        <div style={{ marginTop: "5rem", borderTop: "1.5px solid var(--border-color)", paddingTop: "2rem" }}>
          <p style={{ opacity: 0.7 }}>
            * הסכם הרישיון המלא והמחייב (EULA) יצורף כקובץ PDF לחבילת הפונטים שלכם.
          </p>
          <p style={{ marginTop: "2rem", opacity: 0.8 }}>
            שאלות? תמיד שמח לדבר: <strong>info@eranbenbarak.com</strong>.
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="text-editorial" style={{ lineHeight: "1.7" }}>
      <h1 className="page-title" style={{ fontSize: "2.5rem", marginBottom: "3rem" }}>Licensing Guide</h1>
      
      <p style={{ marginBottom: "2.5rem" }}>
        Fonts are a specialized kind of software. When you buy a font from me, you’re purchasing a license to use it in your work. This guide explains how my licensing works in plain English, so you can choose the right tier for your needs.
      </p>

      <section style={{ marginBottom: "2.5rem" }}>
        <h2 className="text-meta" style={{ marginBottom: "1.2rem", opacity: 0.5 }}>The Basics</h2>
        <p>
          All my licenses are <strong>perpetual</strong> and <strong>worldwide</strong>. This means once you buy a font, you can use it forever for as many projects as you like, as long as they fall within your license tier’s limits.
        </p>
      </section>

      <section style={{ marginBottom: "2.5rem" }}>
        <h2 className="text-meta" style={{ marginBottom: "1.2rem", opacity: 0.5 }}>What You’re Licensed to Do</h2>
        <ul style={{ paddingInlineStart: "1.5rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <li><strong>Universal Usage:</strong> Use the fonts for logos, branding, posters, books, social media, and advertising.</li>
          <li><strong>Workstations:</strong> A standard Solo license covers installation on up to <strong>3 devices</strong>. If you’re a larger team, simply select a higher tier at checkout.</li>
          <li><strong>External Partners:</strong> You can temporarily share the font files with a printer or a developer strictly for work on your projects. Just ask them to delete the files once they’re done!</li>
          <li><strong>Web Embedding:</strong> If you purchase a Studio or Business tier, you’re licensed to self-host the fonts via @font-face on your own websites.</li>
        </ul>
      </section>

      <section style={{ marginBottom: "2.5rem" }}>
        <h2 className="text-meta" style={{ marginBottom: "1.2rem", opacity: 0.5 }}>Support & Peace of Mind</h2>
        <p>
          I want you to enjoy using these fonts. If you encounter a technical bug or have a question about how you can use the type, I’ll do my absolute best to help you out and provide a fix.
        </p>
      </section>

      <div style={{ marginTop: "5rem", borderTop: "1.5px solid var(--border-color)", paddingTop: "2rem" }}>
        <p style={{ opacity: 0.7 }}>
          * The formal, binding End User License Agreement (EULA) will be included as a PDF in your font package.
        </p>
        <p style={{ marginTop: "2rem", opacity: 0.8 }}>
          Questions? I’m always happy to chat: <strong>info@eranbenbarak.com</strong>.
        </p>
      </div>
    </article>
  );
}
