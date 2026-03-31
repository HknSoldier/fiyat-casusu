'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Users, ExternalLink, Edit, Trash2, MoreVertical, TrendingUp, TrendingDown } from 'lucide-react';

interface Competitor {
  id: string;
  name: string;
  platform: string;
  url: string;
  productCount: number;
  isActive: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fiyat-casusu-production.up.railway.app/api';

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompetitor, setNewCompetitor] = useState({ name: '', url: '', platform: 'trendyol', customUrl: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCompetitors();
  }, []);

  const fetchCompetitors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/competitors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Rakipler alınamadı');
      const data = await res.json();
      setCompetitors(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompetitor = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const platformValue = newCompetitor.platform === 'custom' ? newCompetitor.customUrl : newCompetitor.platform;
      const res = await fetch(`${API_URL}/competitors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newCompetitor.name,
          url: newCompetitor.url,
          platform: platformValue,
        }),
      });
      if (!res.ok) throw new Error('Rakip eklenemedi');
      setShowAddModal(false);
      setNewCompetitor({ name: '', url: '', platform: 'trendyol', customUrl: '' });
      fetchCompetitors();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredCompetitors = competitors.filter(competitor =>
    competitor.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'trendyol': return 'bg-orange-500';
      case 'hepsiburada': return 'bg-orange-400';
      case 'n11': return 'bg-green-500';
      case 'amazon': return 'bg-orange-700';
      default: return 'bg-gray-500';
    }
  };

  const activeCount = competitors.filter(c => c.isActive).length;
  const totalProducts = competitors.reduce((acc, c) => acc + (c.productCount || 0), 0);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rakipler</h1>
          <p className="text-gray-600">İzlenen rakip mağazalarınızı yönetin</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 md:mt-0 btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Rakip Ekle
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Rakip</p>
              <p className="text-3xl font-bold">{competitors.length}</p>
            </div>
            <Users className="w-8 h-8 text-primary" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aktif Rakipler</p>
              <p className="text-3xl font-bold">{activeCount}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam İzlenen Ürün</p>
              <p className="text-3xl font-bold">{totalProducts}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rakip ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Competitors Grid */}
      {loading ? (
        <div className="text-center py-12">Yükleniyor...</div>
      ) : filteredCompetitors.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Henüz rakip eklenmedi</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompetitors.map((competitor) => (
            <div key={competitor.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-gray-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold">{competitor.name}</h3>
                    <span className={`px-2 py-0.5 text-xs font-medium text-white rounded-full ${getPlatformColor(competitor.platform)}`}>
                      {competitor.platform}
                    </span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <a href={competitor.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    Mağazayı ziyaret
                  </a>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">İzlenen ürün:</span>
                  <span className="font-medium">{competitor.productCount || 0}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  competitor.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {competitor.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Competitor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Rakip Ekle</h2>
            <form onSubmit={handleAddCompetitor} className="space-y-4">
              <div>
                <label className="label">Mağaza Adı</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Örn: Teknosa"
                  value={newCompetitor.name}
                  onChange={(e) => setNewCompetitor({ ...newCompetitor, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">Mağaza URL</label>
                <input
                  type="url"
                  className="input"
                  placeholder="https://www.trendyol.com/..."
                  value={newCompetitor.url}
                  onChange={(e) => setNewCompetitor({ ...newCompetitor, url: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">Platform</label>
                <select
                  className="input"
                  value={newCompetitor.platform}
                  onChange={(e) => setNewCompetitor({ ...newCompetitor, platform: e.target.value, customUrl: '' })}
                >
                  <option value="trendyol">Trendyol</option>
                  <option value="hepsiburada">Hepsiburada</option>
                  <option value="n11">n11</option>
                  <option value="amazon">Amazon TR</option>
                  <option value="custom">Diğer (Custom URL)</option>
                </select>
              </div>
              {newCompetitor.platform === 'custom' && (
                <div>
                  <label className="label">Özel Platform URL</label>
                  <input
                    type="url"
                    className="input"
                    placeholder="https://example.com/platform"
                    value={newCompetitor.customUrl}
                    onChange={(e) => setNewCompetitor({ ...newCompetitor, customUrl: e.target.value })}
                    required
                  />
                </div>
              )}
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
                  disabled={saving}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {saving ? 'Ekleniyor...' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}