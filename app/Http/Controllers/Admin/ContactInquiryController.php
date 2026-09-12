<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactInquiryController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Contact::query();

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('preferred_flat_type', 'like', "%{$search}%");
            });
        }

        $contacts = $query->latest()->paginate(15)->withQueryString();

        $stats = [
            'total' => Contact::count(),
            'new' => Contact::where('status', 'new')->count(),
            'contacted' => Contact::where('status', 'contacted')->count(),
            'closed' => Contact::where('status', 'closed')->count(),
        ];

        return Inertia::render('admin/contacts/index', [
            'contacts' => $contacts,
            'filters' => $request->only(['status', 'search']),
            'stats' => $stats,
        ]);
    }

    public function updateStatus(Request $request, Contact $contact): RedirectResponse
    {
        $request->validate([
            'status' => ['required', 'in:new,contacted,closed'],
        ]);

        $contact->update([
            'status' => $request->input('status'),
        ]);

        return back()->with('success', "Lead #{$contact->id} status updated to {$request->input('status')}.");
    }

    public function destroy(Contact $contact): RedirectResponse
    {
        $contact->delete();

        return back()->with('success', 'Lead inquiry deleted successfully.');
    }
}
