<?php
namespace App\Services;

use App\Models\Inventory;
use App\Models\InventoryMovement;
use Illuminate\Support\Facades\Auth;

class InventoryService
{
    public function deduct(int $productId, int $quantity): void
    {
        $inv = Inventory::where('food_product_id', $productId)->first();

        if ($inv) {
            $inv->decrement('quantity', $quantity);

            InventoryMovement::create([
                'food_product_id' => $productId,
                'type'            => 'sale',
                'quantity'        => -$quantity,
                'notes'           => 'Deducted by order',
                'user_id'         => Auth::id(),
            ]);
        }
    }

    public function adjust(int $productId, int $quantity, string $notes = ''): void
    {
        $inv = Inventory::firstOrCreate(
            ['food_product_id' => $productId],
            ['quantity' => 0]
        );

        $inv->increment('quantity', $quantity);

        InventoryMovement::create([
            'food_product_id' => $productId,
            'type'            => $quantity > 0 ? 'restock' : 'adjustment',
            'quantity'        => $quantity,
            'notes'           => $notes,
            'user_id'         => Auth::id(),
        ]);
    }
}
