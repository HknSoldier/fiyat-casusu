'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Package, MoreVertical } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  url: string;
  platform: string;
  currentPrice?: number;
  currentStock?: number;
  lastScraped?: string;
  imageUrl?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ url: '', name: '', platform: 'trendyol' });
  const [saving, setSaving] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fiyat-casusu-production.up.railway.app/api';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Ürünler alınamadı');
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      });
      if (!res.ok) throw new Error('Ürün eklenemedi');
      setShowAddModal(false);
      setNewProduct({ url: '', name: '', platform: 'trendyol' });
      fetchProducts();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase())
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

  const formatPrice = (price?: number) => {
    if (!price) return '-';
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ürünler</h1>
          <p className="text-gray-600">İzlenen ürünlerinizi yönetin</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 md:mt-0 btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Yeni Ürün Ekle
        </button>
      </div>

      {/* Search */}
      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Ürün ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {loading && <div className="text-center py-12">Yükleniyor...</div>}
      {error && <div className="text-center py-12 text-red-500">Hata: {error}</div>}

      {/* Products Table */}
      {!loading && !error && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fiyat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Son Güncelleme</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${getPlatformColor(product.platform)}`}>
                        {product.platform}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">{formatPrice(product.currentPrice)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${product.currentStock === 0 ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                        {product.currentStock === 0 ? 'Stok yok' : product.currentStock || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {product.lastScraped ? new Date(product.lastScraped).toLocaleString('tr-TR') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Henüz ürün eklenmedi</p>
            </div>
          )}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Yeni Ürün Ekle</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="label">Ürün URL</label>
                <input
                  type="url"
                  className="input"
                  placeholder="https://www.trendyol.com/..."
                  value={newProduct.url}
                  onChange={(e) => setNewProduct({ ...newProduct, url: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">Ürün Adı</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Ürün adı"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">Platform</label>
                <select
                  className="input"
                  value={newProduct.platform}
                  onChange={(e) => setNewProduct({ ...newProduct, platform: e.target.value })}
                >
                  <option value="trendyol">Trendyol</option>
                  <option value="hepsiburada">Hepsiburada</option>
                  <option value="n11">n11</option>
                  <option value="amazon">Amazon TR</option>
                </select>
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