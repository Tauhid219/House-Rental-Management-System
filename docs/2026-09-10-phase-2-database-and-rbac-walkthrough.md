# Phase 2 Walkthrough: Database Architecture, Migrations, Seeders & Spatie RBAC

- **Project:** House & Rental Property Management System
- **Date:** September 10, 2026
- **Author:** Software Engineering Team
- **Stack:** Laravel 12.x, PHP 8.2+, MySQL 8.0+, Spatie Laravel Permission 6.25, Inertia.js React, Tailwind CSS

---

## 1. Overview & Objectives

In Phase 2, we designed, implemented, and verified the complete database architecture and role-based access control (RBAC) foundation for the House & Rental Management System. This includes strict foreign-key constraints, cascading relationships, full seed data for realistic prototyping, and Spatie RBAC integration.

---

## 2. Database Migrations & Schema Specifications

The following tables and relationships were created with strict foreign keys and indexed columns:

| Table Name | Description | Key Fields & Constraints |
|---|---|---|
| `users` | Multi-role authentication accounts | `id`, `name`, `email` (unique), `phone`, `role` (enum: 'admin', 'manager', 'tenant'), `status` (enum: 'active', 'inactive'), `avatar`, `password`, timestamps |
| `flats` | Rental units & apartments | `id`, `flat_number` (unique), `floor`, `size_sqft`, `bedrooms`, `bathrooms`, `balconies`, `rent_cost`, `status` (enum: 'vacant', 'occupied', 'maintenance'), `description`, `amenities` (JSON), `images` (JSON), timestamps |
| `tenants` | Resident tenant profiles | `id`, `user_id` (nullable FK to `users`), `name`, `nid_passport` (index), `phone`, `email`, `emergency_contact`, `photo_path`, `nid_doc_path`, `occupation`, `family_members`, `permanent_address`, `status` (enum: 'active', 'past'), timestamps |
| `leases` | Unit assignments (Contracts) | `id`, `tenant_id` (FK to `tenants`), `flat_id` (FK to `flats`), `start_date`, `end_date`, `agreed_monthly_rent`, `security_deposit`, `advance_paid`, `status` (enum: 'active', 'closed'), timestamps |
| `rent_invoices` | Monthly billing invoices | `id`, `invoice_no` (unique), `lease_id` (FK to `leases`), `tenant_id` (FK to `tenants`), `billing_month` (YYYY-MM index), `rent_amount`, `utility_charges`, `other_charges`, `discount`, `total_payable`, `paid_amount`, `due_date`, `status` (enum: 'unpaid', 'partially_paid', 'paid'), timestamps |
| `payments` | Transactions & money receipts | `id`, `payment_no` (unique), `invoice_id` (nullable FK to `rent_invoices`), `lease_id` (FK to `leases`), `amount_paid`, `payment_method` (enum: 'cash', 'bank', 'bkash', 'nagad', 'other'), `transaction_id`, `payment_date`, `received_by_user_id` (nullable FK to `users`), `notes`, timestamps |
| `maintenances` | Repair & maintenance logs | `id`, `flat_id` (FK to `flats`), `title`, `description`, `cost`, `reported_date`, `completed_date`, `status` (enum: 'pending', 'in_progress', 'completed'), timestamps |
| `expenses` | Building overheads & operational expenses | `id`, `category` (enum: 'maintenance', 'utility', 'salary', 'tax', 'others'), `title`, `amount`, `expense_date`, `voucher_path`, `notes`, timestamps |
| `contacts` | Public frontend visit requests & inquiries | `id`, `name`, `email`, `phone`, `preferred_flat_type`, `visit_date`, `message`, `status` (enum: 'new', 'contacted', 'closed'), timestamps |
| `subscribers` | Newsletter email subscriptions | `id`, `email` (unique), timestamps |
| Spatie Permission Tables | Role & permission storage | `roles`, `permissions`, `model_has_roles`, `model_has_permissions`, `role_has_permissions` |

---

## 3. Eloquent Models & Relationship Mapping

1. **`User` (`app/Models/User.php`)**:
   - Uses `Spatie\Permission\Traits\HasRoles`.
   - Role check helpers: `isAdmin()`, `isManager()`, `isTenant()`.
   - Relationships: `hasOne(Tenant::class)`, `hasMany(Payment::class, 'received_by_user_id')`.
2. **`Flat` (`app/Models/Flat.php`)**:
   - JSON casts: `amenities => 'array'`, `images => 'array'`.
   - Scopes: `scopeVacant()`, `scopeOccupied()`, `scopeMaintenance()`.
   - Relationships: `hasMany(Lease::class)`, `hasOne(Lease::class)->latestOfMany()` (`currentLease`), `hasMany(Maintenance::class)`.
3. **`Tenant` (`app/Models/Tenant.php`)**:
   - Relationships: `belongsTo(User::class)`, `hasMany(Lease::class)`, `hasOne(Lease::class)->latestOfMany()` (`activeLease`), `hasMany(RentInvoice::class)`, `hasMany(Payment::class)`.
4. **`Lease` (`app/Models/Lease.php`)**:
   - Date & decimal casts.
   - Relationships: `belongsTo(Tenant::class)`, `belongsTo(Flat::class)`, `hasMany(RentInvoice::class)`, `hasMany(Payment::class)`.
   - Scope: `scopeActive()`.
