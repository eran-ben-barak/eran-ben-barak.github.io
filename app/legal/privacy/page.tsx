"use client";

import { useLanguage } from "../../../context/LanguageContext";

export default function PrivacyPage() {
  const { lang } = useLanguage();
  return (
    <div 
      dir={lang === "he" ? "rtl" : "ltr"}
      style={{ maxWidth: "800px", margin: "0 auto", padding: "8rem 2rem" }}
    >
      <PrivacyContent lang={lang} />
    </div>
  );
}

function PrivacyContent({ lang }: { lang: string }) {
  if (lang === "he") {
    return (
      <article className="text-editorial" style={{ lineHeight: "1.7", textAlign: "right" }}>
        <h1 className="page-title" style={{ fontSize: "2.5rem", marginBottom: "3rem" }}>מדיניות פרטיות</h1>
        
        <p style={{ marginBottom: "2.5rem" }}>
          הפרטיות שלכם חשובה לי. מסמך זה מסביר איזה מידע נאסף בעת השימוש באתר וברכישת פונטים.
        </p>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2 className="text-meta" style={{ marginBottom: "1.2rem", opacity: 0.5 }}>איסוף מידע</h2>
          <p>
            בעת רכישת פונט, אתם מתבקשים לספק שם וכתובת אימייל. מידע זה משמש אך ורק למשלוח קבצי הפונט, עדכונים טכניים עתידיים ואימות הרישיון שלכם.
          </p>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2 className="text-meta" style={{ marginBottom: "1.2rem", opacity: 0.5 }}>עיבוד תשלומים</h2>
          <p>
            התשלומים באתר מעובדים על ידי Lemon Squeezy. אין לי גישה לפרטי כרטיס האשראי או לאמצעי התשלום שלכם. פרטים אלו נשמרים בצורה מאובטחת על ידי ספק התשלומים בלבד.
          </p>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2 className="text-meta" style={{ marginBottom: "1.2rem", opacity: 0.5 }}>עוגיות (Cookies)</h2>
          <p>
            האתר משתמש בעוגיות בסיסיות לצורך תפקוד תקין, כגון שמירת העדפות שפה. אינני משתמש בעוגיות לצורכי פרסום או מעקב צד ג'.
          </p>
        </section>

        <div style={{ marginTop: "5rem", borderTop: "1.5px solid var(--border-color)", paddingTop: "2rem" }}>
          <p style={{ marginTop: "2rem", opacity: 0.8 }}>
            שאלות לגבי הפרטיות שלכם? מוזמנים ליצור קשר: <strong>info@eranbenbarak.com</strong>.
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="text-editorial" style={{ lineHeight: "1.7" }}>
      <h1 className="page-title" style={{ fontSize: "2.5rem", marginBottom: "3rem" }}>Privacy Policy</h1>
      
      <p style={{ marginBottom: "2.5rem" }}>
        Your privacy is important to me. This document explains what information is collected when you use this website and purchase fonts.
      </p>

      <section style={{ marginBottom: "2.5rem" }}>
        <h2 className="text-meta" style={{ marginBottom: "1.2rem", opacity: 0.5 }}>Information Collection</h2>
        <p>
          When you purchase a font, you provide your name and email address. This information is used strictly for delivering the font files, future technical updates, and verifying your license.
        </p>
      </section>

      <section style={{ marginBottom: "2.5rem" }}>
        <h2 className="text-meta" style={{ marginBottom: "1.2rem", opacity: 0.5 }}>Payment Processing</h2>
        <p>
          Payments are processed through Lemon Squeezy. I do not have access to your credit card details or payment method. This information is securely handled by the payment processor.
        </p>
      </section>

      <section style={{ marginBottom: "2.5rem" }}>
        <h2 className="text-meta" style={{ marginBottom: "1.2rem", opacity: 0.5 }}>Cookies</h2>
        <p>
          This website uses basic cookies for core functionality, such as remembering your language preference. I do not use cookies for advertising or third-party tracking.
        </p>
      </section>

      <div style={{ marginTop: "5rem", borderTop: "1.5px solid var(--border-color)", paddingTop: "2rem" }}>
        <p style={{ marginTop: "2rem", opacity: 0.8 }}>
          Questions about your privacy? Feel free to reach out: <strong>info@eranbenbarak.com</strong>.
        </p>
      </div>
    </article>
  );
}
