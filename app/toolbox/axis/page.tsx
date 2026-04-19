import { Metadata } from 'next';
import AxisClient from './AxisClient';

export const metadata: Metadata = {
  title: 'Axis | Tool Box',
  description: 'Variable font tester and looping video exporter',
};

export default function AxisPage() {
  return (
    <main style={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      <AxisClient />
    </main>
  );
}
