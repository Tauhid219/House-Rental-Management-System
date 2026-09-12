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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('payment_no')->unique();
            $table->foreignId('invoice_id')->nullable()->constrained('rent_invoices')->nullOnDelete();
            $table->foreignId('lease_id')->constrained('leases')->cascadeOnDelete();
            $table->decimal('amount_paid', 10, 2);
            $table->enum('payment_method', ['cash', 'bank', 'bkash', 'nagad', 'other'])->default('cash');
            $table->string('transaction_id')->nullable();
            $table->date('payment_date');
            $table->foreignId('received_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
