'use client';

import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  companyName?: string;
  isActive: boolean;
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://fiyat-casusu-production.up.railway.app/api';
        const res = await fetch(`${apiUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Profil bilgileri alınamadı');
        const data = await res.json();
        setUser(data);
        setName(data.name || '');
        setCompanyName(data.companyName || '');
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://fiyat-casusu-production.up.railway.app/api';
      const res = await fetch(`${apiUrl}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, companyName }),
      });
      if (!res.ok) throw new Error('Profil güncellenemedi');
      alert('Profil başarıyla güncellendi');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      alert('Şifreler eşleşmiyor');
      return;
    }
    alert('Şifre değiştirme özelliği henüz aktif değil');
  };

  if (loading) return <div className="p-6">Yükleniyor...</div>;
  if (error) return <div className="p-6 text-red-500">Hata: {error}</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Ayarlar</h1>

      {/* Profil Bilgileri */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-4">Profil Bilgileri</h2>
        <form onSubmit={handleSaveProfile}>
          <div className="mb-4">
            <label className="label">E-posta</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="input opacity-50 cursor-not-allowed"
            />
          </div>
          <div className="mb-4">
            <label className="label">Ad Soyad</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="Adınızı giriniz"
              required
            />
          </div>
          <div className="mb-4">
            <label className="label">Şirket Adı</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="input"
              placeholder="Şirket adınız"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary disabled:opacity-50"
          >
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </form>
      </div>

      {/* Şifre Değiştirme */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Şifre Değiştir</h2>
        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label className="label">Mevcut Şifre</label>
            <input
              type="password"
              value={passwordData.current}
              onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
              className="input"
              placeholder="••••••••"
            />
          </div>
          <div className="mb-4">
            <label className="label">Yeni Şifre</label>
            <input
              type="password"
              value={passwordData.new}
              onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
              className="input"
              placeholder="••••••••"
            />
          </div>
          <div className="mb-4">
            <label className="label">Yeni Şifre Tekrar</label>
            <input
              type="password"
              value={passwordData.confirm}
              onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
              className="input"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="btn-secondary"
          >
            Şifreyi Değiştir
          </button>
        </form>
      </div>
    </div>
  );
}