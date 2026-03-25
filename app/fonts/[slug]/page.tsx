import { Metadata } from "next";
import { FONT_DATA } from "./data";
import { FontPageClient } from "./FontPageClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const font = FONT_DATA[slug];

  if (!font) {
    return {
      title: "Font Not Found | Eran Ben Barak",
    };
  }

  const title = `${font.name} | ${font.category} Typeface | Eran Ben Barak`;
  const description = font.aboutInfo || `Explore ${font.name}, a ${font.category} typeface designed by Eran Ben Barak.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://eranbenbarak.com/fonts/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function FontPage({ params }: Props) {
  const { slug } = await params;
  const font = FONT_DATA[slug];

  return <FontPageClient slug={slug} font={font} />;
}
