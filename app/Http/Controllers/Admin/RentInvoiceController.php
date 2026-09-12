<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BatchGenerateInvoiceRequest;
use App\Http\Requests\Admin\StoreRentInvoiceRequest;
use App\Models\Lease;
use App\Models\RentInvoice;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class RentInvoiceController extends Controller
{
    public function index(Request $request): Response
    {
        $query = RentInvoice::query()->with(['tenant', 'lease.flat']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('invoice_no', 'like', "%{$search}%")
                    ->orWhereHas('tenant', function ($t) use ($search) {
                        $t->where('name', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%");
                    })
                    ->orWhereHas('lease.flat', function ($f) use ($search) {
                        $f->where('flat_number', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('billing_month') && $request->input('billing_month') !== 'all') {
            $query->where('billing_month', $request->input('billing_month'));
        }

        $invoices = $query->latest('id')->paginate(10)->withQueryString();

        $totalPayable = RentInvoice::sum('total_payable');
        $totalPaid = RentInvoice::sum('paid_amount');
        $totalDue = max(0, $totalPayable - $totalPaid);

        $stats = [
            'total_invoices' => RentInvoice::count(),
            'unpaid_count' => RentInvoice::where('status', 'unpaid')->count(),
            'partially_paid_count' => RentInvoice::where('status', 'partially_paid')->count(),
            'paid_count' => RentInvoice::where('status', 'paid')->count(),
            'total_payable' => (float) $totalPayable,
            'total_paid' => (float) $totalPaid,
            'total_due' => (float) $totalDue,
        ];

        $billingMonths = RentInvoice::select('billing_month')
            ->distinct()
            ->orderBy('billing_month', 'desc')
            ->pluck('billing_month');

        return Inertia::render('admin/invoices/index', [
            'invoices' => $invoices,
            'filters' => $request->only(['search', 'status', 'billing_month']),
            'stats' => $stats,
            'billingMonths' => $billingMonths,
            'currentMonth' => now()->format('Y-m'),
        ]);
    }

    public function create(): Response
    {
        $activeLeases = Lease::where('status', 'active')
            ->with(['tenant', 'flat'])
            ->get();

        return Inertia::render('admin/invoices/create', [
            'activeLeases' => $activeLeases,
            'defaultBillingMonth' => now()->format('Y-m'),
            'defaultDueDate' => now()->addDays(10)->toDateString(),
        ]);
    }

    public function store(StoreRentInvoiceRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $lease = Lease::with('tenant')->findOrFail($data['lease_id']);

        // Check if invoice for this lease and month already exists
        $exists = RentInvoice::where('lease_id', $lease->id)
            ->where('billing_month', $data['billing_month'])
            ->exists();

        if ($exists) {
            return back()->with('error', "An invoice for Flat {$lease->flat?->flat_number} for {$data['billing_month']} already exists.");
        }

        $rent = (float) $data['rent_amount'];
        $utility = (float) ($data['utility_charges'] ?? 0);
        $other = (float) ($data['other_charges'] ?? 0);
        $discount = (float) ($data['discount'] ?? 0);

        $totalPayable = max(0, $rent + $utility + $other - $discount);

        $monthStr = str_replace('-', '', $data['billing_month']);
        $nextNum = RentInvoice::where('billing_month', $data['billing_month'])->count() + 1;
        $invoiceNo = 'INV-' . $monthStr . '-' . str_pad((string)$nextNum, 4, '0', STR_PAD_LEFT);

        RentInvoice::create([
            'invoice_no' => $invoiceNo,
            'lease_id' => $lease->id,
            'tenant_id' => $lease->tenant_id,
            'billing_month' => $data['billing_month'],
            'rent_amount' => $rent,
            'utility_charges' => $utility,
            'other_charges' => $other,
            'discount' => $discount,
            'total_payable' => $totalPayable,
            'paid_amount' => 0.00,
            'due_date' => $data['due_date'] ?? now()->addDays(10)->toDateString(),
            'status' => 'unpaid',
        ]);

        return redirect()->route('admin.invoices.index')->with('success', "Invoice {$invoiceNo} created successfully.");
    }

    public function generateBatch(BatchGenerateInvoiceRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $billingMonth = $data['billing_month'];
        $dueDate = $data['due_date'];
        $utility = (float) ($data['utility_charges'] ?? 0);
        $other = (float) ($data['other_charges'] ?? 0);

        $activeLeases = Lease::where('status', 'active')->with(['tenant', 'flat'])->get();

        if ($activeLeases->isEmpty()) {
            return back()->with('error', 'No active leases found to generate rent invoices.');
        }

        $createdCount = 0;
        $monthStr = str_replace('-', '', $billingMonth);
        $currentCount = RentInvoice::where('billing_month', $billingMonth)->count();

        DB::transaction(function () use (
            $activeLeases,
            $billingMonth,
            $dueDate,
            $utility,
            $other,
            $monthStr,
            &$currentCount,
            &$createdCount
        ) {
            foreach ($activeLeases as $lease) {
                // Duplicate invoice prevention
                $exists = RentInvoice::where('lease_id', $lease->id)
                    ->where('billing_month', $billingMonth)
                    ->exists();

                if ($exists) {
                    continue;
                }

                $currentCount++;
                $invoiceNo = 'INV-' . $monthStr . '-' . str_pad((string)$currentCount, 4, '0', STR_PAD_LEFT);

                $rent = (float) $lease->agreed_monthly_rent;
                $totalPayable = max(0, $rent + $utility + $other);

                RentInvoice::create([
                    'invoice_no' => $invoiceNo,
                    'lease_id' => $lease->id,
                    'tenant_id' => $lease->tenant_id,
                    'billing_month' => $billingMonth,
                    'rent_amount' => $rent,
                    'utility_charges' => $utility,
                    'other_charges' => $other,
                    'discount' => 0.00,
                    'total_payable' => $totalPayable,
                    'paid_amount' => 0.00,
                    'due_date' => $dueDate,
                    'status' => 'unpaid',
                ]);

                $createdCount++;
            }
        });

        if ($createdCount === 0) {
            return back()->with('error', "All active leases already have invoices generated for {$billingMonth}.");
        }

        return redirect()->route('admin.invoices.index')->with(
            'success',
            "Generated {$createdCount} new rent invoices for {$billingMonth} successfully."
        );
    }

    public function show(RentInvoice $invoice): Response
    {
        $invoice->load(['tenant', 'lease.flat', 'payments.receivedBy']);

        return Inertia::render('admin/invoices/show', [
            'invoice' => $invoice,
        ]);
    }

    public function destroy(RentInvoice $invoice): RedirectResponse
    {
        if ($invoice->payments()->exists() || $invoice->paid_amount > 0) {
            return back()->with('error', "Cannot delete Invoice {$invoice->invoice_no} because payments have already been recorded against it.");
        }

        $no = $invoice->invoice_no;
        $invoice->delete();

        return redirect()->route('admin.invoices.index')->with('success', "Invoice {$no} deleted successfully.");
    }
}
