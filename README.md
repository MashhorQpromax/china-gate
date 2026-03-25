# CHINA GATE — بوابة الصين

[![Next.js 14](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?logo=socket.io&logoColor=white)](https://socket.io/)

**A comprehensive B2B trading platform connecting Gulf region merchants with Chinese suppliers and manufacturers.**

**منصة تجارية شاملة تربط تجار منطقة الخليج مع الموردين والمصنعين الصينيين.**

---

## Table of Contents

- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Demo Credentials](#demo-credentials)
- [Project Structure](#project-structure)
- [Features](#features)
- [API Integrations Ready](#api-integrations-ready)
- [Roadmap](#roadmap)
- [License](#license)
- [Contact](#contact)

---

## About the Project
### عن المشروع

**Vision:** To be the main gateway for seamless trade between China and the Gulf region, facilitating connections between Gulf merchants, manufacturers, and Chinese suppliers with integrated banking, logistics, and quality assurance.

**الرؤية:** أن تكون البوابة الرئيسية للتجارة السلسة بين الصين ومنطقة الخليج، وتسهيل الاتصالات بين تجار الخليج والمصنعين والموردين الصينيين مع البنية التحتية المتكاملة للبنوك واللوجستيات وضمان الجودة.

**Target Market:**
- 🇸🇦 Saudi Arabia
- 🇦🇪 United Arab Emirates
- 🇰🇼 Kuwait
- 🇧🇭 Bahrain
- 🇶🇦 Qatar
- 🇴🇲 Oman
- 🇨🇳 China

**Key Features:**
- ✅ Multi-role account system (Gulf Buyers, Chinese Suppliers, Manufacturers)
- ✅ Workflow & approval system with customizable stages
- ✅ Integrated marketplace with products, requests, and quotations
- ✅ Complete deal management with 15 lifecycle stages
- ✅ Letter of Credit (LC) and Letter of Guarantee (LG) management
- ✅ Shipping & logistics tracking
- ✅ Manufacturing partnerships and labor coordination
- ✅ Quality assurance and product journey tracking
- ✅ Integrated banking systems (Al-Rajhi Bank ready)
- ✅ Real-time messaging and notifications
- ✅ Customs clearance management
- ✅ Ratings and dispute resolution
- ✅ PWA support (mobile-ready)
- ✅ Multi-language support (Arabic RTL + English + Chinese prep)
- ✅ Dark/Light theme support

---

## Tech Stack
### البنية التقنية

**Frontend:**
- **Next.js 14** with App Router for optimized performance
- **TypeScript** for type safety
- **Tailwind CSS** for responsive design
- **Socket.io** for real-time features
- **PWA** support for mobile experience

**Backend:**
- **Node.js** + **Express** REST API
- **NextAuth.js** for secure authentication
- **Socket.io Server** for real-time communication

**Database:**
- **PostgreSQL 14+** for data persistence
- **Prisma ORM** for database management

**Additional:**
- **Arabic (RTL)** and **English** language support
- Dark/Light theme switching
- API-ready integrations

---

## Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- **PostgreSQL** 14.x or higher
- Git

---

## Installation
### التثبيت

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/china-gate.git
cd china-gate
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
# Database credentials, API keys, etc.
```

**Sample .env configuration:**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/china_gate
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

### 4. Database Setup

```bash
# Run migrations
npx prisma migrate dev

# Seed the database with demo data
npx prisma db seed
```

### 5. Start Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

---

## Demo Credentials
### بيانات الدخول التجريبية

| Role | Email | Password |
|------|-------|----------|
| **Gulf Buyer** (مشتري خليجي) | buyer@chinagate.com | demo123456 |
| **Chinese Supplier** (مورد صيني) | supplier@chinagate.com | demo123456 |
| **Saudi Manufacturer** (مصنع سعودي) | manufacturer@chinagate.com | demo123456 |
| **Admin** | admin@chinagate.com | admin123456 |
| **Workflow User - Creator** | creator@alfahd.com | demo123456 |
| **Workflow User - Reviewer** | reviewer@alfahd.com | demo123456 |
| **Workflow User - Approver** | approver@alfahd.com | demo123456 |

---

## Project Structure
### هيكل المشروع

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/               # Login page
│   │   ├── register/            # Registration with role selection
│   │   │   └── forms/           # Role-specific forms
│   │   │       ├── GulfBuyerForm.tsx
│   │   │       ├── GulfManufacturerForm.tsx
│   │   │       └── ChineseSupplierForm.tsx
│   │   └── layout.tsx           # Auth layout
│   ├── api/                      # API routes and handlers
│   ├── dashboard/                # Role-based dashboards
│   │   ├── buyer/               # Buyer dashboard
│   │   ├── supplier/            # Supplier dashboard
│   │   ├── manufacturer/        # Manufacturer dashboard
│   │   └── admin/               # Admin dashboard
│   │       ├── users/           # User management
│   │       ├── deals/           # Deal management
│   │       ├── products/        # Product catalog
│   │       ├── disputes/        # Dispute resolution
│   │       ├── shipping/        # Shipping management
│   │       └── settings/        # System settings
│   ├── deals/                    # Deal management
│   │   ├── page.tsx             # Deal list
│   │   └── [id]/page.tsx        # Deal details
│   ├── marketplace/              # Marketplace features
│   │   ├── products/            # Browse products
│   │   ├── requests/            # Purchase requests
│   │   └── quotations/          # Supplier quotations
│   ├── lc/                       # Letter of Credit
│   │   ├── page.tsx             # LC management
│   │   └── [id]/page.tsx        # LC details
│   ├── lg/                       # Letter of Guarantee
│   │   ├── page.tsx             # LG management
│   │   └── [id]/page.tsx        # LG details
│   ├── shipping/                 # Shipping & Logistics
│   │   ├── page.tsx             # Shipment list
│   │   └── [id]/page.tsx        # Shipment tracking
│   ├── quality/                  # Quality Assurance
│   │   ├── page.tsx             # QA dashboard
│   │   └── [id]/page.tsx        # Quality details
│   ├── banking/                  # Banking Integration
│   │   ├── page.tsx             # Banking dashboard
│   │   └── statement/           # Account statements
│   ├── customs/                  # Customs Clearance
│   │   └── page.tsx             # Customs management
│   ├── partnerships/             # Partnerships
│   │   ├── manufacturing/       # Manufacturing partnerships
│   │   ├── labor/               # Labor partnerships
│   │   └── training/            # Training programs
│   ├── messages/                 # Real-time messaging
│   │   └── page.tsx             # Message interface
│   ├── notifications/            # Notifications
│   │   └── page.tsx             # Notifications center
│   ├── settings/                 # User settings
│   │   ├── profile/             # Profile management
│   │   ├── users/               # User management
│   │   └── workflow/            # Workflow configuration
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
│
├── components/                   # Reusable React components
│   ├── ui/                      # UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   ├── Timeline.tsx
│   │   ├── StatCard.tsx
│   │   ├── Tabs.tsx
│   │   ├── DataTable.tsx
│   │   ├── FileUpload.tsx
│   │   ├── TagInput.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── PhoneInput.tsx
│   │   └── PasswordStrength.tsx
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileNav.tsx
│   │   └── DashboardLayout.tsx
│   ├── landing/                 # Landing page components
│   ├── dashboard/               # Dashboard components
│   ├── marketplace/             # Marketplace components
│   │   ├── ProductCard.tsx
│   │   ├── RequestCard.tsx
│   │   ├── QuotationForm.tsx
│   │   └── ComparisonTable.tsx
│   ├── deals/                   # Deal components
│   ├── lc/                      # LC components
│   ├── shipping/                # Shipping components
│   ├── quality/                 # Quality components
│   ├── banking/                 # Banking components
│   │   ├── AccountCard.tsx
│   │   ├── TransactionList.tsx
│   │   ├── WireTransferForm.tsx
│   │   └── CurrencyExchange.tsx
│   ├── messages/                # Messaging components
│   ├── partnerships/            # Partnership components
│   ├── admin/                   # Admin components
│   └── layout/                  # Shared layout components
│
├── lib/                         # Utility functions
│   ├── utils.ts                # Common utilities
│   ├── constants.ts            # Application constants
│   ├── validation.ts           # Form validation
│   ├── store.ts                # State management
│   └── demo-data.ts            # Demo data generator
│
├── hooks/                       # Custom React hooks
│   └── useLocale.ts            # Language/locale hook
│
├── types/                       # TypeScript type definitions
│   └── index.ts                # Global types
│
├── styles/                      # Global styles
│
└── prisma/                      # Database schema
    ├── schema.prisma           # Prisma schema
    └── seed.ts                 # Database seeding

public/                          # Static assets
├── images/
└── icons/

next.config.js                   # Next.js configuration
tailwind.config.ts              # Tailwind CSS configuration
tsconfig.json                   # TypeScript configuration
package.json                    # Project dependencies
```

---

## Features
### المميزات

### 1. **Landing Page** — الصفحة الرئيسية
User-friendly landing page with feature highlights, testimonials, and call-to-action buttons for registration and login.

### 2. **Account System** — نظام الحسابات
- **Gulf Buyer Account** (مشتري خليجي): Browse products, create purchase requests, compare quotations
- **Chinese Supplier Account** (مورد صيني): List products, respond to requests, manage quotations
- **Manufacturer Account** (مصنع سعودي): Manage partnerships, production schedules, quality control

### 3. **Workflow & Approval System** — نظام سير العمل والموافقات
- Custom workflow stages
- Multi-level approval process
- Creator → Reviewer → Approver roles
- Status tracking and history

### 4. **Marketplace** — السوق الإلكترونية
- **Product Listings**: Browse Chinese products with detailed specifications
- **Purchase Requests**: Create and manage custom purchase requests
- **Quotations**: Supplier responses with pricing and terms

### 5. **Shipping & Logistics** — الشحن والخدمات اللوجستية
- Real-time shipment tracking
- Multiple shipping methods
- Customs documentation
- Delivery status updates

### 6. **Manufacturing Partnerships** — شراكات التصنيع
- Partnership agreements
- Production coordination
- Labor management
- Training programs

### 7. **Integrated Banking** — النظام البنكي المتكامل
- Account balance management
- Wire transfers
- Currency exchange (CNY ↔ SAR)
- Transaction history
- Al-Rajhi Bank integration ready

### 8. **Quality Assurance & Product Journey** — ضمان الجودة ورحلة المنتج
- Inspection reports
- Defect tracking
- Quality milestones
- Product certification

### 9. **Deal Management** — إدارة الصفقات
15-stage deal lifecycle:
1. Inquiry
2. Quotation
3. Negotiation
4. Agreement
5. LC Issuance
6. Payment Confirmation
7. Product Preparation
8. Quality Check
9. Packaging
10. Shipment Created
11. In Transit
12. Customs Clearance
13. Delivery
14. Quality Acceptance
15. Closed

### 10. **Letter of Credit (LC)** — خطاب الاعتماد
- LC request creation
- Bank approval tracking
- Document management
- Settlement processing

### 11. **Letter of Guarantee (LG)** — خطاب الضمان
- Guarantee issuance
- Terms and conditions
- Claim management
- Expiration tracking

### 12. **Customs Clearance** — تخليص جمركي
- Import/export documentation
- Duty calculations
- Clearance status tracking
- FASAH integration ready

### 13. **Messaging** — نظام الرسائل
- Real-time chat with Socket.io
- One-on-one and group conversations
- Message history
- Typing indicators

### 14. **Ratings & Reviews** — التقييمات والتقييمات
- Supplier ratings
- Product reviews
- Buyer feedback
- Dispute resolution

### 15. **Notifications** — الإشعارات
- Real-time notifications
- Email alerts
- SMS notifications (Twilio/Unifonic)
- Notification preferences

### 16. **Admin Panel** — لوحة التحكم الإدارية
- User management and verification
- Product catalog moderation
- Dispute resolution
- System settings and configurations
- Analytics and reporting

### 17. **PWA Support** — تطبيق ويب تقدمي
- Offline functionality
- App-like experience
- Push notifications
- Install to home screen

### 18. **Multi-language Support** — دعم اللغات المتعددة
- Arabic (RTL) - Full support
- English (LTR) - Full support
- Chinese - Preparation for future release

### 19. **Dark/Light Theme** — المواضيع المظلمة والفاتحة
- Theme switcher
- Persistent theme preference
- System theme detection

### 20. **API-Ready Integrations** — التكامل الجاهز للـ API
- Bank APIs
- Shipping APIs
- Customs APIs
- Payment gateways

---

## API Integrations Ready
### جاهز للربط

### Financial Services
- **Al-Rajhi Bank**
  - Letter of Credit (LC) issuance
  - Letter of Guarantee (LG) issuance
  - Wire transfers (SAR, USD, AED)
  - Account balance queries
  - Transaction statements

### Customs & Compliance
- **FASAH (Ministry of Commerce)**
  - Import/export documentation
  - Customs clearance
  - Duty calculations
  - Compliance verification

### B2B Marketplace
- **Alibaba API**
  - Product catalog synchronization
  - Supplier verification
  - Pricing feeds

### Shipping & Logistics
- **Major Shipping Companies**
  - Real-time shipment tracking
  - Pickup scheduling
  - Delivery confirmation

### Payment Methods
- **Mada**
- **Apple Pay**
- **Alipay** (for Chinese suppliers)

### Communication
- **Twilio** - SMS/OTP for international users
- **Unifonic** - SMS/OTP for Gulf region

### Translation (Future)
- **Google Translate API**
- **DeepL API**

---

## Roadmap

### Phase 1: MVP Launch (Current) ✅
- ✅ Core platform with 3 account types
- ✅ Marketplace functionality
- ✅ Basic deal management
- ✅ LC/LG templates
- ✅ Real-time messaging

### Phase 2: Bank & Payment Integration (Q2 2026)
- Al-Rajhi Bank API integration
- Payment gateway integration
- Automated LC processing
- Reconciliation system

### Phase 3: AI & Automation (Q3 2026)
- AI-powered product recommendations
- Auto-translation for Chinese products
- Smart deal suggestions
- Fraud detection

### Phase 4: Mobile Native Apps (Q4 2026)
- iOS app
- Android app
- Native push notifications
- Offline transaction sync

### Phase 5: Blockchain Supply Chain (Q1 2027)
- Blockchain for supply chain transparency
- Smart contracts for deals
- Cryptocurrency payments
- Decentralized dispute resolution

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Contact

For inquiries and support, contact us at:

📧 **Email:** info@chinagate.com
🌐 **Website:** www.chinagate.com
📱 **Phone:** Available in the app contact page

---

**Built with ❤️ for Gulf-China Trade**

*CHINA GATE — Your Gateway to International Trade*
