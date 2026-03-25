'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    companyName: '',
    kvkkConsent: false,
  });
  const [validationError, setValidationError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Şifreler eşleşmiyor');
      return;
    }

    if (!formData.kvkkConsent) {
      setValidationError('KVKK koşullarını kabul etmelisiniz');
      return;
    }

    const success = await register({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      companyName: formData.companyName,
    });

    if (success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-primary">
            Fiyat Casusu
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Yeni Hesap Oluşturun
          </h2>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {(error || validationError) && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error || validationError}
              </div>
            )}

            <div>
              <label htmlFor="name" className="label">
                Ad Soyad
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="input"
                placeholder="Ahmet Yılmaz"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="label">
                E-posta Adresi
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="ahmet@company.com"
                required
              />
            </div>

            <div>
              <label htmlFor="companyName" className="label">
                Şirket Adı (Opsiyonel)
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                value={formData.companyName}
                onChange={handleChange}
                className="input"
                placeholder="Şirketiniz Ltd. Şti."
              />
            </div>

            <div>
              <label htmlFor="password" className="label">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="input"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">
                Şifre Tekrar
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-start">
              <input
                id="kvkkConsent"
                name="kvkkConsent"
                type="checkbox"
                checked={formData.kvkkConsent}
                onChange={handleChange}
                className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="kvkkConsent" className="ml-2 text-sm text-gray-600">
                <Link href="/legal/kvkk" className="text-primary hover:underline">
                  KVKK aydınlatma metni
                </Link>
                &apos;ni okudum ve kişisel verilerimin işlenmesini kabul ediyorum.
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 disabled:opacity-50"
            >
              {isLoading ? 'Hesap oluşturuluyor...' : 'Hesap Oluştur'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-600">Zaten hesabınız var mı? </span>
            <Link href="/login" className="text-primary font-medium hover:underline">
              Giriş Yap
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}