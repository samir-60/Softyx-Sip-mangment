<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class SoftyxLiveFeedService
{
    public function __construct(private ClothingRedirectService $redirectService) {}

    /**
     * Fetch live available products from https://softyx.shop/api/products.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getLiveProducts(): array
    {
        return Cache::remember('softyx_live_products_v2', 300, function () {
            try {
                $response = Http::timeout(8)
                    ->withHeaders(['User-Agent' => 'SoftyxSip/1.0'])
                    ->get('https://softyx.shop/api/products', ['limit' => 50]);

                if (! $response->successful()) {
                    return [];
                }

                $payload = $response->json();
                $rawProducts = $payload['products'] ?? [];
                if (! is_array($rawProducts)) {
                    return [];
                }

                $items = [];
                foreach ($rawProducts as $p) {
                    if (! is_array($p) || empty($p['name'])) {
                        continue;
                    }

                    $stock = (int) ($p['stock'] ?? 0);
                    if ($stock <= 0) {
                        continue;
                    }

                    $slugOrId = $p['slug'] ?? ($p['_id'] ?? ($p['id'] ?? null));
                    $url = $slugOrId
                        ? 'https://softyx.shop/products/' . $slugOrId
                        : 'https://softyx.shop/shop';

                    if (! $this->redirectService->validateExternalUrl($url)) {
                        $url = 'https://softyx.shop';
                    }

                    $price = isset($p['price']) ? (float) $p['price'] : null;
                    $comparePrice = isset($p['comparePrice']) && $price !== null && (float) $p['comparePrice'] > $price
                        ? (float) $p['comparePrice']
                        : null;

                    $images = is_array($p['images'] ?? null) ? $p['images'] : [];

                    $items[] = [
                        'id' => (string) ($p['_id'] ?? ($p['id'] ?? count($items) + 1)),
                        'name' => (string) $p['name'],
                        'category' => (string) ($p['category'] ?? 'Clothing'),
                        'description' => $p['description'] ?? null,
                        'image' => $images[0] ?? null,
                        'price' => $price,
                        'compare_price' => $comparePrice,
                        'currency' => 'BDT',
                        'sizes' => is_array($p['sizes'] ?? null) ? $p['sizes'] : [],
                        'colours' => is_array($p['colors'] ?? null) ? $p['colors'] : [],
                        'stock' => $stock,
                        'url' => $url,
                        'in_stock' => true,
                    ];
                }

                return $items;
            } catch (\Throwable) {
                return [];
            }
        });
    }
}
