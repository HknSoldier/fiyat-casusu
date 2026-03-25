'use client';

import Link from 'next/link';

const plans = [
  {
    name: 'Başlangıç',
    price: '0',
    description: 'Küçük işletmeler için ideal başlangıç',
    features: [
      '10 ürün takibi',
      'Günde 1 fiyat güncelleme',
      'Trendyol entegrasyonu',
      'E-posta bildirimleri',
      'Temel analitik',
    ],
    cta: 'Ücretsiz Başla',
    href: '/register',
    highlight: false,
  },
  {
    name: 'Aylık Pro',
    price: '299',
    description: 'Büyüyen işletmeler için',
    features: [
      '100 ürün takibi',
      'Saatlik fiyat güncelleme',
      'Tüm platformlar (4)',
      'Öncelikli destek',
      'Gelişmiş analitik',
      'Raporlama',
      'API erişimi',
    ],
    cta: 'Aylık Plan Al',
    href: 'https://www.shopier.com/44979095',
    highlight: true,
  },
  {
    name: 'Yıllık VIP',
    price: '2.499',
    description: 'Profesyonel çözüm',
    features: [
      'Sınırsız ürün takibi',
      'Gerçek zamanlı güncelleme',
      'Tüm platformlar + özel',
      '7/24 destek',
      'Özel entegrasyonlar',
      'Öncelikli scraper',
      'Kurumsal raporlama',
      'Dedicated account manager',
    ],
    cta: 'VIP Plan Al',
    href: 'https://www.shopier.com/44979327',
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Fiyat Casusu Fiyatlandırma
          </h1>
          <p className="text-xl text-gray-600">
            İşinize uygun planı seçin ve rakiplerinizi takip edin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl shadow-lg p-8 ${
                plan.highlight ? 'ring-2 ring-primary transform scale-105' : ''
              }`}
            >
              {plan.highlight && (
                <div className="text-center mb-4">
                  <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                    En Popüler
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900">₺{plan.price}</span>
                  {plan.price !== '0' && (
                    <span className="text-gray-500 ml-2">
                      {plan.price === '2.499' ? '/yıl' : '/ay'}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                target={plan.href.startsWith('http') ? '_blank' : undefined}
                rel={plan.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`block w-full text-center py-3 rounded-lg font-medium transition-colors ${
                  plan.highlight
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Özel ihtiyaçlarınız mı var?{' '}
            <Link href="mailto:info@fiyatcasusu.com" className="text-primary font-medium">
              Bizimle iletişime geçin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
