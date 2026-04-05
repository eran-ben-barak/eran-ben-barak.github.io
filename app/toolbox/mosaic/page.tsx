import MosaicClient from './MosaicClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mosaic | Eran Ben Barak',
  description: 'Merge two images in a smooth animated tile mosaic',
};

export default function MosaicPage() {
  return (
    <div style={{ marginTop: '0', height: 'calc(100vh - 40px)', overflow: 'hidden' }}>
      <MosaicClient />
    </div>
  );
}
