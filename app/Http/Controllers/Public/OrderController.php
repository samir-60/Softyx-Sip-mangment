<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Promotion;
use App\Services\OrderService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(private OrderService $orderService) {}

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'nullable|email|max:255',
            'customer_phone' => 'nullable|string|max:50',
            'table_id' => 'nullable|exists:restaurant_tables,id',
            'promotion_code' => 'nullable|string|max:50',
            'notes' => 'nullable|string|max:1000',
            'items' => 'required|array|min:1',
            'items.*.food_product_id' => 'required|exists:food_products,id',
            'items.*.quantity' => 'required|integer|min:1|max:50',
            'items.*.options' => 'nullable|array',
        ]);

        $order = $this->orderService->create($validated);

        return redirect()->route('public.orders.confirmation', $order->order_number)
            ->with('success', 'Order placed successfully.');
    }

    public function confirmation(string $orderNumber): Response
    {
        $order = Order::with(['items', 'table'])
            ->where('order_number', $orderNumber)
            ->firstOrFail();

        $startedAt = $order->prep_started_at ?? $order->created_at;
        $prepMinutes = (int) ($order->prep_minutes ?: 10);
        $prepEndsAt = $startedAt->copy()->addMinutes($prepMinutes);

        return Inertia::render('Public/OrderConfirmation', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->customer_name,
                'customer_email' => $order->customer_email,
                'table_name' => $order->table?->name,
                'subtotal' => (float) $order->subtotal,
                'discount_amount' => (float) $order->discount_amount,
                'total' => (float) $order->total,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'prep_minutes' => $prepMinutes,
                'prep_ends_at' => $prepEndsAt->toIso8601String(),
                'spin_reward' => $order->spin_reward,
                'created_at' => $order->created_at->format('M d, Y H:i'),
                'items' => $order->items->map(fn ($item) => [
                    'id' => $item->id,
                    'product_name' => $item->product_name,
                    'unit_price' => (float) $item->unit_price,
                    'quantity' => $item->quantity,
                    'subtotal' => (float) $item->subtotal,
                    'options' => $item->options,
                ]),
            ],
        ]);
    }

    public function spin(string $orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)->firstOrFail();

        if ($order->spin_reward) {
            return response()->json(['reward' => $order->spin_reward]);
        }

        $segments = [
            ['index' => 0, 'label' => '10% OFF Food', 'target' => 'food', 'type' => 'percentage', 'value' => 10],
            ['index' => 1, 'label' => '10% OFF SOFTYX Clothing', 'target' => 'clothing', 'type' => 'percentage', 'value' => 10],
            ['index' => 2, 'label' => 'BDT 50 OFF Food', 'target' => 'food', 'type' => 'fixed', 'value' => 50],
            ['index' => 3, 'label' => '15% OFF SOFTYX Clothing', 'target' => 'clothing', 'type' => 'percentage', 'value' => 15],
            ['index' => 4, 'label' => '15% OFF Food', 'target' => 'food', 'type' => 'percentage', 'value' => 15],
            ['index' => 5, 'label' => '5% OFF Food', 'target' => 'food', 'type' => 'percentage', 'value' => 5],
        ];

        $chosen = $segments[array_rand($segments)];
        $code = 'FEST-' . strtoupper(\Illuminate\Support\Str::random(5));

        if ($chosen['target'] === 'food') {
            Promotion::create([
                'name' => 'MU CSE Fest Spin — ' . $chosen['label'],
                'code' => $code,
                'type' => $chosen['type'],
                'value' => $chosen['value'],
                'applies_to' => 'all',
                'usage_limit' => 1,
                'is_active' => true,
            ]);
        }

        $reward = [
            'index' => $chosen['index'],
            'label' => $chosen['label'],
            'target' => $chosen['target'],
            'code' => $code,
        ];

        $order->update(['spin_reward' => $reward]);

        return response()->json(['reward' => $reward]);
    }

    public function invoice(string $orderNumber)
    {
        $order = Order::with(['items', 'table'])
            ->where('order_number', $orderNumber)
            ->firstOrFail();

        $pdf = Pdf::loadView('mail.invoice', compact('order'));
        return $pdf->download("invoice-{$order->order_number}.pdf");
    }

    public function liveStatus(string $orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)->firstOrFail();
        $startedAt = $order->prep_started_at ?? $order->created_at;
        $prepMinutes = (int) ($order->prep_minutes ?: 10);

        return response()->json([
            'status' => $order->status,
            'payment_status' => $order->payment_status,
            'prep_minutes' => $prepMinutes,
            'prep_ends_at' => $startedAt->copy()->addMinutes($prepMinutes)->toIso8601String(),
        ]);
    }

    public function validatePromo(Request $request)
    {
        $request->validate(['code' => 'required|string', 'subtotal' => 'required|numeric|min:0']);
        $promo = Promotion::where('code', strtoupper(trim($request->code)))->first();

        if (! $promo || ! $promo->isValid((float) $request->subtotal)) {
            return response()->json(['valid' => false, 'message' => 'Invalid or expired promotion code.'], 422);
        }

        $discount = match ($promo->type) {
            'percentage' => round((float) $request->subtotal * ((float) $promo->value / 100), 2),
            'fixed' => min((float) $promo->value, (float) $request->subtotal),
            default => 0,
        };

        return response()->json([
            'valid' => true,
            'name' => $promo->name,
            'discount' => $discount,
        ]);
    }
}
