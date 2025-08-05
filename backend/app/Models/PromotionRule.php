<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PromotionRule extends Model
{
    protected $fillable = ['name', 'salience', 'stackable', 'conditions', 'actions', 'active', 'valid_from', 'valid_until'];
}
