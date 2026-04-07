'use client';

import Link from 'next/link';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';

export default function Home() {
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary">
                Fiyat Casusu
              </Link>
            </div>
            <nav className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                title={isDarkMode ? 'Açık mod' : 'Karanlık mod'}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary">
                Giriş Yap
              </Link>
              <Link href="/register" className="btn-primary">
                Ücretsiz Dene
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-white dark:to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Rakiplerinizin Fiyatlarını
              <span className="text-primary"> Anlık İzleyin</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Trendyol, Hepsiburada, n11 ve Amazon TR&apos;den fiyat ve stok verilerini
              çekerek, KOBİ&apos;lerin rekabetçi kalmasını sağlayan güçlü bir fiyat izleme platformu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn-primary text-lg px-8 py-3">
                Ücretsiz Başlayın
              </Link>
              <Link href="#features" className="btn-secondary text-lg px-8 py-3">
                Özellikler
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Neler Sunuyoruz?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="card text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Gerçek Zamanlı İzleme</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tüm platformlardan anlık fiyat ve stok verileri
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Akıllı Alertler</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Fiyat değişimlerinde anında bildirim alın
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Detaylı Raporlar</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Fiyat trendlerini ve rakipleri analiz edin
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card text-center">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 dark:text-white">KVKK Uyumlu</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Türkiye yasalarına tam uyumlu veri işleme
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Desteklenen Platformlar
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
            En popüler e-ticaret platformlarından veri çekme
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md flex items-center justify-center">
              <span className="text-xl font-bold text-orange-500">Trendyol</span>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md flex items-center justify-center">
              <span className="text-xl font-bold text-orange-400">Hepsiburada</span>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md flex items-center justify-center">
              <span className="text-xl font-bold text-green-500">n11</span>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md flex items-center justify-center">
              <span className="text-xl font-bold text-orange-700">Amazon TR</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Hemen Başlayın
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Rakiplerinizin önüne geçin. 14 gün ücretsiz deneme, kredi kartı gerekmez.
          </p>
          <Link href="/register" className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
            Ücretsiz Deneyin
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Fiyat Casusu</h3>
              <p className="text-gray-400">
                KOBİ&apos;ler için e-ticaret fiyat izleme platformu
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platformlar</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Trendyol</li>
                <li>Hepsiburada</li>
                <li>n11</li>
                <li>Amazon TR</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Yasal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Gizlilik Politikası</li>
                <li>KVKK Aydınlatma</li>
                <li>Kullanım Şartları</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">İletişim</h4>
              <ul className="space-y-2 text-gray-400">
                <li>info@fiyatcasusu.com</li>
                <li>+90 212 123 45 67</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            © 2024 Fiyat Casusu. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>
  );
}