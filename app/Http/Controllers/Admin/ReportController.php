<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        $totalRevenue = (float) Order::where('status', '!=', 'cancelled')->sum('total');
        $totalOrders = Order::count();
        $paidOrders = Order::where('payment_status', 'paid')->count();
        $averageOrder = $totalOrders > 0 ? round($totalRevenue / $totalOrders, 2) : 0;

        $topItems = OrderItem::select('product_name', DB::raw('SUM(quantity) as total_qty'), DB::raw('SUM(subtotal) as total_sales'))
            ->groupBy('product_name')
            ->orderByDesc('total_qty')
            ->take(10)
            ->get();

        $recentAudits = AuditLog::with('user')
            ->latest()
            ->take(20)
            ->get();

        return Inertia::render('Admin/Reports/Index', compact(
            'totalRevenue',
            'totalOrders',
            'paidOrders',
            'averageOrder',
            'topItems',
            'recentAudits'
        ));
    }
}
