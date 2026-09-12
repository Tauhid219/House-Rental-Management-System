<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Maintenance extends Model
{
    use HasFactory;

    protected $fillable = [
        'flat_id',
        'title',
        'description',
        'cost',
        'reported_date',
        'completed_date',
        'status',
    ];

    protected $casts = [
        'cost' => 'decimal:2',
        'reported_date' => 'date',
        'completed_date' => 'date',
    ];

    public function flat(): BelongsTo
    {
        return $this->belongsTo(Flat::class);
    }
}
