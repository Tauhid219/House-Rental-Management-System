# Phase 6: Maintenance, Building Expenses, Printable Money Receipts & Financial Reports Engine Walkthrough

**Date:** 2026-09-12  
**Status:** Completed & Fully Tested  
**Repository:** [Tauhid219/House-Rental-Management-System](https://github.com/Tauhid219/House-Rental-Management-System.git)  
**Stack:** Laravel 12, Inertia.js v2 (React 19), TypeScript, Tailwind CSS v4, AdminLTE 3 UI Elements  

---

## 1. Executive Summary

In **Phase 6**, the system completed its operational and financial governance lifecycle:
1. **Maintenance & Repair Tracking**: End-to-end ticketing system for tenant-reported and property-level maintenance requests with status tracking (`pending`, `in_progress`, `completed`, `cancelled`), priority classification, cost recording, and unit associations.
2. **Building & Utility Expenses Management**: Recording operational overheads (generator fuel, lift maintenance, security salaries, municipal taxes, common area electricity/water) with category analytics and date-range filtering.
3. **Official Dual-Copy Money Receipts**: Printable 80mm/A5 paper slips (`admin.payments.receipt`) featuring tenant details, unit number, month billed, transaction ID, payment method, receiving authority signature, and a tear-off tenant copy.
4. **Financial Reports Engine**:
   - **Monthly Collection Report**: Visual metrics, breakdown by payment modes (Cash, Bank, bKash, Nagad), and chronological transaction ledger.
   - **Tenant Due List Report**: Defaulters directory with overdue days badge, outstanding balances, and direct payment action links.
   - **Income vs. Expense Statement (P&L)**: Net operating profit/loss calculations with side-by-side month comparison cards and margin badges.

---

## 2. Architecture & File Breakdown

### Backend Form Requests & Validation
- [`StoreMaintenanceRequest.php`](file:///c:/xampp/htdocs/Practice/House-Rental-Management-System/app/Http/Requests/Admin/StoreMaintenanceRequest.php): Validates unit selection, issue title, description, priority (`low`, `medium`, `high`, `urgent`), cost, and initial status.
- [`UpdateMaintenanceRequest.php`](file:///c:/xampp/htdocs/Practice/House-Rental-Management-System/app/Http/Requests/Admin/UpdateMaintenanceRequest.php): Validates resolution status changes and actual maintenance cost additions.
- [`StoreExpenseRequest.php`](file:///c:/xampp/htdocs/Practice/House-Rental-Management-System/app/Http/Requests/Admin/StoreExpenseRequest.php): Validates category, description, expense amount, payment method, and expense date.
- [`UpdateExpenseRequest.php`](file:///c:/xampp/htdocs/Practice/House-Rental-Management-System/app/Http/Requests/Admin/UpdateExpenseRequest.php): Enforces update safety for building expenses.

### Backend Controllers & Endpoints
- [`MaintenanceController.php`](file:///c:/xampp/htdocs/Practice/House-Rental-Management-System/app/Http/Controllers/Admin/MaintenanceController.php):
  - `index`: Paginated directory with search and priority/status filtering, metrics for active vs. resolved issues, and total repair expenses.
  - `create` / `store`: Ticket generation with auto-filled tenant lease relationships.
  - `edit` / `update`: Status lifecycle transition and repair cost updates.
  - `destroy`: Ticket deletion with authorization.
- [`ExpenseController.php`](file:///c:/xampp/htdocs/Practice/House-Rental-Management-System/app/Http/Controllers/Admin/ExpenseController.php):
  - `index`: Building expenses directory with category filters and cumulative expense sums.
  - `create` / `store`: Standardized expense logging.
  - `edit` / `update`: Expense modification and correction.
  - `destroy`: Expense log deletion.
- [`PaymentController.php`](file:///c:/xampp/htdocs/Practice/House-Rental-Management-System/app/Http/Controllers/Admin/PaymentController.php):
  - Enhanced `store`: Auto-generates unique sequential payment numbering (`PAY-YYYYMM-XXXXX`), automatically transitions invoice status, and immediately redirects to the printable money receipt.
  - Added `receipt`: Prepares payment, tenant, unit, and receiver details for paper slip printing.
- [`ReportController.php`](file:///c:/xampp/htdocs/Practice/House-Rental-Management-System/app/Http/Controllers/Admin/ReportController.php):
  - `index`: Financial hub dashboard with quick-access cards to all financial statements.
  - `collection`: Date-ranged collection reports with method breakdown (Cash, Bank, bKash, Nagad).
  - `dueList`: Comprehensive tenant overdue balances report with calculated aging/days past due.
  - `incomeExpense`: Net profit and margin statement comparing total rental collections against building operational expenses.

### Frontend React (Inertia v2 & Tailwind CSS)
- **Maintenance UI**:
  - [`resources/js/pages/admin/maintenances/index.tsx`](file:///c:/xampp/htdocs/Practice/House-Rental-Management-System/resources/js/pages/admin/maintenances/index.tsx): Filterable table, priority badges (`urgent` pulsating red), status dropdowns, and repair cost tallies.
  - [`resources/js/pages/admin/maintenances/create.tsx`](file:///c:/xampp/htdocs/Practice/House-Rental-Management-System/resources/js/pages/admin/maintenances/create.tsx): Ticket submission form with flat selector.
  - [`resources/js/pages/admin/maintenances/edit.tsx`](file:///c:/xampp/htdocs/Practice/House-Rental-Management-System/resources/js/pages/admin/maintenances/edit.tsx): Ticket resolution and cost finalization.
- **Expenses UI**:
  - [`resources/js/pages/admin/expenses/index.tsx`](file:///c:/xampp/htdocs/Practice/House-Rental-Management-System/resources/js/pages/admin/expenses/index.tsx): Expense ledger with category pill badges and total spent analytics.
  - [`resources/js/pages/admin/expenses/create.tsx`](file:///c:/xampp/htdocs/Practice/House-Rental-Management-System/resources/js/pages/admin/expenses/create.tsx): Quick expense voucher input.
  - [`resources/js/pages/admin/expenses/edit.tsx`](file:///c:/xampp/htdocs/Practice/House-Rental-Management-System/resources/js/pages/admin/expenses/edit.tsx): Voucher edit and adjustment form.
- **Printable Money Receipt**:
  - [`resources/js/pages/admin/payments/receipt.tsx`](file:///c:/xampp/htdocs/Practice/House-Rental-Management-System/resources/js/pages/admin/payments/receipt.tsx): Dual-copy design (Office Copy + Tenant Copy) with CSS `@media print` rules, watermarks, signature boxes, and one-click browser print trigger.
  - [`resources/js/pages/admin/payments/index.tsx`](file:///c:/xampp/htdocs/Practice/House-Rental-Management-System/resources/js/pages/admin/payments/index.tsx): Added direct "Receipt" button with printable slip icon.
- **Financial Reports UI**:
  - [`resources/js/pages/admin/reports/index.tsx`](file:///c:/xampp/htdocs/Practice/House-Rental-Management-System/resources/js/pages/admin/reports/index.tsx): Executive financial portal with key summary stats and report launchers.
  - [`resources/js/pages/admin/reports/collection.tsx`](file:///c:/xampp/htdocs/Practice/House-Rental-Management-System/resources/js/pages/admin/reports/collection.tsx): Date-filter collection audit with payment mode aggregates.
  - [`resources/js/pages/admin/reports/dues.tsx`](file:///c:/xampp/htdocs/Practice/House-Rental-Management-System/resources/js/pages/admin/reports/dues.tsx): Aging due list with quick "Collect" shortcuts.
  - [`resources/js/pages/admin/reports/income-expense.tsx`](file:///c:/xampp/htdocs/Practice/House-Rental-Management-System/resources/js/pages/admin/reports/income-expense.tsx): P&L summary showing net revenue, expense burdens, and net margins.

### Navigation Updates
- [`resources/js/layouts/admin-layout.tsx`](file:///c:/xampp/htdocs/Practice/House-Rental-Management-System/resources/js/layouts/admin-layout.tsx): Added Maintenance (`Wrench`), Building Expenses (`Coins`), and Financial Reports (`BarChart3`) to the sidebar.

---

## 3. Automated Testing Suite

A dedicated feature test suite was created in [`tests/Feature/MaintenanceAndExpenseTest.php`](file:///c:/xampp/htdocs/Practice/House-Rental-Management-System/tests/Feature/MaintenanceAndExpenseTest.php) verifying:
1. `admin can access maintenance directory`
2. `admin can create maintenance record`
3. `admin can access expenses directory`
4. `admin can create expense record`
5. `admin can access payment receipt`
6. `admin can access financial reports`

All existing test suites were updated and validated:
```bash
php artisan test
# Tests: 46 passed (106 assertions)
# Duration: 5.20s
```

---

## 4. Summary of Master Prompt Completion

With Phase 6 concluded, the entire 6-Phase Master Prompt specification has been successfully implemented, verified, and documented:
- **Phase 1 & 2**: Database Architecture, Seeders & Spatie RBAC
- **Phase 3**: Public Client Showcase & Booking Leads Portal
- **Phase 4**: AdminLTE 3 Management Dashboard (Flats, Tenants, Leases, Leads)
- **Phase 5**: Batch Monthly Billing & Payment Collection System
- **Phase 6**: Maintenance, Building Expenses, Printable Money Receipts & Financial Reports
