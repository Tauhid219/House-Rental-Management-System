<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreLeaseRequest;
use App\Models\Flat;
use App\Models\Lease;
use App\Models\Tenant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class LeaseController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Lease::query()->with(['tenant', 'flat']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->whereHas('tenant', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            })->orWhereHas('flat', function ($q) use ($search) {
                $q->where('flat_number', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        $leases = $query->latest()->paginate(10)->withQueryString();

        $stats = [
            'total' => Lease::count(),
            'active' => Lease::where('status', 'active')->count(),
            'closed' => Lease::where('status', 'closed')->count(),
            'monthly_committed' => Lease::where('status', 'active')->sum('agreed_monthly_rent'),
        ];

        return Inertia::render('admin/leases/index', [
            'leases' => $leases,
            'filters' => $request->only(['search', 'status']),
            'stats' => $stats,
        ]);
    }

    public function create(): Response
    {
        $vacantFlats = Flat::where('status', 'vacant')
            ->select(['id', 'flat_number', 'floor', 'bedrooms', 'rent_cost'])
            ->orderBy('flat_number')
            ->get();

        $tenants = Tenant::where('status', 'active')
            ->select(['id', 'name', 'phone', 'nid_passport'])
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/leases/create', [
            'vacantFlats' => $vacantFlats,
            'tenants' => $tenants,
        ]);
    }

    public function store(StoreLeaseRequest $request): RedirectResponse
    {
        $data = $request->validated();

        DB::transaction(function () use ($data) {
            $lease = Lease::create($data);

            // Automatically transition flat status to occupied
            if ($data['status'] === 'active') {
                Flat::where('id', $data['flat_id'])->update(['status' => 'occupied']);
            }
        });

        return redirect()->route('admin.leases.index')->with('success', 'Lease agreement created and flat status updated to occupied.');
    }

    public function terminate(Lease $lease): RedirectResponse
    {
        DB::transaction(function () use ($lease) {
            $lease->update([
                'status' => 'closed',
                'end_date' => now()->toDateString(),
            ]);

            // Automatically revert flat status to vacant
            Flat::where('id', $lease->flat_id)->update(['status' => 'vacant']);
        });

        return redirect()->route('admin.leases.index')->with('success', "Lease #{$lease->id} terminated. Flat #{$lease->flat?->flat_number} marked as vacant.");
    }
}
