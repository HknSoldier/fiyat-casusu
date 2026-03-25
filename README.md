# Fiyat Casusu

KOBİ'lerin Trendyol, Hepsiburada, n11 ve Amazon TR platformlarındaki rakiplerinin **fiyat ve stok durumlarını** izleyebileceği, gerçek zamanlı alert sistemi sunan bir e-ticaret fiyat izleme platformu.

## 🚀 Özellikler

- **Çoklu Platform Desteği**: Trendyol, Hepsiburada, n11, Amazon TR
- **Gerçek Zamanlı İzleme**: Fiyat ve stok değişimlerini anlık takip
- **Akıllı Alertler**: Fiyat düşüşü, artışı, stok durumu için bildirimler
- **Detaylı Raporlar**: Fiyat trendleri ve rakip analizleri
- **KVKK Uyumlu**: Türkiye yasalarına tam uyumlu veri işleme

## 🛠️ Teknoloji Stack

### Backend
- Node.js + NestJS
- TypeScript
- PostgreSQL + TypeORM
- Redis (Cache & Queue)
- BullMQ

### Frontend
- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Recharts
- Zustand

## 📋 Kurulum

### Gereksinimler
- Node.js 18+
- Docker & Docker Compose

### Docker ile Çalıştırma

```bash
# Projeyi klonlayın
cd docker

# Tüm servisleri başlatın
docker-compose up -d

# Servisleri izleyin
docker-compose logs -f
```

Servisler:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### Manuel Kurulum

#### Backend
```bash
cd backend
npm install
npm run build
npm run start:dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📁 Proje Yapısı

```
/workspace/project/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── auth/           # Authentication
│   │   ├── companies/     # Company management
│   │   ├── products/      # Product management
│   │   ├── competitors/   # Competitor tracking
│   │   ├── scraping/       # Web scraping
│   │   ├── alerts/        # Alert system
│   │   ├── legal/         # KVKK compliance
│   │   └── database/     # Database entities
│   └── Dockerfile
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/          # Pages
│   │   ├── components/   # UI components
│   │   ├── stores/       # Zustand stores
│   │   └── hooks/        # Custom hooks
│   └── Dockerfile
├── docker/                # Docker configs
├── SPEC.md              # Proje specifikasyonu
└── README.md            # Bu dosya
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Kayıt
- `POST /api/auth/login` - Giriş
- `GET /api/auth/me` - Profil

### Products
- `GET /api/products` - Ürün listesi
- `POST /api/products` - Ürün ekle
- `GET /api/products/:id` - Ürün detay
- `GET /api/products/:id/history` - Fiyat geçmişi

### Competitors
- `GET /api/competitors` - Rakipler
- `POST /api/competitors` - Rakip ekle

### Alerts
- `GET /api/alerts` - Alertler
- `POST /api/alerts/rules` - Kural oluştur
- `GET /api/alerts/unread-count` - Okunmamış sayısı

## 📝 KVKK Uyumu

Platform, 6698 sayılı KVKK kapsamında:
- Açık rıza yönetimi
- Veri işleme envanteri
- Veri silme talepleri
- Gizlilik politikası

## 📄 Lisans

MIT License