5. **`RentInvoice` (`app/Models/RentInvoice.php`)**:
   - Dynamic computed attribute: `due_amount` (`total_payable - paid_amount`).
   - Relationships: `belongsTo(Lease::class)`, `belongsTo(Tenant::class)`, `hasMany(Payment::class, 'invoice_id')`.
6. **`Payment` (`app/Models/Payment.php`)**:
   - Relationships: `belongsTo(RentInvoice::class, 'invoice_id')`, `belongsTo(Lease::class)`, `belongsTo(User::class, 'received_by_user_id')`.
7. **`Maintenance` (`app/Models/Maintenance.php`)**:
   - Relationships: `belongsTo(Flat::class)`.
8. **`Expense` (`app/Models/Expense.php`)**:
   - Casts for amount and date.
9. **`Contact` & `Subscriber` (`app/Models/Contact.php`, `app/Models/Subscriber.php`)**:
   - Captures prospective tenant leads and email newsletters.

---

## 4. Spatie Role-Based Access Control (RBAC)

### 4.1 Middleware Aliases (`bootstrap/app.php`)
```php
$middleware->alias([
    'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
    'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
    'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
]);
```

### 4.2 Seeded Permissions Matrix (`php artisan permission:show`)
```text
+---------------------+-------+---------+--------+
| Permission          | admin | manager | tenant |
+---------------------+-------+---------+--------+
| create expenses     |   ✔   |    ✔    |   ·    |
| create flats        |   ✔   |    ✔    |   ·    |
| create invoices     |   ✔   |    ✔    |   ·    |
| create leases       |   ✔   |    ✔    |   ·    |
| create maintenances |   ✔   |    ✔    |   ·    |
| create payments     |   ✔   |    ✔    |   ·    |
| create tenants      |   ✔   |    ✔    |   ·    |
| delete flats        |   ✔   |    ·    |   ·    |
| delete invoices     |   ✔   |    ·    |   ·    |
| delete leases       |   ✔   |    ·    |   ·    |
| delete tenants      |   ✔   |    ·    |   ·    |
| edit expenses       |   ✔   |    ✔    |   ·    |
| edit flats          |   ✔   |    ✔    |   ·    |
| edit invoices       |   ✔   |    ✔    |   ·    |
| edit leases         |   ✔   |    ✔    |   ·    |
| edit maintenances   |   ✔   |    ✔    |   ·    |
| edit tenants        |   ✔   |    ✔    |   ·    |
| view contacts       |   ✔   |    ✔    |   ·    |
| view expenses       |   ✔   |    ✔    |   ·    |
| view flats          |   ✔   |    ✔    |   ✔    |
| view invoices       |   ✔   |    ✔    |   ✔    |
| view leases         |   ✔   |    ✔    |   ·    |
| view maintenances   |   ✔   |    ✔    |   ·    |
| view payments       |   ✔   |    ✔    |   ✔    |
| view reports        |   ✔   |    ✔    |   ·    |
| view tenants        |   ✔   |    ✔    |   ·    |
+---------------------+-------+---------+--------+
```

---

## 5. Seeded Test Data & Credentials

### 5.1 System Accounts
| Role | Name | Email | Default Password | Notes |
|---|---|---|---|---|
| **Super Admin** | Tauhidur Rahman | `admin@rental.com` | `password123` | Full system control |
| **Property Manager** | Arif Hassan | `manager@rental.com` | `password123` | Daily operations, leases & billing |
| **Tenant 1** | Tanvir Ahmed | `tanvir.ahmed@example.com` | `tenant123` | Occupies Flat 201-A |
| **Tenant 2** | Dr. Nusrat Jahan | `dr.nusrat@example.com` | `tenant123` | Occupies Flat 301-A |
| **Tenant 3** | Mahmudul Hasan | `mahmudul.h@example.com` | `tenant123` | Occupies Flat 401-A |
| **Tenant 4** | Sabrina Sultana | `sabrina.s@example.com` | `tenant123` | Active resident candidate |
| **Tenant 5** | Kamrul Islam | `kamrul.islam@example.com` | `tenant123` | Past tenant record |

### 5.2 Property Flats Summary
- **Total Flats:** 10 units (Floors 1 to 5)
  - **Vacant (6 units):** 101-A, 102-B, 202-B, 302-B, 402-B, 501-PENT (Penthouse)
  - **Occupied (3 units):** 201-A, 301-A, 401-A
  - **Under Maintenance (1 unit):** 502-B
- Each unit includes high-resolution Unsplash interior photos, realistic room distributions, and amenity lists.

### 5.3 Financial & Operational Records
- **Active Leases:** 3 leases with security deposits and advance payments logged.
- **Invoices:** 5 invoices across previous and current months (fully paid, partially paid, and unpaid).
- **Payments:** 4 payments logged through bank transfer, bKash, Nagad, and cash.
- **Maintenance Records:** 2 logs (AC servicing completed; bathroom piping in progress).
- **Operating Expenses:** 5 realistic building expense entries (staff salaries, elevator maintenance, standby generator diesel, common electricity, pest control).
- **Public Leads:** 2 scheduled tour inquiries and 3 newsletter subscribers.

---

## 6. Verification Status

All database tables, constraints, seeds, and permission checks passed validation cleanly:
```bash
php artisan migrate:fresh --seed
php artisan permission:show
```
Status: **Ready for Phase 3 (Client-Facing Frontend & Showcase Pages).**
