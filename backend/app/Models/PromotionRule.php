<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PromotionRule extends Model
{
    protected $fillable = [
        'name',
        'salience',
        'stackable',
        'conditions',
        'actions',
        'visual_data',
        'active',
        'valid_from',
        'valid_until'
    ];

    protected $casts = [
        'conditions' => 'array',
        'actions' => 'array',
        'visual_data' => 'array',
        'stackable' => 'boolean',
        'active' => 'boolean',
        'valid_from' => 'datetime',
        'valid_until' => 'datetime',
    ];
}
