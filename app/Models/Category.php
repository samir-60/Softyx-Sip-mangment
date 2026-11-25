<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['type', 'name', 'slug', 'image', 'sort_order', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];

    public function foodProducts()
    {
        return $this->hasMany(FoodProduct::class);
    }

    public function clothingProducts()
    {
        return $this->hasMany(ClothingProduct::class);
    }

    protected static function booted(): void
    {
        static::creating(function (self $category) {
            $category->slug ??= Str::slug($category->name);
        });
    }
}
