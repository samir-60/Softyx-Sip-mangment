<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function __construct(private OrderService $orderService) {}

    public function index()
    {
        $orders = Order::with(['items', 'table'])->latest()->paginate(25);
        return Inertia::render('Admin/Orders/Index', compact('orders'));
    }

    public function liveList()
    {
        $orders = Order::with(['items', 'table'])->latest()->take(25)->get();
        return response()->json(['orders' => $orders]);
    }

    public function show(Order $order)
    {
        $order->load(['items', 'table']);
        return Inertia::render('Admin/Orders/Show', compact('order'));
    }

    public function confirm(Order $order)
    {
        $this->orderService->confirm($order);
        return back()->with('success', 'Order confirmed.');
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,preparing,ready,delivered,cancelled',
        ]);

        $order->update(['status' => $request->status]);

        return back()->with('success', 'Order status updated.');
    }

    public function updatePayment(Request $request, Order $order)
    {
        $request->validate([
            'payment_status' => 'required|in:unpaid,paid,refunded',
            'payment_method' => 'nullable|string|max:50',
        ]);

        $order->update([
            'payment_status' => $request->payment_status,
            'payment_method' => $request->payment_method ?? $order->payment_method,
        ]);

        return back()->with('success', 'Payment status updated.');
    }

    public function destroy(Order $order)
    {
        $order->delete();
        return redirect()->route('admin.orders.index')->with('success', 'Order archived.');
    }
}
