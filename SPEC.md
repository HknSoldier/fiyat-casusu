# Fiyat Casusu - KOBİ E-Ticaret Fiyat İzleme Platformu

## 1. PROJECT OVERVIEW

### Project Name
**Fiyat Casusu** (Price Spy)

### Project Type
Full-stack SaaS Web Application

### Core Functionality
KOBİ'lerin Trendyol, Hepsiburada, n11 ve Amazon TR platformlarındaki rakiplerinin fiyat ve stok durumlarını izleyebileceği, gerçek zamanlı alert sistemi sunan e-ticaret fiyat izleme platformu.

### Target Users
- Small and medium businesses (KOBİ) in Turkey
- E-commerce sellers who want to monitor competitors
- Pricing managers and digital marketing teams

---

## 2. UI/UX SPECIFICATION

### Layout Structure

#### Pages
1. **Landing Page** (`/`) - Marketing page for the product
2. **Auth Pages** (`/login`, `/register`) - User authentication
3. **Dashboard** (`/dashboard`) - Main control panel
4. **Products** (`/dashboard/products`) - Product management
5. **Competitors** (`/dashboard/competitors`) - Competitor stores
6. **Alerts** (`/dashboard/alerts`) - Alert configuration
7. **Reports** (`/dashboard/reports`) - Analytics and reports
8. **Settings** (`/dashboard/settings`) - User/company settings

#### Page Sections
- **Header**: Logo, navigation, user menu
- **Sidebar**: Dashboard navigation (collapsible on mobile)
- **Main Content**: Page-specific content
- **Footer**: Links, copyright (minimal on dashboard)

#### Responsive Breakpoints
- **Mobile**: < 640px (single column, hamburger menu)
- **Tablet**: 640px - 1024px (collapsed sidebar)
- **Desktop**: > 1024px (full sidebar)

### Visual Design

#### Color Palette
```css
--color-primary: #0D9488;        /* Teal - Main brand color */
--color-primary-dark: #0F766E;  /* Darker teal */
--color-primary-light: #14B8A6; /* Lighter teal */
--color-secondary: #6366F1;     /* Indigo - Secondary actions */
--color-accent: #F59E0B;        /* Amber - Alerts/Warnings */
--color-success: #10B981;       /* Emerald - Success states */
--color-error: #EF4444;         /* Red - Error states */
--color-warning: #F59E0B;        /* Amber - Warning states */

/* Neutrals */
--color-bg-primary: #FFFFFF;    /* Main background */
--color-bg-secondary: #F8FAFC;  /* Card backgrounds */
--color-bg-tertiary: #F1F5F9;   /* Sidebar, inputs */
--color-text-primary: #0F172A;  /* Main text */
--color-text-secondary: #475569;/* Secondary text */
--color-text-muted: #94A3B8;    /* Placeholder text */
--color-border: #E2E8F0;        /* Borders */
```

#### Typography
- **Font Family**: 
  - Headings: "Plus Jakarta Sans" (Google Fonts)
  - Body: "Inter" (Google Fonts)
- **Font Sizes**:
  - H1: 2.5rem (40px) - Page titles
  - H2: 2rem (32px) - Section titles
  - H3: 1.5rem (24px) - Card titles
  - H4: 1.25rem (20px) - Subsection titles
  - Body: 1rem (16px)
  - Small: 0.875rem (14px)
  - Caption: 0.75rem (12px)

#### Spacing System
- Base unit: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96

#### Visual Effects
- **Border Radius**:
  - Small: 4px (buttons, inputs)
  - Medium: 8px (cards)
  - Large: 12px (modals)
  - Full: 9999px (avatars, pills)
- **Shadows**:
  - sm: `0 1px 2px rgba(0,0,0,0.05)`
  - md: `0 4px 6px -1px rgba(0,0,0,0.1)`
  - lg: `0 10px 15px -3px rgba(0,0,0,0.1)`
  - xl: `0 20px 25px -5px rgba(0,0,0,0.1)`

### Components

#### Navigation
- **Top Navbar**: Fixed, 64px height, white background with shadow
- **Sidebar**: 280px width (desktop), collapsible to 64px (tablet), hidden (mobile)

#### Buttons
- **Primary**: Teal background, white text, hover: darker
- **Secondary**: White background, teal border, teal text
- **Danger**: Red background, white text
- **Ghost**: Transparent, text only
- **States**: hover (darken 10%), active (darken 15%), disabled (opacity 50%)

#### Cards
- White background, 8px radius, subtle shadow
- Header, body, footer sections
- Hover: slight shadow increase

#### Forms
- **Inputs**: 40px height, 8px radius, border on focus
- **Labels**: Above input, 14px, semibold
- **Error states**: Red border, error message below
- **Validation**: Real-time with debounce

#### Data Display
- **Tables**: Striped rows, sticky header, pagination
- **Charts**: Line charts for trends, bar charts for comparisons
- **Badges**: Status indicators (active, pending, error)
- **Avatars**: Circular, fallback initials

