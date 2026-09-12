<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'preferred_flat_type',
        'visit_date',
        'message',
        'status',
    ];

    protected $casts = [
        'visit_date' => 'date',
    ];
}
