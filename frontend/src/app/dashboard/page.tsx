'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Users, TrendingUp, AlertTriangle, ArrowUp, ArrowDown, Clock } from 'lucide-react';

interface DashboardStats {
  totalProducts: number;
  activeCompetitors: number;
  priceChanges24h: number;
  activeAlerts: number;
}

interface RecentAlert {
  id: string;
  type: string;
  productName: string;
  message: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    activeCompetitors: 0,
    priceChanges24h: 0,
    activeAlerts: 0,
  });
  const [recentAlerts, setRecentAlerts] = useState<RecentAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data for demonstration
    setStats({
      totalProducts: 24,
      activeCompetitors: 8,
      priceChanges24h: 12,
      activeAlerts: 3,
    });
    setRecentAlerts([
      {
        id: '1',
        type: 'price_drop',
        productName: 'Samsung Galaxy S24',
        message: 'Fiyat düşüşü: 12%',
        createdAt: '2 saat önce',
      },
      {
        id: '2',
        type: 'stock_out',
        productName: 'iPhone 15 Pro',
        message: 'Stok tükendi',
        createdAt: '5 saat önce',
      },
      {
        id: '3',
        type: 'competitor_add',
        productName: 'MacBook Air M3',
        message: 'Yeni rakip eklendi',
        createdAt: '1 gün önce',
      },
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Toplam Ürün',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      change: '+5 bu hafta',
    },
    {
      title: 'Aktif Rakipler',
      value: stats.activeCompetitors,
      icon: Users,
      color: 'bg-purple-500',
      change: '+2 bu ay',
    },
    {
      title: 'Fiyat Değişimi (24s)',
      value: stats.priceChanges24h,
      icon: TrendingUp,
      color: 'bg-green-500',
      change: '12 artış',
    },
    {
      title: 'Aktif Uyarılar',
      value: stats.activeAlerts,
      icon: AlertTriangle,
      color: 'bg-orange-500',
      change: '3 okunmadı',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Fiyat izleme durumunuzun özeti</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.title} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-2">{stat.change}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Son Uyarılar</h2>
            <Link href="/dashboard/alerts" className="text-primary text-sm hover:underline">
              Tümünü gör
            </Link>
          </div>
          <div className="space-y-4">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {alert.type === 'price_drop' ? (
                    <ArrowDown className="w-5 h-5 text-green-500" />
                  ) : alert.type === 'price_increase' ? (
                    <ArrowUp className="w-5 h-5 text-red-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium">{alert.productName}</p>
                  <p className="text-sm text-gray-600">{alert.message}</p>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {alert.createdAt}
                </div>
              </div>
            ))}
            {recentAlerts.length === 0 && (
              <p className="text-gray-500 text-center py-4">Henüz uyarı yok</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Hızlı İşlemler</h2>
          <div className="space-y-3">
            <Link
              href="/dashboard/products"
              className="flex items-center p-4 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <Package className="w-5 h-5 text-primary mr-3" />
              <div>
                <p className="font-medium">Yeni Ürün Ekle</p>
                <p className="text-sm text-gray-600">URL ile ürün ekleyin</p>
              </div>
            </Link>
            <Link
              href="/dashboard/competitors"
              className="flex items-center p-4 bg-secondary/5 rounded-lg hover:bg-secondary/10 transition-colors"
            >
              <Users className="w-5 h-5 text-secondary mr-3" />
              <div>
                <p className="font-medium">Rakip Ekle</p>
                <p className="text-sm text-gray-600">İzlemek istediğiniz mağaza</p>
              </div>
            </Link>
            <Link
              href="/dashboard/alerts"
              className="flex items-center p-4 bg-accent/5 rounded-lg hover:bg-accent/10 transition-colors"
            >
              <AlertTriangle className="w-5 h-5 text-accent mr-3" />
              <div>
                <p className="font-medium">Alert Kuralı Oluştur</p>
                <p className="text-sm text-gray-600">Fiyat değişimlerinde bildirim al</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Platform Status */}
      <div className="card mt-6">
        <h2 className="text-lg font-semibold mb-4">Platform Durumu</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Trendyol', 'Hepsiburada', 'n11', 'Amazon TR'].map((platform) => (
            <div key={platform} className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium">{platform}</p>
                <p className="text-xs text-gray-500">Aktif</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}