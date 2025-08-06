<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['name', 'category_id', 'unit_price', 'quantity'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
