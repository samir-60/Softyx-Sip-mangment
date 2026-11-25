<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ClothingProduct;
use App\Models\FoodProduct;
use App\Models\Inventory;
use App\Models\Order;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', $this->buildPayload());
    }

    public function liveOrders()
    {
        return response()->json($this->buildPayload());
    }

    private function buildPayload(): array
    {
        $stats = [
            'total_food_products' => FoodProduct::published()->count(),
            'total_clothing_products' => ClothingProduct::published()->count(),
            'total_orders_today' => Order::whereDate('created_at', today())->count(),
            'revenue_today' => (float) Order::whereDate('created_at', today())
                ->where('payment_status', 'paid')
                ->sum('total'),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'low_stock_items' => Inventory::whereColumn('quantity', '<=', 'low_stock_threshold')->count(),
        ];

        $recentOrders = Order::with('items')->latest()->take(5)->get();
        $latest = $recentOrders->first();

        return [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'latest_order_id' => $latest?->id ?? 0,
            'latest_order' => $latest ? [
                'id' => $latest->id,
                'order_number' => $latest->order_number,
                'customer_name' => $latest->customer_name,
                'total' => (float) $latest->total,
                'status' => $latest->status,
            ] : null,
        ];
    }
}
