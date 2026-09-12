<?php

namespace Tests\Feature;

use App\Models\Expense;
use App\Models\Flat;
use App\Models\Maintenance;
use App\Models\Payment;
use App\Models\RentInvoice;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MaintenanceAndExpenseTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();

        /** @var User $admin */
        $admin = User::where('email', 'admin@rental.com')->first();
        $this->admin = $admin;
    }

    public function test_admin_can_access_maintenance_directory(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.maintenances.index'));
        $response->assertOk();
    }

    public function test_admin_can_create_maintenance_record(): void
    {
        $flat = Flat::first();

        $response = $this->actingAs($this->admin)->post(route('admin.maintenances.store'), [
            'flat_id' => $flat->id,
            'title' => 'Balcony water tap repair',
            'description' => 'Replaced faulty ceramic cartridge tap.',
            'cost' => 1200.00,
            'reported_date' => now()->toDateString(),
            'status' => 'pending',
        ]);

        $response->assertRedirect(route('admin.maintenances.index'));
        $this->assertDatabaseHas('maintenances', [
            'title' => 'Balcony water tap repair',
            'flat_id' => $flat->id,
        ]);
    }

    public function test_admin_can_access_expenses_directory(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.expenses.index'));
        $response->assertOk();
    }

    public function test_admin_can_create_expense_record(): void
    {
        $response = $this->actingAs($this->admin)->post(route('admin.expenses.store'), [
            'category' => 'utility',
            'title' => 'Common Pump Motor Rewinding',
            'amount' => 4500.00,
            'expense_date' => now()->toDateString(),
            'notes' => 'Pump motor coil burned out and rewound.',
        ]);

        $response->assertRedirect(route('admin.expenses.index'));
        $this->assertDatabaseHas('expenses', [
            'title' => 'Common Pump Motor Rewinding',
            'amount' => 4500.00,
        ]);
    }

    public function test_admin_can_access_payment_receipt(): void
    {
        $payment = Payment::first();

        $response = $this->actingAs($this->admin)->get(route('admin.payments.receipt', $payment->id));
        $response->assertOk();
    }

    public function test_admin_can_access_financial_reports(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.reports.index'));
        $response->assertOk();

        $collectionResponse = $this->actingAs($this->admin)->get(route('admin.reports.collection'));
        $collectionResponse->assertOk();

        $duesResponse = $this->actingAs($this->admin)->get(route('admin.reports.dues'));
        $duesResponse->assertOk();

        $incomeExpenseResponse = $this->actingAs($this->admin)->get(route('admin.reports.income-expense'));
        $incomeExpenseResponse->assertOk();
    }
}
