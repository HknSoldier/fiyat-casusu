'use client';

import Link from 'next/link';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';

export default function Header() {
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              Fiyat Casusu
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              title={isDarkMode ? 'Açık mod' : 'Karanlık mod'}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary">
              Giriş Yap
            </Link>
            <Link href="/register" className="btn-primary">
              Ücretsiz Dene
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}