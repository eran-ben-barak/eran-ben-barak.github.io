import { Metadata } from "next";
import { useLanguage } from "../../../context/LanguageContext";

export const metadata: Metadata = {
  title: "Font License Agreement | Eran Ben Barak",
  description: "Standard End User License Agreement (EULA) for Eran Ben Barak fonts.",
};

export default function LicensePage() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "8rem 2rem" }}>
      <LicenseContent />
    </div>
  );
}

function LicenseContent() {
  return (
    <article className="text-editorial" style={{ lineHeight: "1.6" }}>
      <h1 className="page-title" style={{ fontSize: "2.5rem", marginBottom: "3rem" }}>Font License Agreement (EULA)</h1>
      
      <p style={{ marginBottom: "2rem" }}>
        Hey! Thanks for choosing a font from <strong>Eran Ben Barak</strong>. This agreement is simple, friendly, and binding. 
        It gives you the right to use the font while protecting the work that went into it.
      </p>

      <section style={{ marginBottom: "2rem" }}>
        <h2 className="text-meta" style={{ marginBottom: "1rem", opacity: 0.5 }}>What You CAN Do</h2>
        <ul style={{ paddingInlineStart: "1.5rem" }}>
          <li><strong>Design Work:</strong> Use the font for logos, branding, posters, packaging, books, and ads.</li>
          <li><strong>Social Media:</strong> Use it for all your static posts and banners.</li>
          <li><strong>Video:</strong> Use it for titles and motion graphics in your videos.</li>
          <li><strong>Web (Studio/Business Tiers):</strong> Embed the font on your website as a "live font" up to your tier’s view limit.</li>
          <li><strong>Apps (Studio/Business Tiers):</strong> Embed the font files in your mobile or desktop applications.</li>
        </ul>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 className="text-meta" style={{ marginBottom: "1rem", opacity: 0.5 }}>What You CANNOT Do</h2>
        <ul style={{ paddingInlineStart: "1.5rem" }}>
          <li><strong>Don't Share:</strong> Please don't give the font files to colleagues or clients who aren't covered by your seats. They should buy their own copy!</li>
          <li><strong>Don't Resell:</strong> You can't resell, lease, or redistribute the font files themselves.</li>
          <li><strong>No AI Training:</strong> You are strictly prohibited from using these font files or their shapes to train AI models or generative algorithms.</li>
          <li><strong>No Reverse Engineering:</strong> Don't modify the code of the font files or convert them into other formats without permission.</li>
        </ul>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 className="text-meta" style={{ marginBottom: "1rem", opacity: 0.5 }}>The Fine Print</h2>
        <ul style={{ paddingInlineStart: "1.5rem" }}>
          <li><strong>Ownership:</strong> The intellectual property and copyright remain with Eran Ben Barak.</li>
          <li><strong>Warranty:</strong> The font is provided "as is". If you find a technical bug, let me know and I'll do my best to fix it!</li>
          <li><strong>Termination:</strong> If you break these rules, the license is terminated.</li>
        </ul>
      </section>

      <p style={{ marginTop: "4rem", opacity: 0.7 }}>
        Questions? Need an upgrade? Drop me a line at <strong>info@eranbenbarak.com</strong>.
      </p>
      
      <p style={{ marginTop: "1rem" }}>
        <strong>Enjoy your new type!</strong><br />
        Eran Ben Barak
      </p>
    </article>
  );
}
