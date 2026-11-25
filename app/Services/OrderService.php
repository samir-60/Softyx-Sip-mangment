<?php
namespace App\Services;

use App\Models\FoodProduct;
use App\Models\Order;
use App\Models\Promotion;
use App\Mail\OrderConfirmed;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class OrderService
{
    public function __construct(private InventoryService $inventory) {}

    public function create(array $data): Order
    {
        return DB::transaction(function () use ($data) {
            $items      = $data['items'] ?? [];
            $subtotal   = 0;
            $orderItems = [];

            foreach ($items as $item) {
                $product = FoodProduct::published()->available()->findOrFail($item['food_product_id']);
                $optionsExtra = 0.0;
                $selectedOptions = [];
                if (! empty($item['options']) && is_array($item['options']) && is_array($product->options)) {
                    foreach ($item['options'] as $optKey => $optVal) {
                        $optName = is_string($optKey) ? $optKey : (string) $optVal;
                        if (array_key_exists($optName, $product->options)) {
                            $optPrice = (float) $product->options[$optName];
                            $optionsExtra += $optPrice;
                            $selectedOptions[$optName] = '$' . number_format($optPrice, 2);
                        }
                    }
                }
                $unitPrice = $product->effective_price + $optionsExtra;
                $lineTotal = $unitPrice * $item['quantity'];
                $subtotal += $lineTotal;

                $orderItems[] = [
                    'food_product_id' => $product->id,
                    'product_name' => $product->name,
                    'unit_price' => $unitPrice,
                    'quantity' => $item['quantity'],
                    'options' => $selectedOptions ?: null,
                    'subtotal' => $lineTotal,
                ];

                $this->inventory->deduct($product->id, $item['quantity']);
            }

            $discount = 0;

            if (! empty($data['promotion_code'])) {
                $promotion = Promotion::where('code', strtoupper(trim($data['promotion_code'])))->first();
                if ($promotion && $promotion->isValid((float) $subtotal)) {
                    $discount = $this->calculateDiscount($promotion, $subtotal);
                    $promotion->increment('usage_count');
                }
            }

            $totalQty = array_sum(array_column($orderItems, 'quantity'));
            $prepMinutes = min(20, max(5, 5 + ($totalQty - 1) * 3));

            $order = Order::create([
                'order_number'   => 'ORD-' . strtoupper(Str::random(8)),
                'customer_name'  => $data['customer_name'],
                'customer_email' => $data['customer_email'] ?? null,
                'customer_phone' => $data['customer_phone'] ?? null,
                'table_id'       => $data['table_id'] ?? null,
                'subtotal'       => $subtotal,
                'discount_amount'=> $discount,
                'total'          => max(0, $subtotal - $discount),
                'status'         => 'pending',
                'payment_status' => 'unpaid',
                'notes'          => $data['notes'] ?? null,
                'prep_minutes'   => $prepMinutes,
                'prep_started_at'=> now(),
            ]);

            foreach ($orderItems as $item) {
                $order->items()->create($item);
            }

            if ($order->customer_email) {
                Mail::to($order->customer_email)->queue(new OrderConfirmed($order));
            }

            return $order->load('items');
        });
    }

    public function confirm(Order $order): Order
    {
        return DB::transaction(function () use ($order) {
            $order->update([
                'status' => 'confirmed',
                'confirmed_at' => now(),
                'prep_started_at' => $order->prep_started_at ?? now(),
            ]);

            if ($order->customer_email) {
                Mail::to($order->customer_email)->queue(new OrderConfirmed($order->fresh('items')));
            }

            return $order;
        });
    }

    private function calculateDiscount(Promotion $p, float $subtotal): float
    {
        return match ($p->type) {
            'percentage' => round($subtotal * ($p->value / 100), 2),
            'fixed'      => min((float) $p->value, $subtotal),
            default      => 0,
        };
    }
}
