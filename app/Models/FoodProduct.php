<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class FoodProduct extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id', 'name', 'slug', 'description', 'price', 'promotional_price',
        'image', 'model_3d', 'status', 'is_available', 'has_options', 'options',
        'sort_order', 'is_featured',
    ];

    protected $casts = [
        'price'             => 'decimal:2',
        'promotional_price' => 'decimal:2',
        'is_available'      => 'boolean',
        'has_options'       => 'boolean',
        'is_featured'       => 'boolean',
        'options'           => 'array',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function inventory()
    {
        return $this->hasOne(Inventory::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function qrCodes()
    {
        return $this->hasMany(QrCode::class);
    }

    public function getEffectivePriceAttribute(): float
    {
        return (float) ($this->promotional_price ?? $this->price);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
    }

    protected static function booted(): void
    {
        static::creating(function (self $product) {
            $product->slug ??= Str::slug($product->name);
        });
    }
}
