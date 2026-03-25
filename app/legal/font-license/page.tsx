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
    <article className="text-editorial" style={{ lineHeight: "1.7" }}>
      <h1 className="page-title" style={{ fontSize: "2.5rem", marginBottom: "3rem" }}>Font License Agreement (EULA)</h1>
      
      <p style={{ marginBottom: "2.5rem" }}>
        This End User License Agreement (EULA) is a legal agreement between you and <strong>Eran Ben Barak</strong>. 
        By downloading, installing, or using the Font Software, you confirm that you have read, understood, and agree to be bound by the terms of this agreement.
      </p>

      <section style={{ marginBottom: "2.5rem" }}>
        <h2 className="text-meta" style={{ marginBottom: "1.2rem", opacity: 0.5 }}>1. The License</h2>
        <p>
          This is a non-exclusive, non-transferable, and <strong>perpetual</strong> license. You are not purchasing the copyright to the design of the fonts, but rather the right to use the Font Software according to the terms of your purchased license tier.
        </p>
      </section>

      <section style={{ marginBottom: "2.5rem" }}>
        <h2 className="text-meta" style={{ marginBottom: "1.2rem", opacity: 0.5 }}>2. Permitted Usage</h2>
        <ul style={{ paddingInlineStart: "1.5rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <li><strong>Installation:</strong> You may install the font on up to <strong>3 devices</strong> (for Solo/Freelance tier) or the number of seats specified in your invoice.</li>
          <li><strong>Commercial Work:</strong> Use the fonts for logos, branding, print, social media, packaging, and advertising.</li>
          <li><strong>Third Parties:</strong> You may provide the Font Software to a printer, developer, or other service provider strictly for the production of your own work. They must delete the files once the project is complete.</li>
          <li><strong>Web (Studio & Business Tiers):</strong> Self-host the fonts using @font-face on your registered domains up to the traffic limit of your tier.</li>
        </ul>
      </section>

      <section style={{ marginBottom: "2.5rem" }}>
        <h2 className="text-meta" style={{ marginBottom: "1.2rem", opacity: 0.5 }}>3. Prohibited Usage</h2>
        <ul style={{ paddingInlineStart: "1.5rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <li><strong>No Distribution:</strong> You may not share, lend, rent, or resell the Font Software to any third party not covered by this license.</li>
          <li><strong>No AI Training:</strong> You are strictly prohibited from using the Font Software, the letterforms, or the underlying data to train machine learning models, neural networks, or generative AI algorithms.</li>
          <li><strong>No Modification:</strong> You may not rename, modify, or decompile the Font Software. For custom modifications or additional script support, please contact the foundry.</li>
        </ul>
      </section>

      <section style={{ marginBottom: "2.5rem" }}>
        <h2 className="text-meta" style={{ marginBottom: "1.2rem", opacity: 0.5 }}>4. Ownership & Liability</h2>
        <ul style={{ paddingInlineStart: "1.5rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <li><strong>Intellectual Property:</strong> Eran Ben Barak retains all rights, titles, and intellectual property in the Font Software.</li>
          <li><strong>Disclaimer:</strong> The Font Software is provided "as is" without warranty of any kind. Licensor is not liable for any damages resulting from the use of the software.</li>
          <li><strong>Jurisdiction:</strong> This agreement is governed by the laws of <strong>Israel</strong>.</li>
        </ul>
      </section>

      <div style={{ marginTop: "5rem", borderTop: "1.5px solid var(--border-color)", paddingTop: "2rem" }}>
        <p style={{ opacity: 0.7 }}>
          Questions or need a license upgrade? Please contact <strong>info@eranbenbarak.com</strong>.
        </p>
        <p style={{ marginTop: "1.5rem", fontWeight: 500 }}>
          Enjoy your new type!<br />
          Eran Ben Barak
        </p>
      </div>
    </article>
  );
}
