<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class QrCode extends Model
{
    use HasFactory;

    protected $fillable = ['uuid', 'type', 'label', 'target_url', 'food_product_id', 'table_id', 'image_path'];

    public function foodProduct()
    {
        return $this->belongsTo(FoodProduct::class);
    }

    public function table()
    {
        return $this->belongsTo(RestaurantTable::class, 'table_id');
    }

    protected static function booted(): void
    {
        static::creating(function (self $qr) {
            $qr->uuid ??= (string) Str::uuid();
        });
    }
}
