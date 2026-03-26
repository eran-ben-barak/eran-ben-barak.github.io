"use client";

import { useLanguage } from "../../../context/LanguageContext";

export default function TermsPage() {
  const { lang } = useLanguage();
  return (
    <div 
      dir={lang === "he" ? "rtl" : "ltr"}
      style={{ maxWidth: "800px", margin: "0 auto", padding: "8rem 2rem" }}
    >
      <TermsContent lang={lang} />
    </div>
  );
}

function TermsContent({ lang }: { lang: string }) {
  if (lang === "he") {
    return (
      <article className="text-editorial" style={{ lineHeight: "1.7", textAlign: "right" }}>
        <h1 className="page-title" style={{ fontSize: "2.5rem", marginBottom: "3rem" }}>תנאי שימוש</h1>
        
        <p style={{ marginBottom: "2.5rem" }}>
          השימוש באתר זה ורכישת פונטים כפופים לתנאים המפורטים להלן.
        </p>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2 className="text-meta" style={{ marginBottom: "1.2rem", opacity: 0.5 }}>שימוש באתר</h2>
          <p>
            האתר מיועד להצגת עומות המעצב ולרכישת רישיונות לשימוש בפונטים. אין לעשות שימוש באתר למטרות בלתי חוקיות או פוגעניות.
          </p>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2 className="text-meta" style={{ marginBottom: "1.2rem", opacity: 0.5 }}>קניין רוחני</h2>
          <p>
            כל העיצובים, הפונטים, התיאורים והתוכן באתר זה הם קניינו הרוחני של ערן בן ברק (או שותפיו). רכישת פונט מעניקה לכם רישיון שימוש בלבד, ולא בעלות על הפונט עצמו.
          </p>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2 className="text-meta" style={{ marginBottom: "1.2rem", opacity: 0.5 }}>רישוי פונטים</h2>
          <p>
            השימוש בפונטים שנרכשו כפוף להסכם הרישיון (EULA) ולמדריך הרישוי המפורסם באתר. הפרה של תנאי הרישיון עלולה להביא לביטולו ולצעדים משפטיים.
          </p>
        </section>

        <div style={{ marginTop: "5rem", borderTop: "1.5px solid var(--border-color)", paddingTop: "2rem" }}>
          <p style={{ marginTop: "2rem", opacity: 0.8 }}>
            שאלות? <strong>info@eranbenbarak.com</strong>.
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="text-editorial" style={{ lineHeight: "1.7" }}>
      <h1 className="page-title" style={{ fontSize: "2.5rem", marginBottom: "3rem" }}>Terms of Service</h1>
      
      <p style={{ marginBottom: "2.5rem" }}>
        The use of this website and the purchase of fonts are subject to the following terms and conditions.
      </p>

      <section style={{ marginBottom: "2.5rem" }}>
        <h2 className="text-meta" style={{ marginBottom: "1.2rem", opacity: 0.5 }}>Website Usage</h2>
        <p>
          This website is intended for showcasing design work and purchasing font licenses. Unauthorized use of the site for illegal or harmful purposes is prohibited.
        </p>
      </section>

      <section style={{ marginBottom: "2.5rem" }}>
        <h2 className="text-meta" style={{ marginBottom: "1.2rem", opacity: 0.5 }}>Intellectual Property</h2>
        <p>
          All designs, fonts, descriptions, and content on this website are the intellectual property of Eran Ben Barak (or collaborators). Purchasing a font grants you a usage license, not ownership of the font software itself.
        </p>
      </section>

      <section style={{ marginBottom: "2.5rem" }}>
        <h2 className="text-meta" style={{ marginBottom: "1.2rem", opacity: 0.5 }}>Font Licensing</h2>
        <p>
          The usage of purchased fonts is governed by the End User License Agreement (EULA) and the Licensing Guide available on this site. Violation of these terms may result in license termination and legal action.
        </p>
      </section>

      <div style={{ marginTop: "5rem", borderTop: "1.5px solid var(--border-color)", paddingTop: "2rem" }}>
        <p style={{ marginTop: "2rem", opacity: 0.8 }}>
          Questions? Contact: <strong>info@eranbenbarak.com</strong>.
        </p>
      </div>
    </article>
  );
}
