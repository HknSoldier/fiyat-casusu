'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Package, ExternalLink, Edit, Trash2, MoreVertical } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Product {
  id: string;
  name: string;
  platform: string;
  currentPrice: number;
  currentStock: number;
  lastScraped: string;
  imageUrl?: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Samsung Galaxy S24 Ultra 512GB',
    platform: 'trendyol',
    currentPrice: 45999,
    currentStock: 15,
    lastScraped: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'iPhone 15 Pro Max 256GB',
    platform: 'hepsiburada',
    currentPrice: 52999,
    currentStock: 8,
    lastScraped: '2024-01-15T10:25:00Z',
  },
  {
    id: '3',
    name: 'MacBook Air M3 15"',
    platform: 'amazon',
    currentPrice: 64999,
    currentStock: 0,
    lastScraped: '2024-01-15T10:20:00Z',
  },
  {
    id: '4',
    name: 'Sony WH-1000XM5',
    platform: 'n11',
    currentPrice: 12999,
    currentStock: 42,
    lastScraped: '2024-01-15T10:15:00Z',
  },
];

const priceHistoryData = [
  { date: '10 Oca', trendyol: 45999, hepsiburada: 46499, n11: 45999 },
  { date: '11 Oca', trendyol: 45599, hepsiburada: 46499, n11: 45999 },
  { date: '12 Oca', trendyol: 44999, hepsiburada: 45999, n11: 45499 },
  { date: '13 Oca', trendyol: 44999, hepsiburada: 45999, n11: 45499 },
  { date: '14 Oca', trendyol: 45599, hepsiburada: 45999, n11: 44999 },
  { date: '15 Oca', trendyol: 45999, hepsiburada: 52999, n11: 44999 },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
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

  const formatPrice = (price: number) => {
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

      {/* Products Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ürün
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platform
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fiyat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stok
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Son Güncelleme
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
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
                    <div className="text-sm font-bold text-gray-900">
                      {formatPrice(product.currentPrice)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm ${product.currentStock === 0 ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                      {product.currentStock === 0 ? 'Stok yok' : product.currentStock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(product.lastScraped).toLocaleString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Ürün bulunamadı</p>
          </div>
        )}
      </div>

      {/* Price Chart */}
      {selectedProduct && (
        <div className="card mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Fiyat Geçmişi - {selectedProduct.name}</h2>
            <button
              onClick={() => setSelectedProduct(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceHistoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="trendyol" stroke="#F97316" strokeWidth={2} />
                <Line type="monotone" dataKey="hepsiburada" stroke="#FB923C" strokeWidth={2} />
                <Line type="monotone" dataKey="n11" stroke="#22C55E" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Yeni Ürün Ekle</h2>
            <form className="space-y-4">
              <div>
                <label className="label">Ürün URL</label>
                <input
                  type="url"
                  className="input"
                  placeholder="https://www.trendyol.com/..."
                />
              </div>
              <div>
                <label className="label">Ürün Adı</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Ürün adı"
                />
              </div>
              <div>
                <label className="label">Platform</label>
                <select className="input">
                  <option value="">Platform seçin</option>
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
                  className="flex-1 btn-primary"
                >
                  Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}