import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Font License Agreement | Eran Ben Barak",
  description: "Standard End User License Agreement (EULA) for Eran Ben Barak fonts.",
};

export default function LicenseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
