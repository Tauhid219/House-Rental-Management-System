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
        Schema::create('flats', function (Blueprint $table) {
            $table->id();
            $table->string('flat_number')->unique();
            $table->string('floor');
            $table->unsignedInteger('size_sqft');
            $table->unsignedTinyInteger('bedrooms');
            $table->unsignedTinyInteger('bathrooms');
            $table->unsignedTinyInteger('balconies')->default(1);
            $table->decimal('rent_cost', 10, 2);
            $table->enum('status', ['vacant', 'occupied', 'maintenance'])->default('vacant')->index();
            $table->text('description')->nullable();
            $table->json('amenities')->nullable();
            $table->json('images')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flats');
    }
};
