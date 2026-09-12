<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreFlatRequest;
use App\Http\Requests\Admin\UpdateFlatRequest;
use App\Models\Flat;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FlatController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Flat::query()->with('activeLease.tenant');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('flat_number', 'like', "%{$search}%")
                    ->orWhere('floor', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('bedrooms')) {
            $query->where('bedrooms', $request->input('bedrooms'));
        }

        if ($request->filled('floor') && $request->input('floor') !== 'all') {
            $query->where('floor', $request->input('floor'));
        }

        $sort = $request->input('sort', 'flat_number_asc');
        switch ($sort) {
            case 'rent_asc':
                $query->orderBy('rent_cost', 'asc');
                break;
            case 'rent_desc':
                $query->orderBy('rent_cost', 'desc');
                break;
            case 'size_desc':
                $query->orderBy('size_sqft', 'desc');
                break;
            default:
                $query->orderBy('flat_number', 'asc');
                break;
        }

        $flats = $query->paginate(10)->withQueryString();

        $stats = [
            'total' => Flat::count(),
            'vacant' => Flat::where('status', 'vacant')->count(),
            'occupied' => Flat::where('status', 'occupied')->count(),
            'maintenance' => Flat::where('status', 'maintenance')->count(),
        ];

        $floors = Flat::select('floor')->distinct()->orderBy('floor')->pluck('floor');

        return Inertia::render('admin/flats/index', [
            'flats' => $flats,
            'filters' => (object) $request->only(['search', 'status', 'bedrooms', 'floor', 'sort']),
            'stats' => $stats,
            'floors' => $floors,
        ]);
    }

    public function create(): Response
    {
        $commonAmenities = [
            '24/7 CCTV & Security Guard',
            'Standby Generator Backup',
            'High-Speed Passenger Lift',
            'Dedicated Reserved Car Parking',
            'South-Facing Veranda / Balcony',
            'Gas Connection & Line Supply',
            'Servant Room & Bath',
            'Intercom & Visitor Screening',
            'Rooftop Garden & Community Terrace',
            'Fiber Optic Internet Ready',
        ];

        return Inertia::render('admin/flats/create', [
            'commonAmenities' => $commonAmenities,
        ]);
    }

    public function store(StoreFlatRequest $request): RedirectResponse
    {
        $data = $request->validated();
        if (empty($data['images'])) {
            $data['images'] = [
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            ];
        }

        Flat::create($data);

        return redirect()->route('admin.flats.index')->with('success', "Flat {$data['flat_number']} created successfully.");
    }

    public function edit(Flat $flat): Response
    {
        $commonAmenities = [
            '24/7 CCTV & Security Guard',
            'Standby Generator Backup',
            'High-Speed Passenger Lift',
            'Dedicated Reserved Car Parking',
            'South-Facing Veranda / Balcony',
            'Gas Connection & Line Supply',
            'Servant Room & Bath',
            'Intercom & Visitor Screening',
            'Rooftop Garden & Community Terrace',
            'Fiber Optic Internet Ready',
        ];

        return Inertia::render('admin/flats/edit', [
            'flat' => $flat,
            'commonAmenities' => $commonAmenities,
        ]);
    }

    public function update(UpdateFlatRequest $request, Flat $flat): RedirectResponse
    {
        $data = $request->validated();
        $flat->update($data);

        return redirect()->route('admin.flats.index')->with('success', "Flat {$flat->flat_number} updated successfully.");
    }

    public function destroy(Flat $flat): RedirectResponse
    {
        if ($flat->activeLease) {
            return back()->with('error', "Cannot delete Flat {$flat->flat_number} because it has an active lease agreement.");
        }

        $flatNumber = $flat->flat_number;
        $flat->delete();

        return redirect()->route('admin.flats.index')->with('success', "Flat {$flatNumber} deleted successfully.");
    }
}
