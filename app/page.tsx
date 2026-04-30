import { Metadata } from "next";
import { HomeClient } from "./HomeClient";

export const metadata: Metadata = {
  title: "Eran Ben Barak | Type Design & Graphic Artist",
  description: "An independent type and graphic designer. Specializing in custom typefaces, logotypes, and branding.",
  openGraph: {
    title: "Eran Ben Barak | Type Design & Graphic Artist",
    description: "An independent type and graphic designer. Specializing in custom typefaces, logotypes, and branding.",
    url: "https://eranbenbarak.com",
  },
};

export default function Home() {
  return <HomeClient />;
}
