<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RentInvoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_no',
        'lease_id',
        'tenant_id',
        'billing_month',
        'rent_amount',
        'utility_charges',
        'other_charges',
        'discount',
        'total_payable',
        'paid_amount',
        'due_date',
        'status',
    ];

    protected $casts = [
        'rent_amount' => 'decimal:2',
        'utility_charges' => 'decimal:2',
        'other_charges' => 'decimal:2',
        'discount' => 'decimal:2',
        'total_payable' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'due_date' => 'date',
    ];

    protected $appends = ['due_amount'];

    public function getDueAmountAttribute(): float
    {
        return max(0, (float) ($this->total_payable - $this->paid_amount));
    }

    public function lease(): BelongsTo
    {
        return $this->belongsTo(Lease::class);
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'invoice_id');
    }
}
