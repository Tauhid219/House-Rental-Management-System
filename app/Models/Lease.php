<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lease extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'flat_id',
        'start_date',
        'end_date',
        'agreed_monthly_rent',
        'default_water_bill',
        'default_service_charge',
        'default_gas_type',
        'default_electricity_type',
        'security_deposit',
        'advance_paid',
        'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'agreed_monthly_rent' => 'decimal:2',
        'default_water_bill' => 'decimal:2',
        'default_service_charge' => 'decimal:2',
        'security_deposit' => 'decimal:2',
        'advance_paid' => 'decimal:2',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function flat(): BelongsTo
    {
        return $this->belongsTo(Flat::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(RentInvoice::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
