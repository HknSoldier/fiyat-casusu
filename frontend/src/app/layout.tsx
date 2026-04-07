import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

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
    <html lang="tr" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-900">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}