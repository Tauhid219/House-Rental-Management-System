<?php

namespace Tests\Feature;

use App\Models\Flat;
use App\Models\Lease;
use App\Models\Payment;
use App\Models\RentInvoice;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BillingAndPaymentTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;
    protected Flat $flat;
    protected Tenant $tenant;
    protected Lease $lease;

    protected function setUp(): void
    {
        parent::setUp();

        $this->adminUser = User::factory()->create([
            'email' => 'admin@skyline.com',
            'role' => 'admin',
        ]);

        $this->flat = Flat::create([
            'flat_number' => '301-B',
            'floor' => '3rd Floor',
            'size_sqft' => 1400,
            'bedrooms' => 3,
            'bathrooms' => 3,
            'rent_cost' => 35000,
            'status' => 'occupied',
        ]);

        $this->tenant = Tenant::create([
            'name' => 'Mashrafe Mortaza',
            'nid_passport' => '1983059281',
            'phone' => '+8801711223344',
            'status' => 'active',
        ]);

        $this->lease = Lease::create([
            'tenant_id' => $this->tenant->id,
            'flat_id' => $this->flat->id,
            'start_date' => '2026-01-01',
            'agreed_monthly_rent' => 35000,
            'security_deposit' => 70000,
            'status' => 'active',
        ]);
    }

    public function test_admin_can_access_invoices_directory(): void
    {
        $response = $this->actingAs($this->adminUser)->get('/admin/invoices');
        $response->assertStatus(200);
    }

    public function test_admin_can_access_payments_directory(): void
    {
        $response = $this->actingAs($this->adminUser)->get('/admin/payments');
        $response->assertStatus(200);
    }

    public function test_batch_generate_invoices_creates_rent_invoices(): void
    {
        $response = $this->actingAs($this->adminUser)->post('/admin/invoices/batch', [
            'billing_month' => '2026-10',
            'due_date' => '2026-10-10',
            'utility_charges' => 3000,
            'other_charges' => 500,
        ]);

        $response->assertRedirect('/admin/invoices');

        $this->assertDatabaseHas('rent_invoices', [
            'lease_id' => $this->lease->id,
            'tenant_id' => $this->tenant->id,
            'billing_month' => '2026-10',
            'rent_amount' => 35000,
            'utility_charges' => 3000,
            'total_payable' => 38500,
            'status' => 'unpaid',
        ]);
    }

    public function test_batch_generate_skips_duplicate_invoices(): void
    {
        // First generation
        $this->actingAs($this->adminUser)->post('/admin/invoices/batch', [
            'billing_month' => '2026-10',
            'due_date' => '2026-10-10',
            'utility_charges' => 3000,
        ]);

        $this->assertEquals(1, RentInvoice::where('billing_month', '2026-10')->count());

        // Second generation for same month should not duplicate
        $response = $this->actingAs($this->adminUser)->post('/admin/invoices/batch', [
            'billing_month' => '2026-10',
            'due_date' => '2026-10-10',
            'utility_charges' => 3000,
        ]);

        $this->assertEquals(1, RentInvoice::where('billing_month', '2026-10')->count());
    }

    public function test_partial_payment_updates_invoice_status_to_partially_paid(): void
    {
        $invoice = RentInvoice::create([
            'invoice_no' => 'INV-202611-0001',
            'lease_id' => $this->lease->id,
            'tenant_id' => $this->tenant->id,
            'billing_month' => '2026-11',
            'rent_amount' => 35000,
            'total_payable' => 35000,
            'paid_amount' => 0,
            'status' => 'unpaid',
        ]);

        $response = $this->actingAs($this->adminUser)->post('/admin/payments', [
            'invoice_id' => $invoice->id,
            'amount_paid' => 15000,
            'payment_method' => 'bkash',
            'transaction_id' => 'BK9X28194',
            'payment_date' => '2026-11-05',
        ]);

        $payment = Payment::latest('id')->first();
        $response->assertRedirect("/admin/payments/{$payment->id}/receipt");

        $invoice->refresh();
        $this->assertEquals(15000, $invoice->paid_amount);
        $this->assertEquals('partially_paid', $invoice->status);
        $this->assertEquals(20000, $invoice->due_amount);
    }

    public function test_full_payment_updates_invoice_status_to_paid(): void
    {
        $invoice = RentInvoice::create([
            'invoice_no' => 'INV-202612-0001',
            'lease_id' => $this->lease->id,
            'tenant_id' => $this->tenant->id,
            'billing_month' => '2026-12',
            'rent_amount' => 35000,
            'total_payable' => 35000,
            'paid_amount' => 15000,
            'status' => 'partially_paid',
        ]);

        $response = $this->actingAs($this->adminUser)->post('/admin/payments', [
            'invoice_id' => $invoice->id,
            'amount_paid' => 20000,
            'payment_method' => 'bank',
            'transaction_id' => 'BANK81920',
            'payment_date' => '2026-12-08',
        ]);

        $payment = Payment::latest('id')->first();
        $response->assertRedirect("/admin/payments/{$payment->id}/receipt");

        $invoice->refresh();
        $this->assertEquals(35000, $invoice->paid_amount);
        $this->assertEquals('paid', $invoice->status);
        $this->assertEquals(0, $invoice->due_amount);
    }
}
