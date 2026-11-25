<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'code', 'type', 'value', 'applies_to', 'target_ids',
        'usage_limit', 'usage_count', 'minimum_order', 'starts_at', 'ends_at', 'is_active',
    ];

    protected $casts = [
        'value'         => 'decimal:2',
        'minimum_order' => 'decimal:2',
        'target_ids'    => 'array',
        'is_active'     => 'boolean',
        'starts_at'     => 'datetime',
        'ends_at'       => 'datetime',
    ];

    public function isValid(): bool
    {
        if (! $this->is_active) {
            return false;
        }

        $now = now();

        if ($this->starts_at && $now->lt($this->starts_at)) {
            return false;
        }

        if ($this->ends_at && $now->gt($this->ends_at)) {
            return false;
        }

        if ($this->usage_limit && $this->usage_count >= $this->usage_limit) {
            return false;
        }

        return true;
    }
}
