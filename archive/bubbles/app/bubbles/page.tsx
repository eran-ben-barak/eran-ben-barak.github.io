import BubblesClient from "./BubblesClient";

export const metadata = {
  title: "Bubbles | Tool Box",
  description: "Dynamic bubble typography composer.",
};

export default function BubblesPage() {
  return (
    <div style={{ marginTop: '0', height: 'calc(100vh - 40px)', overflow: 'hidden' }}>
      <BubblesClient />
    </div>
  );
}
