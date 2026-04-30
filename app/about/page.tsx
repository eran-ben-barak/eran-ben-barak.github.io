import { Metadata } from "next";
import { AboutClient } from "./AboutClient";

export const metadata: Metadata = {
  title: "About | Eran Ben Barak",
  description: "Learn more about Eran Ben Barak, an independent type and graphic designer specializing in custom typefaces, logotypes, and branding.",
  openGraph: {
    title: "About | Eran Ben Barak",
    description: "Learn more about Eran Ben Barak, an independent type and graphic designer.",
    url: "https://eranbenbarak.com/about",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
