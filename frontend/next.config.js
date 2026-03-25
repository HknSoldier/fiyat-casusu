/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'trendyol.com', 'hepsiburada.com', 'n11.com', 'amazon.com.tr'],
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:4000/api',
  },
};

module.exports = nextConfig;