<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rent_invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_no')->unique();
            $table->foreignId('lease_id')->constrained('leases')->cascadeOnDelete();
            $table->foreignId('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('billing_month', 7)->index(); // Format: YYYY-MM
            $table->decimal('rent_amount', 10, 2);
            $table->decimal('utility_charges', 10, 2)->default(0.00);
            $table->decimal('other_charges', 10, 2)->default(0.00);
            $table->decimal('discount', 10, 2)->default(0.00);
            $table->decimal('total_payable', 10, 2);
            $table->decimal('paid_amount', 10, 2)->default(0.00);
            $table->date('due_date')->nullable();
            $table->enum('status', ['unpaid', 'partially_paid', 'paid'])->default('unpaid')->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rent_invoices');
    }
};
