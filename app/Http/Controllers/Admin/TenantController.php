<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTenantRequest;
use App\Http\Requests\Admin\UpdateTenantRequest;
use App\Models\Tenant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TenantController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Tenant::query()->with('activeLease.flat');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('nid_passport', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('occupation', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        $tenants = $query->latest()->paginate(10)->withQueryString();

        $stats = [
            'total' => Tenant::count(),
            'active' => Tenant::where('status', 'active')->count(),
            'past' => Tenant::where('status', 'past')->count(),
        ];

        return Inertia::render('admin/tenants/index', [
            'tenants' => $tenants,
            'filters' => $request->only(['search', 'status']),
            'stats' => $stats,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/tenants/create');
    }

    public function store(StoreTenantRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $tenant = Tenant::create($data);

        return redirect()->route('admin.tenants.index')->with('success', "Tenant {$tenant->name} registered successfully.");
    }

    public function edit(Tenant $tenant): Response
    {
        return Inertia::render('admin/tenants/edit', [
            'tenant' => $tenant,
        ]);
    }

    public function update(UpdateTenantRequest $request, Tenant $tenant): RedirectResponse
    {
        $data = $request->validated();
        $tenant->update($data);

        return redirect()->route('admin.tenants.index')->with('success', "Tenant {$tenant->name} updated successfully.");
    }

    public function destroy(Tenant $tenant): RedirectResponse
    {
        if ($tenant->activeLease) {
            return back()->with('error', "Cannot delete tenant {$tenant->name} because they currently hold an active lease.");
        }

        $name = $tenant->name;
        $tenant->delete();

        return redirect()->route('admin.tenants.index')->with('success', "Tenant {$name} removed successfully.");
    }
}
