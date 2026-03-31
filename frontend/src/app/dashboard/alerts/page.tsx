'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Search, Bell, ArrowUp, ArrowDown, AlertTriangle, CheckCircle, Trash2, MoreVertical, Mail, Edit } from 'lucide-react';

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fiyat-casusu-production.up.railway.app/api';

export default function AlertsPage() {
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'alerts' | 'rules'>('rules');
  const [showAddModal, setShowAddModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editRule, setEditRule] = useState<AlertRule | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAlertRules();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchAlertRules = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/alerts/rules`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Kurallar alınamadı');
      const data = await res.json();
      setAlertRules(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (!confirm('Bu kuralı silmek istediğinize emin misiniz?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/alerts/rules/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Kural silinemedi');
      setAlertRules(alertRules.filter(r => r.id !== id));
      setOpenMenuId(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEditRule = (rule: AlertRule) => {
    setEditRule(rule);
    setOpenMenuId(null);
    setShowAddModal(true);
  };

  const unreadCount = alerts.filter(a => !a.isRead).length;

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'price_drop': return <ArrowDown className="w-5 h-5 text-green-500" />;
      case 'price_increase': return <ArrowUp className="w-5 h-5 text-red-500" />;
      case 'stock_out': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Uyarılar</h1>
          <p className="text-gray-600">Alert kurallarınızı ve bildirimlerinizi yönetin</p>
        </div>
        <button
          onClick={() => { setEditRule(null); setShowAddModal(true); }}
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
          <div className="text-center py-12 text-gray-500">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p>Henüz bildirim yok</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4" ref={menuRef}>
          {loading ? (
            <div className="text-center py-12">Yükleniyor...</div>
          ) : alertRules.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Henüz kural eklenmedi</p>
            </div>
          ) : (
            alertRules.map((rule) => (
              <div key={rule.id} className="card relative">
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
                        {rule.notificationChannels?.join(', ') || 'email'}
                      </div>
                      <span className="text-xs text-gray-500">
                        Oluşturuldu: {rule.createdAt ? new Date(rule.createdAt).toLocaleDateString('tr-TR') : '-'}
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => setOpenMenuId(openMenuId === rule.id ? null : rule.id)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {openMenuId === rule.id && (
                      <div className="absolute right-0 top-8 bg-white border rounded shadow-lg py-1 z-10 min-w-[120px]">
                        <button
                          onClick={() => handleEditRule(rule)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDeleteRule(rule.id)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                          Sil
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add/Edit Rule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">{editRule ? 'Kuralı Düzenle' : 'Yeni Alert Kuralı'}</h2>
            <form className="space-y-4">
              <div>
                <label className="label">Kural Adı</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Örn: Fiyat Düşüşü"
                  defaultValue={editRule?.name}
                />
              </div>
              <div>
                <label className="label">Alert Tipi</label>
                <select className="input" defaultValue={editRule?.type}>
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
                  defaultValue={editRule?.condition}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditRule(null); }}
                  className="flex-1 btn-secondary"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  {editRule ? 'Güncelle' : 'Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}