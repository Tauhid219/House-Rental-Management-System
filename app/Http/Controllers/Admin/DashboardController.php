<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Flat;
use App\Models\Lease;
use App\Models\RentInvoice;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $totalFlats = Flat::count();
        $vacantFlats = Flat::where('status', 'vacant')->count();
        $occupiedFlats = Flat::where('status', 'occupied')->count();
        $maintenanceFlats = Flat::where('status', 'maintenance')->count();

        $activeTenants = Tenant::where('status', 'active')->count();
        $activeLeases = Lease::where('status', 'active')->count();

        $monthlyRentExpected = Lease::where('status', 'active')->sum('agreed_monthly_rent');
        
        $pendingInvoicesCount = RentInvoice::whereIn('status', ['unpaid', 'partially_paid'])->count();
        $pendingInvoicesSum = RentInvoice::whereIn('status', ['unpaid', 'partially_paid'])->sum(DB::raw('total_payable - paid_amount'));
        $paidInvoicesSum = RentInvoice::sum('paid_amount');

        $newContactsCount = Contact::where('status', 'new')->count();

        $recentLeases = Lease::with(['tenant', 'flat'])
            ->latest()
            ->take(5)
            ->get();

        $recentContacts = Contact::latest()
            ->take(5)
            ->get();

        $flatsByFloor = Flat::selectRaw('floor, count(*) as total, sum(case when status = "vacant" then 1 else 0 end) as vacant_count')
            ->groupBy('floor')
            ->orderBy('floor')
            ->get();

        return Inertia::render('dashboard', [
            'stats' => [
                'total_flats' => $totalFlats,
                'vacant_flats' => $vacantFlats,
                'occupied_flats' => $occupiedFlats,
                'maintenance_flats' => $maintenanceFlats,
                'active_tenants' => $activeTenants,
                'active_leases' => $activeLeases,
                'monthly_rent_expected' => (float) $monthlyRentExpected,
                'pending_invoices_count' => $pendingInvoicesCount,
                'pending_invoices_sum' => (float) $pendingInvoicesSum,
                'paid_invoices_sum' => (float) $paidInvoicesSum,
                'new_contacts_count' => $newContactsCount,
                'occupancy_rate' => $totalFlats > 0 ? round(($occupiedFlats / $totalFlats) * 100, 1) : 0,
            ],
            'recentLeases' => $recentLeases,
            'recentContacts' => $recentContacts,
            'flatsByFloor' => $flatsByFloor,
        ]);
    }
}
