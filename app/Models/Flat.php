<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Flat extends Model
{
    use HasFactory;

    protected $fillable = [
        'flat_number',
        'floor',
        'size_sqft',
        'bedrooms',
        'bathrooms',
        'balconies',
        'rent_cost',
        'status',
        'description',
        'amenities',
        'images',
    ];

    protected $casts = [
        'size_sqft' => 'integer',
        'bedrooms' => 'integer',
        'bathrooms' => 'integer',
        'balconies' => 'integer',
        'rent_cost' => 'decimal:2',
        'amenities' => 'array',
        'images' => 'array',
    ];

    public function leases(): HasMany
    {
        return $this->hasMany(Lease::class);
    }

    public function activeLease(): HasOne
    {
        return $this->hasOne(Lease::class)->where('status', 'active')->latestOfMany();
    }

    public function currentLease(): HasOne
    {
        return $this->activeLease();
    }

    public function maintenances(): HasMany
    {
        return $this->hasMany(Maintenance::class);
    }

    public function scopeVacant(Builder $query): Builder
    {
        return $query->where('status', 'vacant');
    }

    public function scopeOccupied(Builder $query): Builder
    {
        return $query->where('status', 'occupied');
    }

    public function scopeMaintenance(Builder $query): Builder
    {
        return $query->where('status', 'maintenance');
    }
}
