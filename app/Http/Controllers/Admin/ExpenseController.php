<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreExpenseRequest;
use App\Http\Requests\Admin\UpdateExpenseRequest;
use App\Models\Expense;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ExpenseController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Expense::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('notes', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category') && $request->input('category') !== 'all') {
            $query->where('category', $request->input('category'));
        }

        if ($request->filled('month')) {
            $month = $request->input('month');
            $query->where('expense_date', 'like', "{$month}%");
        }

        $expenses = $query->latest('expense_date')->latest('id')->paginate(10)->withQueryString();

        $totalExpenses = Expense::sum('amount');
        $salaryTotal = Expense::where('category', 'salary')->sum('amount');
        $utilityTotal = Expense::where('category', 'utility')->sum('amount');
        $maintenanceTotal = Expense::where('category', 'maintenance')->sum('amount');
        $taxOtherTotal = Expense::whereIn('category', ['tax', 'others'])->sum('amount');

        $stats = [
            'total_expenses' => (float) $totalExpenses,
            'salary_total' => (float) $salaryTotal,
            'utility_total' => (float) $utilityTotal,
            'maintenance_total' => (float) $maintenanceTotal,
            'tax_other_total' => (float) $taxOtherTotal,
        ];

        return Inertia::render('admin/expenses/index', [
            'expenses' => $expenses,
            'filters' => $request->only(['search', 'category', 'month']),
            'stats' => $stats,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/expenses/create', [
            'today' => now()->toDateString(),
        ]);
    }

    public function store(StoreExpenseRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('voucher_file')) {
            $path = $request->file('voucher_file')->store('vouchers', 'public');
            $data['voucher_path'] = '/storage/' . $path;
        }

        unset($data['voucher_file']);

        $expense = Expense::create($data);

        return redirect()->route('admin.expenses.index')->with(
            'success',
            "Operational expense '{$expense->title}' logged successfully."
        );
    }

    public function edit(Expense $expense): Response
    {
        return Inertia::render('admin/expenses/edit', [
            'expense' => $expense,
        ]);
    }

    public function update(UpdateExpenseRequest $request, Expense $expense): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('voucher_file')) {
            if ($expense->voucher_path && str_starts_with($expense->voucher_path, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $expense->voucher_path);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('voucher_file')->store('vouchers', 'public');
            $data['voucher_path'] = '/storage/' . $path;
        }

        unset($data['voucher_file']);

        $expense->update($data);

        return redirect()->route('admin.expenses.index')->with(
            'success',
            "Expense '{$expense->title}' updated successfully."
        );
    }

    public function destroy(Expense $expense): RedirectResponse
    {
        if ($expense->voucher_path && str_starts_with($expense->voucher_path, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $expense->voucher_path);
            Storage::disk('public')->delete($oldPath);
        }

        $title = $expense->title;
        $expense->delete();

        return redirect()->route('admin.expenses.index')->with(
            'success',
            "Expense '{$title}' deleted successfully."
        );
    }
}
