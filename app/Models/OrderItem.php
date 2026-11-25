<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id', 'food_product_id', 'product_name', 'unit_price', 'quantity', 'options', 'subtotal',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'subtotal'   => 'decimal:2',
        'options'    => 'array',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function foodProduct()
    {
        return $this->belongsTo(FoodProduct::class);
    }
}
