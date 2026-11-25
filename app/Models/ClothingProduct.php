<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class ClothingProduct extends Model
{
    use HasFactory, SoftDeletes;

    protected const ALLOWED_EXTERNAL_DOMAIN = 'softyx.shop';
    protected const FALLBACK_STORE_URL       = 'https://softyx.shop';

    protected $fillable = [
        'category_id', 'name', 'slug', 'description', 'display_price', 'promotional_price',
        'image', 'sizes', 'colours', 'external_store_url', 'external_store_name',
        'redirect_enabled', 'fallback_redirect_enabled', 'status', 'is_featured', 'sort_order',
    ];

    protected $casts = [
        'display_price'            => 'decimal:2',
        'promotional_price'        => 'decimal:2',
        'sizes'                    => 'array',
        'colours'                  => 'array',
        'redirect_enabled'         => 'boolean',
        'fallback_redirect_enabled'=> 'boolean',
        'is_featured'              => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    /**
     * Returns a validated redirect URL that is strictly limited to softyx.shop.
     * Returns null when redirect is disabled or no valid URL is resolvable.
     */
    public function getValidatedRedirectUrl(): ?string
    {
        if (! $this->redirect_enabled) {
            return null;
        }

        if ($this->external_store_url) {
            $host = parse_url($this->external_store_url, PHP_URL_HOST);
            if ($host === self::ALLOWED_EXTERNAL_DOMAIN || $host === 'www.' . self::ALLOWED_EXTERNAL_DOMAIN) {
                return $this->external_store_url;
            }
        }

        if ($this->fallback_redirect_enabled) {
            return self::FALLBACK_STORE_URL;
        }

        return null;
    }

    protected static function booted(): void
    {
        static::creating(function (self $product) {
            $product->slug ??= Str::slug($product->name);
        });
    }
}
