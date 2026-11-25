<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FoodProduct;
use App\Models\Inventory;
use App\Models\InventoryMovement;
use App\Services\AuditLogService;
use App\Services\InventoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function __construct(private InventoryService $inventoryService) {}

    public function index()
    {
        $items = FoodProduct::with('inventory')
            ->orderBy('name')
            ->get()
            ->map(fn ($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'status' => $product->status,
                'quantity' => $product->inventory?->quantity ?? 0,
                'low_stock_threshold' => $product->inventory?->low_stock_threshold ?? 10,
                'is_low_stock' => ($product->inventory?->quantity ?? 0) <= ($product->inventory?->low_stock_threshold ?? 10),
            ]);

        $movements = InventoryMovement::with(['foodProduct', 'user'])
            ->latest()
            ->take(25)
            ->get();

        return Inertia::render('Admin/Inventory/Index', compact('items', 'movements'));
    }

    public function adjust(Request $request)
    {
        $data = $request->validate([
            'food_product_id' => 'required|exists:food_products,id',
            'quantity' => 'required|integer|not_in:0',
            'low_stock_threshold' => 'nullable|integer|min:0',
            'notes' => 'nullable|string|max:255',
        ]);

        $this->inventoryService->adjust(
            $data['food_product_id'],
            $data['quantity'],
            $data['notes'] ?? 'Manual adjustment'
        );

        if (isset($data['low_stock_threshold'])) {
            Inventory::where('food_product_id', $data['food_product_id'])
                ->update(['low_stock_threshold' => $data['low_stock_threshold']]);
        }

        AuditLogService::record('inventory.adjusted', null, null, $data);

        return back()->with('success', 'Inventory updated.');
    }
}
