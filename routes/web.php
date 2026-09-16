<?php

use App\Http\Controllers\Admin\AdminProfileController;
use App\Http\Controllers\Admin\ContactInquiryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ExpenseController;
use App\Http\Controllers\Admin\FlatController;
use App\Http\Controllers\Admin\LeaseController;
use App\Http\Controllers\Admin\MaintenanceController;
use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\Admin\RentInvoiceController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\TenantController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\FrontendController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Client-Facing Routes
|--------------------------------------------------------------------------
*/
Route::get('/', [FrontendController::class, 'home'])->name('home');
Route::get('/flats', [FrontendController::class, 'flats'])->name('flats.index');
Route::get('/flats/{flat}', [FrontendController::class, 'showFlat'])->name('flats.show');
Route::post('/contact', [FrontendController::class, 'contactStore'])->name('contact.store');
Route::post('/subscribe', [FrontendController::class, 'subscribe'])->name('subscribe.store');

/*
|--------------------------------------------------------------------------
| Authenticated Management Routes (Admin & Property Managers)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('admin')->name('admin.')->group(function () {
        // Flats Management CRUD
        Route::resource('flats', FlatController::class);

        // Tenants Management CRUD
        Route::resource('tenants', TenantController::class);

        // Leases Management
        Route::get('leases', [LeaseController::class, 'index'])->name('leases.index');
        Route::get('leases/create', [LeaseController::class, 'create'])->name('leases.create');
        Route::post('leases', [LeaseController::class, 'store'])->name('leases.store');
        Route::post('leases/{lease}/terminate', [LeaseController::class, 'terminate'])->name('leases.terminate');

        // Rent Invoices & Billing
        Route::get('invoices', [RentInvoiceController::class, 'index'])->name('invoices.index');
        Route::get('invoices/create', [RentInvoiceController::class, 'create'])->name('invoices.create');
        Route::post('invoices', [RentInvoiceController::class, 'store'])->name('invoices.store');
        Route::post('invoices/batch', [RentInvoiceController::class, 'generateBatch'])->name('invoices.batch');
        Route::get('invoices/{invoice}', [RentInvoiceController::class, 'show'])->name('invoices.show');
        Route::delete('invoices/{invoice}', [RentInvoiceController::class, 'destroy'])->name('invoices.destroy');

        // Payments Collection & Transactions
        Route::get('payments', [PaymentController::class, 'index'])->name('payments.index');
        Route::get('payments/create', [PaymentController::class, 'create'])->name('payments.create');
        Route::post('payments', [PaymentController::class, 'store'])->name('payments.store');
        Route::get('payments/{payment}/receipt', [PaymentController::class, 'receipt'])->name('payments.receipt');

        // Flat Maintenance Management
        Route::resource('maintenances', MaintenanceController::class);

        // Building Operational Expenses
        Route::resource('expenses', ExpenseController::class);

        // Financial & Collection Reports
        Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
        Route::get('reports/collection', [ReportController::class, 'collection'])->name('reports.collection');
        Route::get('reports/dues', [ReportController::class, 'dueList'])->name('reports.dues');
        Route::get('reports/income-expense', [ReportController::class, 'incomeExpense'])->name('reports.income-expense');

        // Website Inquiries & Leads
        Route::get('contacts', [ContactInquiryController::class, 'index'])->name('contacts.index');
        Route::patch('contacts/{contact}/status', [ContactInquiryController::class, 'updateStatus'])->name('contacts.status');
        Route::delete('contacts/{contact}', [ContactInquiryController::class, 'destroy'])->name('contacts.destroy');

        // Admin Profile & Account Settings
        Route::get('profile', [AdminProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('profile', [AdminProfileController::class, 'update'])->name('profile.update');
        Route::put('profile/password', [AdminProfileController::class, 'updatePassword'])->name('profile.password');

        // Role-Based Access Control (RBAC) Management (Admin Only)
        Route::middleware(['role:admin'])->group(function () {
            Route::resource('roles', RoleController::class);
            Route::get('users', [UserManagementController::class, 'index'])->name('users.index');
            Route::post('users', [UserManagementController::class, 'store'])->name('users.store');
            Route::patch('users/{user}/role', [UserManagementController::class, 'updateRole'])->name('users.role');
            Route::patch('users/{user}/status', [UserManagementController::class, 'updateStatus'])->name('users.status');
            Route::delete('users/{user}', [UserManagementController::class, 'destroy'])->name('users.destroy');
        });
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
