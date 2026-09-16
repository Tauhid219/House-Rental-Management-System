# Skyline Heights — House & Property Rental Management System

[![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![Inertia.js](https://img.shields.io/badge/Inertia.js_v2-9553E9?style=for-the-badge&logo=inertia&logoColor=white)](https://inertiajs.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PHP](https://img.shields.io/badge/PHP_8.2+-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://php.net)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

A full-stack, enterprise-grade **House & Rental Property Management System** designed for residential building owners, property managers, and tenants. Built on top of **Laravel**, **Inertia.js v2**, **React 19**, and **Tailwind CSS**, featuring an authentic **AdminLTE 3** management portal alongside a public-facing property showcase website.

---

## 🌟 Key Highlights & Features

### 1. 🏢 Public Showcase & Marketing Website
- **Landing Page:** Interactive building overview with virtual amenities, floor plans, resident testimonials, and neighborhood highlights.
- **Available Flats Directory:** Live search and filtering by bedroom count (BHK), floor, price range, and size (sqft).
- **Unit Detail Pages:** Image galleries, architectural specs, rental breakdown, and direct tour inquiry form.
- **Tour Booking & Inquiries:** Instant lead capture with real-time sync into the Admin inquiries inbox.

### 2. ⚡ Authentic AdminLTE 3 Management Portal
- **Signature UI/UX:** AdminLTE 3 dark charcoal sidebar (`#343a40`), primary blue accents (`#007bff`), and responsive layout.
- **Navbar Theme Switcher:** 1-click switcher with support for **Light**, **Dark**, and **System** color modes with persistent preference in `localStorage`.
- **Interactive Dashboard:** Real-time KPI small-boxes for Active Leases, Monthly Revenue, Outstanding Dues, and Maintenance alerts.
- **Units & Flats Management:** Full CRUD with automatic occupancy status tracking (`vacant`, `occupied`, `maintenance`).
- **Tenants Directory:** Comprehensive resident profiles including NID/Passport, emergency contacts, occupation, and payment history.
- **Lease Agreements:** Digital lease contracts with automated flat status transitions upon creation or termination.

### 3. 🧾 Financial Billing & Printable Slips (Excel Integration)
- **Detailed Utility Breakdown:**
  - Monthly Rent (মাসিক ভাড়া)
  - Water Bill (পানি বিল — individual unit usage)
  - Service Charge (সার্ভিস চার্জ — fixed building maintenance)
  - Prepaid Gas & Prepaid Electricity meter indicators
  - Advance Adjustments & Commercial / Shop Rent line items
- **Bangladeshi Number-to-Words Engine:** Automatic conversion of amounts to currency words (e.g., *Twenty Thousand Six Hundred Taka Only*), resolving Excel `#NAME?` macro errors.
- **Dual-Copy Print Slip (A4 Side-by-Side):**
  - Toggleable view matching standard Bangladeshi property management slips.
  - Generates **Tenant Copy** and **Office Copy** side-by-side with a cut-line (`✂ CUT HERE`), payment deadline rule (7th of month), Paid-On line, and Owner Signature blocks.
- **Formal Corporate Invoice:** Alternate view for corporate accounting and tax record-keeping.
- **Batch Monthly Billing:** 1-click batch invoice generation for all active leases with pre-configured utility defaults.

### 4. 💳 Payment Collections & Money Receipts
- **Partial & Full Collections:** Record payments via Cash, Bank Wire, or Mobile Banking (bKash, Nagad).
- **Printable Money Receipts:** Computerized money receipts with duplicate copies and instant balance updates.
- **Automatic Balance Reconciliation:** Real-time calculation of paid vs. outstanding dues per invoice.

### 5. 🛠 Maintenance Ticketing & Building Expenses
- **Maintenance Lifecycle:** Tenant service requests tracking from reported ➔ in-progress ➔ resolved.
- **Expense Ledger:** Building operational expenditure logging (lift repairs, standby generator fuel, security staff, common area lighting).

### 6. 📊 Financial Reports & Analytics
- **Rent Collection Report:** Filterable date-range revenue statement.
- **Outstanding Dues / Defaulters List:** Immediate identification of overdue tenant balances.
- **Profit & Loss (Income vs. Expense) Statement:** Automated monthly net profit margin calculations with print-ready tables.

### 7. 🔐 Spatie Role-Based Access Control (RBAC) & Security
- Granular permissions matrix for **Admin**, **Property Manager**, and **Tenant** roles.
- System User Management, role assignments, profile settings, and secure password updates.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Backend Framework** | [Laravel 11 / 12](https://laravel.com) |
| **Language** | [PHP 8.2+](https://php.net) |
| **Frontend Framework** | [React 19](https://react.dev) with [TypeScript](https://www.typescriptlang.org) |
| **Glue Layer** | [Inertia.js v2](https://inertiajs.com) (Server-driven Single-Page Application) |
| **Styling & Theme** | [Tailwind CSS v4](https://tailwindcss.com) + [AdminLTE 3](https://adminlte.io) UI |
| **Component Primitives** | [Radix UI](https://www.radix-ui.com) & [Lucide Icons](https://lucide.dev) |
| **Authorization** | [Spatie Laravel-Permission](https://spatie.be/docs/laravel-permission) |
| **Database** | MySQL / MariaDB (XAMPP compatible) |
| **Bundler** | [Vite 6](https://vitejs.dev) |

---

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites
- **PHP** >= 8.2 (with `pdo`, `mbstring`, `openssl`, `curl` extensions enabled)
- **Composer** >= 2.x
- **Node.js** >= 20.x & **npm**
- **MySQL** / MariaDB (e.g., via XAMPP)

---

### Step-by-Step Installation

#### 1. Clone the repository
```bash
git clone https://github.com/your-username/House-Rental-Management-System.git
cd House-Rental-Management-System
```

#### 2. Install PHP dependencies
```bash
composer install
```

#### 3. Install Node.js dependencies
```bash
npm install
```

#### 4. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Configure your database credentials in `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=house_rental_db
DB_USERNAME=root
DB_PASSWORD=
```

#### 5. Generate Application Key
```bash
php artisan key:generate
```

#### 6. Run Migrations & Seeders
```bash
php artisan migrate --seed
```

*(Optional)* To seed real-world tenant and unit billing data (Uttara Plot 54):
```bash
php artisan db:seed --class=ClientUttaraPropertySeeder
```

#### 7. Build Frontend Assets
For local development with Hot Module Replacement (HMR):
```bash
npm run dev
```
Or to build for production:
```bash
npm run build
```

#### 8. Serve the Application
```bash
php artisan serve
```
Visit the application in your browser at: **`http://127.0.0.1:8000`**

---

## 🔑 Default Login Credentials

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Super Admin** | `admin@rental.com` | `password123` | Full access to all modules, RBAC, billing, and settings |
| **Property Manager** | `manager@rental.com` | `password123` | Operational access to flats, tenants, leases, invoices, and reports |

---

## 📂 Project Architecture

```plaintext
House-Rental-Management-System/
├── app/
│   ├── Helpers/
│   │   └── NumberToWordsHelper.php      # Currency to words converter
│   ├── Http/
│   │   ├── Controllers/Admin/           # Flat, Tenant, Lease, Invoice, Payment, Report Controllers
│   │   ├── Controllers/Frontend/        # Public landing, flat catalog, tour inquiry controllers
│   │   └── Requests/Admin/              # Form request validation rules
│   └── Models/                          # Flat, Tenant, Lease, RentInvoice, Payment, Expense, etc.
├── database/
│   ├── migrations/                      # Database schema migrations
│   └── seeders/                         # Database and client data seeders
├── docs/                                # Phase-by-phase architectural walkthroughs
├── resources/
│   ├── js/
│   │   ├── components/                  # AdminLTE & UI components (dropdowns, theme switcher)
│   │   ├── hooks/                       # useAppearance, useMobile hooks
│   │   ├── layouts/
│   │   │   ├── admin-layout.tsx         # AdminLTE 3 shell with sidebar & navbar theme switcher
│   │   │   └── frontend-layout.tsx      # Public website shell
│   │   └── pages/
│   │       ├── admin/                   # Invoices (Dual-Copy slip & formal), Flats, Tenants, Reports
│   │       ├── auth/                    # AdminLTE 3 login and authentication pages
│   │       └── frontend/                # Public home, flat catalog, flat show
└── routes/
    ├── web.php                          # Application routes
    └── auth.php                         # Authentication routes
```

---

## 📖 Detailed Documentation

Step-by-step development logs and walkthroughs are available in the [`docs/`](./docs) folder:
- [Phase 2: Database & Spatie RBAC Walkthrough](./docs/2026-09-10-phase-2-database-and-rbac-walkthrough.md)
- [Phase 3: Client-Facing Frontend Showcase Walkthrough](./docs/2026-09-10-phase-3-frontend-walkthrough.md)
- [Phase 4: AdminLTE 3 Styled Admin Portal Walkthrough](./docs/2026-09-10-phase-4-admin-portal-walkthrough.md)
- [Phase 5: Financial Billing & Payments Walkthrough](./docs/2026-09-10-phase-5-billing-and-payments-walkthrough.md)
- [Phase 6: Maintenance, Expenses & Reports Walkthrough](./docs/2026-09-12-phase-6-maintenance-expenses-reports-walkthrough.md)
- [RBAC & Admin Profile Settings Walkthrough](./docs/2026-09-13-rbac-and-profile-settings-walkthrough.md)
- [Client Excel Billing Integration Walkthrough](./docs/2026-09-16-client-excel-billing-integration-walkthrough.md)

---

## 📄 License

This software is licensed under the [MIT License](LICENSE).
