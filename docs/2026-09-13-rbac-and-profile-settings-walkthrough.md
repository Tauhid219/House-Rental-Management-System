# RBAC Management & Admin Profile Settings Walkthrough

**Date**: 2026-09-13  
**Status**: Completed & Verified (100% Automated Test Suite Passing, Vite Clean Build)

---

## 1. Executive Summary

This phase delivers an enterprise-grade **Role-Based Access Control (RBAC)** administration module and a dedicated **Admin Profile & Security Settings** interface seamlessly integrated into the AdminLTE 3 management dashboard for **Skyline Heights Residency**.

### Key Additions:
1. **RBAC Roles & Permissions Management**: Complete lifecycle to define custom roles, inspect user associations, and assign granular permissions across 10 functional modules via an interactive Permission Matrix.
2. **System Users & Role Assignment Directory**: Centralized user roster with real-time role reassignment, status management (active/inactive), search filtering, and critical self-demotion lockout prevention.
3. **Admin Profile & Security Center**: Dedicated profile management hub enabling authenticated managers and administrators to update personal contact details, rotate passwords, and review active role privileges.
4. **AdminLTE 3 Navigation Upgrades**: Dedicated sidebar categories (`ACCESS CONTROL (RBAC)` and `ACCOUNT & SETTINGS`) and enhanced top navbar user dropdown with role badges and direct navigation shortcuts.

---

## 2. Architectural Implementation

### A. Database & Schema Adjustments
- **Migration**: `database/migrations/2026_09_13_000010_update_users_role_to_string.php`
  - Converted the `users.role` column from strict MySQL `enum` to `string(50)` to ensure dynamically created custom roles can be assigned without schema constraint errors.
- **RBAC Permissions Extended** in `database/seeders/HouseRentalSeeder.php`:
  - Added permissions: `'view roles'`, `'manage roles'`, `'manage users'`.
  - Automatically synced with the core `admin` role and protected from inadvertent revocation.

### B. Backend Controllers & Routes
- **`App\Http\Controllers\Admin\RoleController`**:
  - `index()`: Returns all roles with counts of assigned users and granted permissions.
  - `create()` / `store()`: Interactive matrix for configuring new roles with grouped permissions.
  - `edit()` / `update()`: Modifies existing roles with system-role protections (prevents modifying system identifiers or stripping critical admin permissions).
  - `destroy()`: Safely removes custom roles while blocking deletion of system default roles (`admin`, `manager`, `tenant`) and roles currently bound to active users.
- **`App\Http\Controllers\Admin\UserManagementController`**:
  - `index()`: Paginated and searchable roster of all users.
  - `updateRole()`: Atomically updates both Spatie's `syncRoles()` and the `User` model's `role` column.
  - `updateStatus()`: Toggles account state between `active` and `inactive`.
  - **Safeguard**: Prevents the active session user from self-demoting from the `admin` role or deactivating their own account.
- **`App\Http\Controllers\Admin\AdminProfileController`**:
  - `edit()`: Renders the AdminLTE profile view with user metadata, account statistics, and role permission inspection.
  - `update()`: Updates user name, email, and contact phone number.
  - `updatePassword()`: Securely verifies the existing password before updating to the new password.

### C. Route Endpoints (`routes/web.php`)
```php
// Admin Profile & Account Settings (All Authenticated Staff)
Route::get('profile', [AdminProfileController::class, 'edit'])->name('profile.edit');
Route::patch('profile', [AdminProfileController::class, 'update'])->name('profile.update');
Route::put('profile/password', [AdminProfileController::class, 'updatePassword'])->name('profile.password');

// Role-Based Access Control (RBAC) Management (Admin Only)
Route::middleware(['role:admin'])->group(function () {
    Route::resource('roles', RoleController::class);
    Route::get('users', [UserManagementController::class, 'index'])->name('users.index');
    Route::patch('users/{user}/role', [UserManagementController::class, 'updateRole'])->name('users.role');
    Route::patch('users/{user}/status', [UserManagementController::class, 'updateStatus'])->name('users.status');
});
```

