import { Metadata } from "next";
import { DesignsClient } from "./DesignsClient";

export const metadata: Metadata = {
  title: "Graphic Design & Branding Projects | Eran Ben Barak",
  description: "A showcase of graphic design, branding, and visual language projects by Eran Ben Barak, including Manofim, Sticky, and The Turing Defense.",
  openGraph: {
    title: "Graphic Design & Branding Projects | Eran Ben Barak",
    description: "A showcase of graphic design, branding, and visual language projects by Eran Ben Barak.",
    url: "https://eranbenbarak.com/designs",
  },
};

export default function DesignsPage() {
  return <DesignsClient />;
}
