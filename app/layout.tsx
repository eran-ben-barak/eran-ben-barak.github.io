import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./fonts.css";
import { GoogleAnalytics } from '@next/third-parties/google';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://eranbenbarak.com'),
  title: "Eran Ben Barak | Type & Graphic Designer",
  description: "An independent type and graphic designer. Specializing in custom typefaces, logotypes, and branding.",
  keywords: ["Type Design", "Foundry", "Typography", "Graphic Design", "Branding", "Hebrew Type", "Latin Type", "Eran Ben Barak"],
  authors: [{ name: "Eran Ben Barak" }],
  openGraph: {
    title: "Eran Ben Barak | Type & Graphic Designer",
    description: "An independent type and graphic designer. Specializing in custom typefaces, logotypes, and branding.",
    url: "https://eranbenbarak.com",
    siteName: "Eran Ben Barak",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eran Ben Barak | Type & Graphic Designer",
    description: "An independent type and graphic designer. Specializing in custom typefaces, logotypes, and branding.",
    images: ["/icon.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icon.png",
  },
};

import { LanguageProvider } from "../context/LanguageContext";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import AnimatedGrid from "../components/AnimatedGrid";
import TransitionProvider from "../components/TransitionProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AnimatedGrid />
        <LanguageProvider>
          <div className="site-wrapper">
            <SiteHeader />
            <main className="site-main">
              <TransitionProvider>
                {children}
              </TransitionProvider>
            </main>
            <SiteFooter />
          </div>
        </LanguageProvider>
      </body>
      <GoogleAnalytics gaId="G-Q1BEJC8BC5" />
    </html>
  );
}