#### Feedback
- **Toasts**: Top-right, auto-dismiss 5s
- **Modals**: Centered, backdrop blur
- **Loading**: Skeleton screens, spinner

---

## 3. FUNCTIONAL SPECIFICATION

### Core Features

#### 3.1 Authentication
- Email/password registration and login
- JWT-based session management
- Password reset via email
- Company association on signup

#### 3.2 Product Management
- Add products by URL (auto-extract info)
- Manual product entry form
- Bulk import via CSV
- Edit/delete products
- Category assignment
- Product search and filter

#### 3.3 Competitor Management
- Add competitor stores by URL
- Auto-detect platform
- Group competitors by category
- Manual competitor discovery
- Competitor profile pages

#### 3.4 Product Matching
- Auto-match by barcode/UPC
- Fuzzy matching by product name (Levenshtein)
- Manual matching confirmation
- Match confidence score display

#### 3.5 Scraping System
- Playwright-based scrapers for 4 platforms:
  - Trendyol
  - Hepsiburada
  - n11
  - Amazon TR
- Configurable scraping intervals
- Proxy rotation support
- Rate limiting
- Error handling and retry

#### 3.6 Price & Stock Monitoring
- Store price history
- Store stock history
- Historical charts
- Export to CSV/PDF

#### 3.7 Alert System
- Alert rules:
  - Price drop below X%
  - Price increase above X%
  - Stock out
  - Stock below X
  - New competitor
  - Competitor removed
- Email notifications
- In-app notifications
- Webhook integrations (Slack, Discord)

#### 3.8 Dashboard
- Overview stats:
  - Total products tracked
  - Active competitors
  - Price changes (24h, 7d, 30d)
  - Top changed products
  - Recent alerts
- Quick actions

#### 3.9 Reports
- Weekly/monthly summary
- Competitor analysis
- Price optimization suggestions
- Scheduled email reports

#### 3.10 Settings
- Company profile
- Subscription management
- User management
- API keys
- Notification preferences

### Data Flow

```
[User] → [Frontend] → [API Gateway] → [Backend Services]
                                     ↓
                              [Database]
                                     ↓
                              [Scraper Workers]
                                     ↓
                              [Queue (Redis)]
                                     ↓
                              [External Platforms]
```

### Key Modules

#### Backend Modules
1. **AuthModule**: JWT authentication, user management
2. **CompaniesModule**: Company CRUD, subscription
3. **ProductsModule**: Product CRUD, matching
4. **CompetitorsModule**: Competitor CRUD, discovery
5. **ScrapingModule**: Job management, scrapers
6. **AlertsModule**: Alert rules, notifications
7. **ReportsModule**: Report generation
8. **LegalModule**: KVKK compliance

#### Frontend Modules
1. **Auth Pages**: Login, register, password reset
2. **Dashboard**: Overview, stats
3. **Products**: List, add, edit, details
4. **Competitors**: List, add, details
5. **Alerts**: List, create, edit
6. **Reports**: View, export
7. **Settings**: Profile, subscription

### Edge Cases
- Invalid product URLs
- Products removed from platform
- Competitor stores closed
- Scraping blocked by platform
- Network failures
- Concurrent user limits exceeded

---

## 4. DATABASE SCHEMA

### Tables

#### users
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | VARCHAR(255) | Unique email |
| password_hash | VARCHAR(255) | Bcrypt hash |
| name | VARCHAR(100) | User name |
| company_id | UUID | FK to companies |
| role | ENUM | admin, user |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update |
| email_verified | BOOLEAN | Email verification |
| deleted_at | TIMESTAMP | Soft delete |

#### companies
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(255) | Company name |
| subscription_plan | ENUM | free, pro, enterprise |
| subscription_expires | TIMESTAMP | Expiry date |
| api_limit | INTEGER | Max products |
| scraping_interval | INTEGER | Minutes |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update |
| kvkk_consent | BOOLEAN | KVKK consent status |
| kvkk_consent_date | TIMESTAMP | Consent date |

#### products
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| company_id | UUID | FK to companies |
| name | VARCHAR(500) | Product name |
| sku | VARCHAR(100) | SKU |
| barcode | VARCHAR(100) | Barcode/UPC |
| image_url | TEXT | Product image |
| category_id | UUID | FK to categories |
| url | TEXT | Product URL |
| platform | ENUM | trendyol, hepsiburada, n11, amazon |
| current_price | DECIMAL(10,2) | Latest price |
| current_stock | INTEGER | Latest stock |
| last_scraped | TIMESTAMP | Last scrape time |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update |

#### competitors
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| company_id | UUID | FK to companies |
| name | VARCHAR(255) | Store name |
| platform | ENUM | trendyol, hepsiburada, n11, amazon |
| url | TEXT | Store URL |
| logo_url | TEXT | Store logo |
| is_active | BOOLEAN | Active status |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update |

#### price_history
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| product_id | UUID | FK to products |
| competitor_id | UUID | FK to competitors |
| price | DECIMAL(10,2) | Recorded price |
| recorded_at | TIMESTAMP | Recording time |

