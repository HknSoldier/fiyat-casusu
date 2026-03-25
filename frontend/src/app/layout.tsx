import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fiyat Casusu - KOBİ E-Ticaret Fiyat İzleme',
  description: 'Trendyol, Hepsiburada, n11 ve Amazon TR\'den fiyat ve stok izleme',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}