"use client";

import { useLanguage } from "../../../context/LanguageContext";

export default function RefundPage() {
  const { lang } = useLanguage();
  return (
    <div 
      dir={lang === "he" ? "rtl" : "ltr"}
      style={{ maxWidth: "800px", margin: "0 auto", padding: "8rem 2rem" }}
    >
      <RefundContent lang={lang} />
    </div>
  );
}

function RefundContent({ lang }: { lang: string }) {
  if (lang === "he") {
    return (
      <article className="text-editorial" style={{ lineHeight: "1.7", textAlign: "right" }}>
        <h1 className="page-title" style={{ fontSize: "2.5rem", marginBottom: "3rem" }}>מדיניות החזרים</h1>
        
        <p style={{ marginBottom: "2.5rem" }}>
          הפונטים נמכרים כקבצים דיגיטליים הניתנים להורדה מיידית. בשל אופיים המיוחד של מוצרים אלו, המדיניות שלי היא כדלקמן:
        </p>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2 className="text-meta" style={{ marginBottom: "1.2rem", opacity: 0.5 }}>אין החזרים</h2>
          <p>
            מרגע שהושלמה הרכישה וקבצי הפונט נשלחו או הורדו, לא ניתן לבטל את העסקה או לקבל החזר כספי. הפונטים אינם מוצרים שניתן "להחזיר" במובן הפיזי. 
          </p>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2 className="text-meta" style={{ marginBottom: "1.2rem", opacity: 0.5 }}>בדיקה לפני רכישה</h2>
          <p>
            אני ממליץ בחום להשתמש ב"טסטר" האינטראקטיבי המופיע בדפי הפונטים כדי לבדוק את התאמת הפונט לצרכים שלכם לפני הרכישה. תוכלו להקליד טקסט משלכם ולראות את כל התווים והמשקלים.
          </p>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2 className="text-meta" style={{ marginBottom: "1.2rem", opacity: 0.5 }}>תמיכה טכנית</h2>
          <p>
            אם נתקלתם בבעיה טכנית בקבצים או שהם אינם פועלים כראוי, אשמח לעזור ולספק קבצים תקינים. במקרה של תקלה טכנית שלא ניתנת לפתרון, אבחן כל מקרה לגופו.
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
      <h1 className="page-title" style={{ fontSize: "2.5rem", marginBottom: "3rem" }}>Refund Policy</h1>
      
      <p style={{ marginBottom: "2.5rem" }}>
        Fonts are sold as digital files that are available for immediate download. Due to the nature of these products, my refund policy is as follows:
      </p>

      <section style={{ marginBottom: "2.5rem" }}>
        <h2 className="text-meta" style={{ marginBottom: "1.2rem", opacity: 0.5 }}>No Refunds</h2>
        <p>
          Once a purchase is completed and the font files have been delivered or downloaded, all sales are final. I do not offer refunds or exchanges for digital software products.
        </p>
      </section>

      <section style={{ marginBottom: "2.5rem" }}>
        <h2 className="text-meta" style={{ marginBottom: "1.2rem", opacity: 0.5 }}>Try Before You Buy</h2>
        <p>
          I strongly encourage you to use the interactive testers available on each font page to test the typeface with your own content before making a purchase.
        </p>
      </section>

      <section style={{ marginBottom: "2.5rem" }}>
        <h2 className="text-meta" style={{ marginBottom: "1.2rem", opacity: 0.5 }}>Technical Support</h2>
        <p>
          If you encounter a technical issue with the font files or if they do not function as expected, I am happy to provide support and replacement files. In the case of an unresolvable technical fault, a refund may be considered at my sole discretion.
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
