<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryMovement extends Model
{
    use HasFactory;

    protected $table = 'inventory_movements';

    protected $fillable = ['food_product_id', 'type', 'quantity', 'notes', 'user_id'];

    public function foodProduct()
    {
        return $this->belongsTo(FoodProduct::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