---

## 3. Frontend Views & UI Components

### 1. Roles & Permissions Directory (`resources/js/pages/admin/roles/index.tsx`)
- Renders cards displaying role name, system-default badge, assigned user count, and granted permissions summary.
- Provides quick links to configure role permissions or safely delete custom roles.

### 2. Role Creation & Permission Matrix (`resources/js/pages/admin/roles/create.tsx`, `edit.tsx`)
- Permission Matrix organized into 10 clean operational groups:
  1. Flats & Properties
  2. Tenants Directory
  3. Lease Agreements
  4. Rent Invoices & Billing
  5. Payments & Receipts
  6. Property Maintenance
  7. Building Expenses
  8. Financial Reports
  9. Tour Leads & Inquiries
  10. Access Control (RBAC)
- Includes one-click **"Select All"** / **"Deselect All"** per group and globally across the entire matrix.

### 3. System Users Directory (`resources/js/pages/admin/users/index.tsx`)
- Search by name, email, or phone; filter by role.
- Inline role assignment selector with immediate feedback.
- Visual badges for active roles (`ADMIN`, `MANAGER`, `TENANT`) and active/inactive status badges.

### 4. Admin Profile Settings (`resources/js/pages/admin/profile/index.tsx`)
- Two-column AdminLTE 3 layout:
  - **Left Column**: Avatar with online indicator, user role badge, account creation date, and a scrollable tag cloud displaying all active permissions.
  - **Right Column**: Personal information form (name, email, phone) and password change card with strength validation.

### 5. AdminLTE 3 Layout Integration (`resources/js/layouts/admin-layout.tsx`)
- **Sidebar**:
  - Added `ACCESS CONTROL (RBAC)` category for administrators (`Roles & Permissions`, `System Users`).
  - Added `ACCOUNT & SETTINGS` category (`Profile Settings`).
- **Navbar Dropdown**:
  - Displays authenticated user's name, email, and role badge.
  - Direct links to **Profile Settings** and **Manage RBAC**.

---

## 4. Verification & Testing

### A. Automated Feature & Unit Tests (`tests/Feature/RbacAndProfileTest.php`)
12 dedicated feature test cases:
- `admin can view roles directory`
- `non admin is forbidden from viewing roles` (HTTP 403 Forbidden verified)
- `admin can create new custom role` with specified permissions
- `admin can update role permissions`
- `system default roles cannot be deleted` (protection verified)
- `admin can delete unassigned custom role`
- `admin can view users list and filter`
- `admin can update user role`
- `admin cannot revoke their own admin role` (lockout safeguard verified)
- `user can view and update profile` (name, email, phone)
- `user can update password`
- `user cannot update password with incorrect current password`

### Full Test Suite Results:
```text
PASS  Tests\Unit\ExampleTest
PASS  Tests\Feature\AdminPortalTest
PASS  Tests\Feature\Auth\AuthenticationTest
PASS  Tests\Feature\Auth\EmailVerificationTest
PASS  Tests\Feature\Auth\PasswordConfirmationTest
PASS  Tests\Feature\Auth\PasswordResetTest
PASS  Tests\Feature\Auth\RegistrationTest
PASS  Tests\Feature\BillingAndPaymentTest
PASS  Tests\Feature\DashboardTest
PASS  Tests\Feature\ExampleTest
PASS  Tests\Feature\MaintenanceAndExpenseTest
PASS  Tests\Feature\RbacAndProfileTest
PASS  Tests\Feature\Settings\PasswordUpdateTest
PASS  Tests\Feature\Settings\ProfileUpdateTest

Tests:    58 passed (142 assertions)
Duration: 9.32s
```

### B. Frontend Production Asset Build
```text
✓ 2043 modules transformed.
✓ built in 24.27s
```
Zero build warnings, zero TypeScript errors.
