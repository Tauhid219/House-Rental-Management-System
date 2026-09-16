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
        Schema::table('rent_invoices', function (Blueprint $table) {
            $table->decimal('water_bill', 10, 2)->default(0.00)->after('rent_amount');
            $table->decimal('service_charge', 10, 2)->default(0.00)->after('water_bill');
            $table->decimal('gas_bill', 10, 2)->default(0.00)->after('service_charge');
            $table->string('gas_type', 20)->default('prepaid')->after('gas_bill'); // 'prepaid' or 'billed'
            $table->decimal('electricity_bill', 10, 2)->default(0.00)->after('gas_type');
            $table->string('electricity_type', 20)->default('prepaid')->after('electricity_bill'); // 'prepaid' or 'billed'
            $table->decimal('advance_adjustment', 10, 2)->default(0.00)->after('discount');
            $table->string('other_charges_description', 255)->nullable()->after('other_charges');
        });

        Schema::table('leases', function (Blueprint $table) {
            $table->decimal('default_water_bill', 10, 2)->default(0.00)->after('agreed_monthly_rent');
            $table->decimal('default_service_charge', 10, 2)->default(3500.00)->after('default_water_bill');
            $table->string('default_gas_type', 20)->default('prepaid')->after('default_service_charge');
            $table->string('default_electricity_type', 20)->default('prepaid')->after('default_gas_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rent_invoices', function (Blueprint $table) {
            $table->dropColumn([
                'water_bill',
                'service_charge',
                'gas_bill',
                'gas_type',
                'electricity_bill',
                'electricity_type',
                'advance_adjustment',
                'other_charges_description',
            ]);
        });

        Schema::table('leases', function (Blueprint $table) {
            $table->dropColumn([
                'default_water_bill',
                'default_service_charge',
                'default_gas_type',
                'default_electricity_type',
            ]);
        });
    }
};