#### stock_history
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| product_id | UUID | FK to products |
| competitor_id | UUID | FK to competitors |
| stock | INTEGER | Recorded stock |
| recorded_at | TIMESTAMP | Recording time |

#### product_matches
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| product_id | UUID | FK to products |
| competitor_id | UUID | FK to competitors |
| competitor_product_id | VARCHAR(255) | External ID |
| confidence | DECIMAL(5,2) | Match confidence |
| is_confirmed | BOOLEAN | Manual confirmation |
| created_at | TIMESTAMP | Creation time |

#### alert_rules
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| company_id | UUID | FK to companies |
| name | VARCHAR(255) | Rule name |
| type | ENUM | price_drop, price_increase, stock_out, stock_low, competitor_add, competitor_remove |
| condition | JSONB | Rule conditions |
| is_active | BOOLEAN | Active status |
| notification_channels | JSONB | Channels array |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update |

#### alerts
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| alert_rule_id | UUID | FK to alert_rules |
| product_id | UUID | FK to products |
| competitor_id | UUID | FK to competitors |
| old_value | DECIMAL | Previous value |
| new_value | DECIMAL | New value |
| is_read | BOOLEAN | Read status |
| created_at | TIMESTAMP | Creation time |

#### categories
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR(255) | Category name |
| parent_id | UUID | Self-reference |
| created_at | TIMESTAMP | Creation time |

---

## 5. API ENDPOINTS

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Companies
- `GET /api/companies/me` - Get current company
- `PUT /api/companies/me` - Update company
- `GET /api/companies/me/subscription` - Get subscription

### Products
- `GET /api/products` - List products
- `POST /api/products` - Add product
- `GET /api/products/:id` - Get product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/import` - Bulk import
- `GET /api/products/:id/history` - Price history
- `GET /api/products/:id/competitors` - Competitor prices

### Competitors
- `GET /api/competitors` - List competitors
- `POST /api/competitors` - Add competitor
- `GET /api/competitors/:id` - Get competitor
- `PUT /api/competitors/:id` - Update competitor
- `DELETE /api/competitors/:id` - Delete competitor

### Product Matching
- `GET /api/matching/suggestions` - Get match suggestions
- `POST /api/matching/confirm` - Confirm match
- `POST /api/matching/reject` - Reject match

### Alerts
- `GET /api/alerts/rules` - List alert rules
- `POST /api/alerts/rules` - Create alert rule
- `PUT /api/alerts/rules/:id` - Update alert rule
- `DELETE /api/alerts/rules/:id` - Delete alert rule
- `GET /api/alerts` - List alerts
- `PUT /api/alerts/:id/read` - Mark as read

### Reports
- `GET /api/reports/summary` - Get summary
- `GET /api/reports/competitors` - Competitor analysis

### Legal (KVKK)
- `GET /api/legal/privacy` - Privacy policy
- `GET /api/legal/kvkk` - KVKK notice
- `POST /api/legal/consent` - Submit consent
- `DELETE /api/legal/data` - Request data deletion

---

## 6. TECHNOLOGY STACK

### Backend
- **Runtime**: Node.js 20+
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Cache**: Redis
- **Queue**: BullMQ
- **Scraping**: Playwright, Puppeteer

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Shadcn/ui
- **State**: Zustand + React Query
- **Charts**: Recharts
- **Auth**: NextAuth.js

### Infrastructure
- **Hosting**: Vercel (frontend), Railway/AWS (backend)
- **Database**: Neon/Supabase
- **Cache**: Upstash
- **Email**: Resend/SendGrid

---

## 7. ACCEPTANCE CRITERIA

### Authentication
- [ ] User can register with email/password
- [ ] User can login and receive JWT
- [ ] Protected routes require valid token

### Product Management
- [ ] User can add product by URL
- [ ] User can add product manually
- [ ] Products display in list with search/filter

### Competitor Management
- [ ] User can add competitor store
- [ ] Platform auto-detected from URL

### Scraping
- [ ] System can scrape product data from 4 platforms
- [ ] Price/stock history stored

### Alerts
- [ ] User can create alert rules
- [ ] Alerts trigger on conditions
- [ ] Email notification sent

### Dashboard
- [ ] Dashboard shows overview stats
- [ ] Charts display price history

### KVKK
- [ ] Consent form on registration
- [ ] Data deletion request works

### Performance
- [ ] Page load < 2s
- [ ] API response < 500ms (cached)

---

## 8. PROJECT STRUCTURE

```
/workspace/project/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── companies/     # Company module
│   │   ├── products/      # Products module
│   │   ├── competitors/   # Competitors module
│   │   ├── scraping/       # Scraping module
│   │   ├── alerts/        # Alerts module
│   │   ├── reports/       # Reports module
│   │   ├── legal/         # KVKK module
│   │   ├── database/      # Database entities
│   │   └── main.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js app router
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utils
│   │   └── stores/        # Zustand stores
│   ├── package.json
│   └── next.config.js
├── docker/                # Docker configs
├── SPEC.md                # This file
└── README.md              # Project readme
```