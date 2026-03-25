'use client';

import { useState } from 'react';
import { FileBarChart, Download, Calendar, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const weeklyData = [
  { day: 'Pzt', changes: 12 },
  { day: 'Sal', changes: 19 },
  { day: 'Çar', changes: 15 },
  { day: 'Per', changes: 22 },
  { day: 'Cum', changes: 18 },
  { day: 'Cmt', changes: 8 },
  { day: 'Paz', changes: 5 },
];

const platformData = [
  { name: 'Trendyol', value: 45, color: '#F97316' },
  { name: 'Hepsiburada', value: 30, color: '#FB923C' },
  { name: 'n11', value: 15, color: '#22C55E' },
  { name: 'Amazon', value: 10, color: '#92400E' },
];

const competitorData = [
  { competitor: 'Teknosa', products: 156, avgPrice: 15000 },
  { competitor: 'Vatan', products: 234, avgPrice: 14500 },
  { competitor: 'MediaMarkt', products: 89, avgPrice: 16000 },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('7d');

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Raporlar</h1>
          <p className="text-gray-600">Detaylı analiz ve raporlar</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input w-auto"
          >
            <option value="7d">Son 7 gün</option>
            <option value="30d">Son 30 gün</option>
            <option value="90d">Son 90 gün</option>
          </select>
          <button className="btn-secondary flex items-center">
            <Download className="w-4 h-4 mr-2" />
            İndir
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Toplam Değişim</p>
              <p className="text-3xl font-bold">234</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Fiyat Düşüşü</p>
              <p className="text-3xl font-bold text-green-600">89</p>
            </div>
            <TrendingDown className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Fiyat Artışı</p>
              <p className="text-3xl font-bold text-red-600">145</p>
            </div>
            <TrendingUp className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aktif Rakipler</p>
              <p className="text-3xl font-bold">8</p>
            </div>
            <Users className="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Changes Chart */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Haftalık Fiyat Değişimleri</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="changes" fill="#0D9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Platform Dağılımı</h2>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {platformData.map((platform) => (
                <div key={platform.name} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: platform.color }} />
                  <span className="text-sm">{platform.name}</span>
                  <span className="ml-2 text-sm text-gray-500">({platform.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Competitor Analysis */}
      <div className="card mb-8">
        <h2 className="text-lg font-semibold mb-4">Rakip Analizi</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rakip</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İzlenen Ürün</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ort. Fiyat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fiyat Karşılaştırma</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {competitorData.map((comp) => (
                <tr key={comp.competitor}>
                  <td className="px-6 py-4 font-medium">{comp.competitor}</td>
                  <td className="px-6 py-4">{comp.products}</td>
                  <td className="px-6 py-4">
                    {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(comp.avgPrice)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-green-600 flex items-center">
                      <TrendingDown className="w-4 h-4 mr-1" />
                      %5 daha düşük
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Fiyat Optimizasyonu Önerileri</h2>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800">Fiyat Düşürme Önerisi</h3>
            <p className="text-sm text-green-700 mt-1">
              Samsung Galaxy S24 için Teknosa&apos;dan 500 TL daha düşük fiyat belirleyebilirsiniz.
            </p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800">Stok Yönetimi</h3>
            <p className="text-sm text-blue-700 mt-1">
              MacBook Air M3 stokları azalıyor. Tedarikçinizle iletişime geçmenizi öneriyoruz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}