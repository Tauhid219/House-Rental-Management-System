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
        Schema::create('tenants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('name');
            $table->string('nid_passport')->index();
            $table->string('phone');
            $table->string('email')->nullable();
            $table->string('emergency_contact')->nullable();
            $table->string('photo_path')->nullable();
            $table->string('nid_doc_path')->nullable();
            $table->string('occupation')->nullable();
            $table->unsignedTinyInteger('family_members')->default(1);
            $table->text('permanent_address')->nullable();
            $table->enum('status', ['active', 'past'])->default('active')->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tenants');
    }
};
