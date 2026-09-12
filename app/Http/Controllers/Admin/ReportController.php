<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\Maintenance;
use App\Models\Payment;
use App\Models\RentInvoice;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(): Response
    {
        $currentMonth = now()->format('Y-m');
        $startOfMonth = now()->startOfMonth()->toDateString();
        $endOfMonth = now()->endOfMonth()->toDateString();

        // Income Metrics
        $monthIncome = (float) Payment::whereBetween('payment_date', [$startOfMonth, $endOfMonth])->sum('amount_paid');
        $totalIncome = (float) Payment::sum('amount_paid');

        // Dues Metrics
        $totalDue = (float) RentInvoice::whereIn('status', ['unpaid', 'partially_paid'])
            ->selectRaw('SUM(total_payable - paid_amount) as total_due')
            ->value('total_due') ?? 0.00;

        // Expense Metrics
        $monthExpenses = (float) Expense::whereBetween('expense_date', [$startOfMonth, $endOfMonth])->sum('amount')
            + (float) Maintenance::whereBetween('reported_date', [$startOfMonth, $endOfMonth])->sum('cost');

        $totalExpenses = (float) Expense::sum('amount') + (float) Maintenance::sum('cost');

        // Net Cash Flow
        $monthNet = $monthIncome - $monthExpenses;
        $totalNet = $totalIncome - $totalExpenses;

        $stats = [
            'month_income' => $monthIncome,
            'total_income' => $totalIncome,
            'total_due' => $totalDue,
            'month_expenses' => $monthExpenses,
            'total_expenses' => $totalExpenses,
            'month_net' => $monthNet,
            'total_net' => $totalNet,
            'current_month' => now()->format('F Y'),
        ];

        return Inertia::render('admin/reports/index', [
            'stats' => $stats,
        ]);
    }

    public function collection(Request $request): Response
    {
        $startDate = $request->input('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', now()->toDateString());
        $method = $request->input('payment_method', 'all');

        $query = Payment::query()
            ->with(['invoice.tenant', 'lease.flat', 'receivedBy'])
            ->whereBetween('payment_date', [$startDate, $endDate]);

        if ($method !== 'all' && in_array($method, ['cash', 'bank', 'bkash', 'nagad'])) {
            $query->where('payment_method', $method);
        }

        $payments = (clone $query)->orderBy('payment_date', 'desc')->orderBy('id', 'desc')->get();

        $totalCollected = (float) (clone $query)->sum('amount_paid');
        $cashTotal = (float) (clone $query)->where('payment_method', 'cash')->sum('amount_paid');
        $bankTotal = (float) (clone $query)->where('payment_method', 'bank')->sum('amount_paid');
        $digitalTotal = (float) (clone $query)->whereIn('payment_method', ['bkash', 'nagad'])->sum('amount_paid');

        return Inertia::render('admin/reports/collection', [
            'payments' => $payments,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'payment_method' => $method,
            ],
            'summary' => [
                'total_collected' => $totalCollected,
                'cash_total' => $cashTotal,
                'bank_total' => $bankTotal,
                'digital_total' => $digitalTotal,
                'count' => $payments->count(),
            ],
        ]);
    }

    public function dueList(Request $request): Response
    {
        $query = RentInvoice::query()
            ->whereIn('status', ['unpaid', 'partially_paid'])
            ->with(['tenant', 'lease.flat']);

        if ($request->filled('month')) {
            $query->where('billing_month', $request->input('month'));
        }

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

        $invoices = (clone $query)->orderBy('due_date', 'asc')->get();

        $totalPayable = (float) (clone $query)->sum('total_payable');
        $totalPaid = (float) (clone $query)->sum('paid_amount');
        $totalDue = $totalPayable - $totalPaid;

        return Inertia::render('admin/reports/dues', [
            'invoices' => $invoices,
            'filters' => $request->only(['month', 'search']),
            'summary' => [
                'total_invoices' => $invoices->count(),
                'total_payable' => $totalPayable,
                'total_paid' => $totalPaid,
                'total_due' => $totalDue,
            ],
        ]);
    }

    public function incomeExpense(Request $request): Response
    {
        $startDate = $request->input('start_date', now()->startOfYear()->toDateString());
        $endDate = $request->input('end_date', now()->toDateString());

        // Total Rent Income
        $totalIncome = (float) Payment::whereBetween('payment_date', [$startDate, $endDate])->sum('amount_paid');

        // Expenses breakdown
        $expenseQuery = Expense::whereBetween('expense_date', [$startDate, $endDate]);
        $salaryExpense = (float) (clone $expenseQuery)->where('category', 'salary')->sum('amount');
        $utilityExpense = (float) (clone $expenseQuery)->where('category', 'utility')->sum('amount');
        $taxExpense = (float) (clone $expenseQuery)->where('category', 'tax')->sum('amount');
        $otherExpense = (float) (clone $expenseQuery)->where('category', 'others')->sum('amount');
        $directMaintenanceExpense = (float) (clone $expenseQuery)->where('category', 'maintenance')->sum('amount');

        // Unit maintenance repair log costs
        $unitMaintenanceCost = (float) Maintenance::whereBetween('reported_date', [$startDate, $endDate])->sum('cost');

        $totalMaintenance = $directMaintenanceExpense + $unitMaintenanceCost;
        $totalExpenses = $salaryExpense + $utilityExpense + $taxExpense + $otherExpense + $totalMaintenance;

        $netOperatingIncome = $totalIncome - $totalExpenses;

        // Last 6 months monthly trend data
        $monthlyTrend = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $mKey = $month->format('Y-m');
            $mLabel = $month->format('M Y');
            $mStart = $month->copy()->startOfMonth()->toDateString();
            $mEnd = $month->copy()->endOfMonth()->toDateString();

            $mIncome = (float) Payment::whereBetween('payment_date', [$mStart, $mEnd])->sum('amount_paid');
            $mExpense = (float) Expense::whereBetween('expense_date', [$mStart, $mEnd])->sum('amount')
                + (float) Maintenance::whereBetween('reported_date', [$mStart, $mEnd])->sum('cost');

            $monthlyTrend[] = [
                'month' => $mLabel,
                'income' => $mIncome,
                'expense' => $mExpense,
                'net' => $mIncome - $mExpense,
            ];
        }

        return Inertia::render('admin/reports/income-expense', [
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
            'summary' => [
                'total_income' => $totalIncome,
                'total_expenses' => $totalExpenses,
                'net_income' => $netOperatingIncome,
                'salary' => $salaryExpense,
                'utility' => $utilityExpense,
                'maintenance' => $totalMaintenance,
                'tax' => $taxExpense,
                'others' => $otherExpense,
            ],
            'monthlyTrend' => $monthlyTrend,
        ]);
    }
}
