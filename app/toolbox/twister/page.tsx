import MobiusRibbonClient from './MobiusRibbonClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Twister | Eran Ben Barak',
  description: 'Typography mapped onto continuous undulating 3D ribbons',
};

export default function MobiusRibbonPage() {
  return (
    <div style={{ marginTop: '0', height: 'calc(100vh - 40px)', overflow: 'hidden' }}>
      <MobiusRibbonClient />
    </div>
  );
}
