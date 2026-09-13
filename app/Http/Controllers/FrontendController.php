<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use App\Models\Contact;
use App\Models\Flat;
use App\Models\Subscriber;
use App\Models\Tenant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FrontendController extends Controller
{
    /**
     * Display the public landing page with vacant flats and building features.
     */
    public function home(): Response
    {
        $vacantFlats = Flat::vacant()
            ->latest()
            ->take(6)
            ->get();

        $stats = [
            'total_flats' => Flat::count(),
            'vacant_flats' => Flat::vacant()->count(),
            'occupied_flats' => Flat::occupied()->count(),
            'active_residents' => Tenant::where('status', 'active')->count(),
        ];

        return Inertia::render('frontend/home', [
            'flats' => $vacantFlats,
            'stats' => $stats,
        ]);
    }

    /**
     * Display the public catalog of flats with live search & multi-parameter filtering.
     */
    public function flats(Request $request): Response
    {
        $query = Flat::query();

        // Optional status filter; default to vacant if not provided
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        } else {
            $query->where('status', 'vacant');
        }

        // Bedroom filter
        if ($request->filled('bedrooms')) {
            $bedrooms = (int) $request->bedrooms;
            if ($bedrooms >= 4) {
                $query->where('bedrooms', '>=', 4);
            } else {
                $query->where('bedrooms', $bedrooms);
            }
        }

        // Floor filter
        if ($request->filled('floor')) {
            $query->where('floor', 'like', '%'.$request->floor.'%');
        }

        // Rent range filter
        if ($request->filled('min_rent')) {
            $query->where('rent_cost', '>=', (float) $request->min_rent);
        }
        if ($request->filled('max_rent')) {
            $query->where('rent_cost', '<=', (float) $request->max_rent);
        }

        // Keyword search (flat number, floor, or description)
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('flat_number', 'like', "%{$search}%")
                    ->orWhere('floor', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sort = $request->input('sort', 'latest');
        if ($sort === 'price_asc') {
            $query->orderBy('rent_cost', 'asc');
        } elseif ($sort === 'price_desc') {
            $query->orderBy('rent_cost', 'desc');
        } elseif ($sort === 'size_desc') {
            $query->orderBy('size_sqft', 'desc');
        } else {
            $query->latest();
        }

        $flats = $query->paginate(9)->withQueryString();

        $stats = [
            'total_vacant' => Flat::vacant()->count(),
            'min_rent' => Flat::vacant()->min('rent_cost') ?? 15000,
            'max_rent' => Flat::vacant()->max('rent_cost') ?? 60000,
        ];

        return Inertia::render('frontend/flats/index', [
            'flats' => $flats,
            'filters' => (object) $request->only(['search', 'bedrooms', 'floor', 'min_rent', 'max_rent', 'sort', 'status']),
            'stats' => $stats,
        ]);
    }

    /**
     * Display a single flat's comprehensive specifications and gallery.
     */
    public function showFlat(Flat $flat): Response
    {
        $relatedFlats = Flat::vacant()
            ->where('id', '!=', $flat->id)
            ->where('bedrooms', $flat->bedrooms)
            ->take(3)
            ->get();

        if ($relatedFlats->isEmpty()) {
            $relatedFlats = Flat::vacant()
                ->where('id', '!=', $flat->id)
                ->take(3)
                ->get();
        }

        return Inertia::render('frontend/flats/show', [
            'flat' => $flat,
            'relatedFlats' => $relatedFlats,
        ]);
    }

    /**
     * Handle incoming prospective tenant visit inquiries and tour bookings.
     */
    public function contactStore(StoreContactRequest $request): RedirectResponse
    {
        Contact::create($request->validated());

        return redirect()->back()->with('success', 'Your private viewing tour has been scheduled! Our property manager will call you within 24 hours to confirm.');
    }

    /**
     * Subscribe an email address to vacant flat notifications and building updates.
     */
    public function subscribe(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'email', 'max:255', 'unique:subscribers,email'],
        ], [
            'email.unique' => 'This email address is already subscribed to our property newsletter.',
        ]);

        Subscriber::create(['email' => $request->email]);

        return redirect()->back()->with('success', 'Thank you for subscribing! You will receive timely alerts whenever new flats become available.');
    }
}
