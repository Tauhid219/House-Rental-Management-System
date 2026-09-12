<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePaymentRequest;
use App\Models\Payment;
use App\Models\RentInvoice;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Payment::query()->with(['invoice.tenant', 'lease.flat', 'receivedBy']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('payment_no', 'like', "%{$search}%")
                    ->orWhere('transaction_id', 'like', "%{$search}%")
                    ->orWhereHas('invoice.tenant', function ($t) use ($search) {
                        $t->where('name', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%");
                    })
                    ->orWhereHas('lease.flat', function ($f) use ($search) {
                        $f->where('flat_number', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('payment_method') && $request->input('payment_method') !== 'all') {
            $query->where('payment_method', $request->input('payment_method'));
        }

        $payments = $query->latest('payment_date')->latest('id')->paginate(10)->withQueryString();

        $totalCollected = Payment::sum('amount_paid');
        $cashCollected = Payment::where('payment_method', 'cash')->sum('amount_paid');
        $digitalCollected = Payment::whereIn('payment_method', ['bank', 'bkash', 'nagad'])->sum('amount_paid');

        $stats = [
            'total_payments_count' => Payment::count(),
            'total_collected' => (float) $totalCollected,
            'cash_collected' => (float) $cashCollected,
            'digital_collected' => (float) $digitalCollected,
        ];

        return Inertia::render('admin/payments/index', [
            'payments' => $payments,
            'filters' => $request->only(['search', 'payment_method']),
            'stats' => $stats,
        ]);
    }

    public function create(Request $request): Response
    {
        $preselectedInvoiceId = $request->input('invoice_id');

        $dueInvoices = RentInvoice::whereIn('status', ['unpaid', 'partially_paid'])
            ->with(['tenant', 'lease.flat'])
            ->orderBy('due_date', 'asc')
            ->get();

        return Inertia::render('admin/payments/create', [
            'dueInvoices' => $dueInvoices,
            'preselectedInvoiceId' => $preselectedInvoiceId ? (int)$preselectedInvoiceId : null,
            'today' => now()->toDateString(),
        ]);
    }

    public function store(StorePaymentRequest $request): RedirectResponse
    {
        $data = $request->validated();

        [$invoice, $payment] = DB::transaction(function () use ($data) {
            /** @var RentInvoice $invoice */
            $invoice = RentInvoice::where('id', $data['invoice_id'])->lockForUpdate()->firstOrFail();

            $monthStr = now()->format('Ym');
            $nextCount = Payment::count() + 1;
            $paymentNo = 'PAY-' . $monthStr . '-' . str_pad((string)$nextCount, 5, '0', STR_PAD_LEFT);

            $payment = Payment::create([
                'payment_no' => $paymentNo,
                'invoice_id' => $invoice->id,
                'lease_id' => $invoice->lease_id,
                'amount_paid' => $data['amount_paid'],
                'payment_method' => $data['payment_method'],
                'transaction_id' => $data['transaction_id'] ?? null,
                'payment_date' => $data['payment_date'],
                'received_by_user_id' => Auth::id(),
                'notes' => $data['notes'] ?? null,
            ]);

            // Synchronize Invoice Paid Amount & Status
            $newPaid = (float) $invoice->paid_amount + (float) $data['amount_paid'];
            $totalPayable = (float) $invoice->total_payable;

            $status = 'unpaid';
            if ($newPaid >= $totalPayable) {
                $status = 'paid';
            } elseif ($newPaid > 0) {
                $status = 'partially_paid';
            }

            $invoice->update([
                'paid_amount' => $newPaid,
                'status' => $status,
            ]);

            return [$invoice, $payment];
        });

        return redirect()->route('admin.payments.receipt', $payment->id)->with(
            'success',
            "Payment recorded successfully. Receipt generated for Invoice {$invoice->invoice_no}."
        );
    }

    public function receipt(Payment $payment): Response
    {
        $payment->load([
            'invoice.tenant',
            'lease.flat',
            'receivedBy',
        ]);

        return Inertia::render('admin/payments/receipt', [
            'payment' => $payment,
        ]);
    }
}
