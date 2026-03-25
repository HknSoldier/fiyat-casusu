'use client';

import { useState } from 'react';
import { Plus, Search, Bell, ArrowUp, ArrowDown, AlertTriangle, CheckCircle, Trash2, MoreVertical, Mail } from 'lucide-react';

interface AlertRule {
  id: string;
  name: string;
  type: string;
  condition: string;
  isActive: boolean;
  notificationChannels: string[];
  createdAt: string;
}

interface Alert {
  id: string;
  ruleName: string;
  productName: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

const mockAlertRules: AlertRule[] = [
  {
    id: '1',
    name: 'Fiyat Düşüşü',
    type: 'price_drop',
    condition: 'Fiyat %10 altına düştüğünde',
    isActive: true,
    notificationChannels: ['email'],
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    name: 'Stok Tükenmesi',
    type: 'stock_out',
    condition: 'Stok 0 olduğunda',
    isActive: true,
    notificationChannels: ['email', 'push'],
    createdAt: '2024-01-12',
  },
  {
    id: '3',
    name: 'Fiyat Artışı',
    type: 'price_increase',
    condition: 'Fiyat %15 üstüne çıktığında',
    isActive: false,
    notificationChannels: ['email'],
    createdAt: '2024-01-14',
  },
];

const mockAlerts: Alert[] = [
  {
    id: '1',
    ruleName: 'Fiyat Düşüşü',
    productName: 'Samsung Galaxy S24',
    message: 'Fiyat 45.999 TL\'ye düştü (önceki: 49.999 TL)',
    type: 'price_drop',
    isRead: false,
    createdAt: '2 saat önce',
  },
  {
    id: '2',
    ruleName: 'Stok Tükenmesi',
    productName: 'iPhone 15 Pro',
    message: 'Stok tükendi',
    type: 'stock_out',
    isRead: false,
    createdAt: '5 saat önce',
  },
  {
    id: '3',
    ruleName: 'Fiyat Artışı',
    productName: 'MacBook Air M3',
    message: 'Fiyat 64.999 TL\'ye yükseldi',
    type: 'price_increase',
    isRead: true,
    createdAt: '1 gün önce',
  },
];

export default function AlertsPage() {
  const [alertRules, setAlertRules] = useState<AlertRule[]>(mockAlertRules);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [activeTab, setActiveTab] = useState<'alerts' | 'rules'>('alerts');
  const [showAddModal, setShowAddModal] = useState(false);

  const unreadCount = alerts.filter(a => !a.isRead).length;

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'price_drop': return <ArrowDown className="w-5 h-5 text-green-500" />;
      case 'price_increase': return <ArrowUp className="w-5 h-5 text-red-500" />;
      case 'stock_out': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const markAsRead = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isRead: true } : alert
    ));
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Uyarılar</h1>
          <p className="text-gray-600">Alert kurallarınızı ve bildirimlerinizi yönetin</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 md:mt-0 btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Yeni Kural Ekle
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('alerts')}
          className={`pb-3 px-1 font-medium ${
            activeTab === 'alerts'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Bildirimler {unreadCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`pb-3 px-1 font-medium ${
            activeTab === 'rules'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Kurallar ({alertRules.length})
        </button>
      </div>

      {activeTab === 'alerts' ? (
        <div className="card">
          <div className="divide-y">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start p-4 ${!alert.isRead ? 'bg-blue-50' : ''}`}
              >
                <div className="flex-shrink-0 mt-1">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{alert.ruleName}</p>
                    <span className="text-xs text-gray-500">{alert.createdAt}</span>
                  </div>
                  <p className="text-sm font-semibold">{alert.productName}</p>
                  <p className="text-sm text-gray-600">{alert.message}</p>
                </div>
                {!alert.isRead && (
                  <button
                    onClick={() => markAsRead(alert.id)}
                    className="ml-4 text-primary hover:text-primary-dark"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            {alerts.length === 0 && (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Henüz alert yok</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {alertRules.map((rule) => (
            <div key={rule.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{rule.name}</h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      rule.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {rule.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{rule.condition}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center text-xs text-gray-500">
                      <Mail className="w-3 h-3 mr-1" />
                      {rule.notificationChannels.join(', ')}
                    </div>
                    <span className="text-xs text-gray-500">
                      Oluşturuldu: {rule.createdAt}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-primary">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Rule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Yeni Alert Kuralı</h2>
            <form className="space-y-4">
              <div>
                <label className="label">Kural Adı</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Örn: Fiyat Düşüşü"
                />
              </div>
              <div>
                <label className="label">Alert Tipi</label>
                <select className="input">
                  <option value="">Tip seçin</option>
                  <option value="price_drop">Fiyat Düşüşü</option>
                  <option value="price_increase">Fiyat Artışı</option>
                  <option value="stock_out">Stok Tükenmesi</option>
                  <option value="stock_low">Stok Düşük</option>
                </select>
              </div>
              <div>
                <label className="label">Koşul</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Örn: Fiyat %10 altına düştüğünde"
                />
              </div>
              <div>
                <label className="label">Bildirim Kanalları</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span>E-posta</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Push Bildirim</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 btn-secondary"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}