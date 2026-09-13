<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMaintenanceRequest;
use App\Http\Requests\Admin\UpdateMaintenanceRequest;
use App\Models\Flat;
use App\Models\Maintenance;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MaintenanceController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Maintenance::query()->with('flat');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('flat', function ($f) use ($search) {
                        $f->where('flat_number', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('flat_id') && $request->input('flat_id') !== 'all') {
            $query->where('flat_id', $request->input('flat_id'));
        }

        $maintenances = $query->latest('reported_date')->latest('id')->paginate(10)->withQueryString();

        $stats = [
            'total_count' => Maintenance::count(),
            'total_cost' => (float) Maintenance::sum('cost'),
            'pending_count' => Maintenance::where('status', 'pending')->count(),
            'in_progress_count' => Maintenance::where('status', 'in_progress')->count(),
            'completed_count' => Maintenance::where('status', 'completed')->count(),
        ];

        $flats = Flat::orderBy('flat_number', 'asc')->get(['id', 'flat_number', 'floor']);

        return Inertia::render('admin/maintenances/index', [
            'maintenances' => $maintenances,
            'filters' => $request->only(['search', 'status', 'flat_id']),
            'stats' => $stats,
            'flats' => $flats,
        ]);
    }

    public function create(): Response
    {
        $flats = Flat::orderBy('flat_number', 'asc')->get(['id', 'flat_number', 'floor', 'status']);

        return Inertia::render('admin/maintenances/create', [
            'flats' => $flats,
            'today' => now()->toDateString(),
        ]);
    }

    public function store(StoreMaintenanceRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $maintenance = Maintenance::create($data);

        // If ticket is marked pending or in_progress, optionally update flat status to maintenance if vacant
        if (in_array($data['status'], ['pending', 'in_progress'])) {
            $flat = Flat::find($data['flat_id']);
            if ($flat && $flat->status === 'vacant') {
                $flat->update(['status' => 'maintenance']);
            }
        }

        return redirect()->route('admin.maintenances.index')->with(
            'success',
            "Maintenance task '{$maintenance->title}' logged successfully."
        );
    }

    public function edit(Maintenance $maintenance): Response
    {
        $flats = Flat::orderBy('flat_number', 'asc')->get(['id', 'flat_number', 'floor']);

        return Inertia::render('admin/maintenances/edit', [
            'maintenance' => $maintenance->load('flat'),
            'flats' => $flats,
        ]);
    }

    public function update(UpdateMaintenanceRequest $request, Maintenance $maintenance): RedirectResponse
    {
        $data = $request->validated();

        $maintenance->update($data);

        // If completed and flat was in maintenance status, restore flat to vacant if not leased
        if ($data['status'] === 'completed') {
            $flat = Flat::find($maintenance->flat_id);
            if ($flat && $flat->status === 'maintenance' && ! $flat->currentLease) {
                $flat->update(['status' => 'vacant']);
            }
        }

        return redirect()->route('admin.maintenances.index')->with(
            'success',
            "Maintenance task '{$maintenance->title}' updated successfully."
        );
    }

    public function destroy(Maintenance $maintenance): RedirectResponse
    {
        $title = $maintenance->title;
        $maintenance->delete();

        return redirect()->route('admin.maintenances.index')->with(
            'success',
            "Maintenance task '{$title}' removed successfully."
        );
    }
}
