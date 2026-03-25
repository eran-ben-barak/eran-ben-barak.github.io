"use client";

import { use } from "react";
import TypeTester from "../../../components/TypeTester";
import FontSpecimenDisplay from "../../../components/FontSpecimenDisplay";
import PageTransition from "../../../components/PageTransition";

type WeightEntry = { weight: number; label: string; italic?: boolean; italicAngle?: number };

type FontConfig = {
  name: string;
  family: string;
  defaultText: string;
  sampleText: string;
  category: string;
  script: string;
  year: string;
  weights: WeightEntry[];
  charset: {
    uppercase?: string;
    lowercase?: string;
    numerals?: string;
    punctuation?: string;
    hebrew?: string;
  };
  features: string[];
  featureShowcase?: { feature: string; before: string; after: string }[];
  themedContent?: { text: string; footnote: string }[];
  hebrewThemedContent?: { text: string; footnote: string }[];
  aboutInfo?: string;
  hebrewAboutInfo?: string;
  hebrewName?: string;
  isVariable?: boolean;
  variableAxes?: { axis: string; min: number; max: number; default: number }[];
  tags: string[];
  testerSizes?: number[];
};

export function FontPageClient({ slug, font }: { slug: string; font: FontConfig | undefined }) {
  if (slug === "skolar-sans-hebrew") {
    return (
      <section style={{ textAlign: "center", marginTop: "4rem" }}>
        <h1 className="page-title">Redirecting...</h1>
        <p className="page-subtitle">This font is available at Rosetta Type.</p>
        <script dangerouslySetInnerHTML={{ __html: 'window.location.href="https://www.rosettatype.com/SkolarSansHebrew";' }} />
      </section>
    );
  }

  if (!font) {
    return (
      <section style={{ textAlign: "center", marginTop: "4rem" }}>
        <h1 className="page-title">Font Not Found.</h1>
        <p className="page-subtitle">We couldn&apos;t locate this typeface.</p>
      </section>
    );
  }

  return (
    <PageTransition>
      <FontSpecimenDisplay font={font} />
    </PageTransition>
  );
}
