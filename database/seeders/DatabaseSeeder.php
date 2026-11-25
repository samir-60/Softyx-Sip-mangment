<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\ClothingProduct;
use App\Models\FoodProduct;
use App\Models\Inventory;
use App\Models\Promotion;
use App\Models\RestaurantTable;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@softyxsip.local'],
            [
                'name' => 'SOFTYX Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        $tea = Category::firstOrCreate(
            ['slug' => 'tea'],
            ['type' => 'food', 'name' => 'Tea', 'sort_order' => 1, 'is_active' => true]
        );
        $sweet = Category::firstOrCreate(
            ['slug' => 'sweet-dessert'],
            ['type' => 'food', 'name' => 'Sweet & Dessert', 'sort_order' => 2, 'is_active' => true]
        );
        $curry = Category::firstOrCreate(
            ['slug' => 'curry'],
            ['type' => 'food', 'name' => 'Curry', 'sort_order' => 3, 'is_active' => true]
        );
        $roti = Category::firstOrCreate(
            ['slug' => 'roti'],
            ['type' => 'food', 'name' => 'Roti', 'sort_order' => 4, 'is_active' => true]
        );
        $tops = Category::firstOrCreate(
            ['slug' => 'tops'],
            ['type' => 'clothing', 'name' => 'Outerwear & Tops', 'sort_order' => 1, 'is_active' => true]
        );
        $accessories = Category::firstOrCreate(
            ['slug' => 'accessories'],
            ['type' => 'clothing', 'name' => 'Essentials', 'sort_order' => 2, 'is_active' => true]
        );

        $foods = [
            [
                'category_id' => $tea->id,
                'name' => 'Masala Milk Tea',
                'slug' => 'masala-milk-tea',
                'description' => 'Slow-brewed Sylheti black tea simmered with crushed green cardamom, ginger, and whole milk.',
                'price' => 80.00,
                'promotional_price' => null,
                'status' => 'published',
                'is_available' => true,
                'is_featured' => true,
                'has_options' => true,
                'options' => ['Extra Ginger' => 15.00, 'Malai Layer' => 25.00],
                'sort_order' => 1,
            ],
            [
                'category_id' => $sweet->id,
                'name' => 'Warm Gulab Jamun',
                'slug' => 'warm-gulab-jamun',
                'description' => 'Golden khoya dumplings steeped in rosewater and saffron syrup, garnished with pistachios.',
                'price' => 160.00,
                'promotional_price' => 140.00,
                'status' => 'published',
                'is_available' => true,
                'is_featured' => true,
                'has_options' => true,
                'options' => ['Vanilla Ice Cream Scoop' => 60.00],
                'sort_order' => 2,
            ],
            [
                'category_id' => $curry->id,
                'name' => 'Chicken Bhuna Curry',
                'slug' => 'chicken-bhuna-curry',
                'description' => 'Slow-braised chicken in roasted onion, whole cumin, garlic, and toasted garam masala gravy.',
                'price' => 380.00,
                'promotional_price' => null,
                'status' => 'published',
                'is_available' => true,
                'is_featured' => true,
                'has_options' => true,
                'options' => ['Extra Gravy' => 60.00, 'Boiled Egg' => 30.00],
                'sort_order' => 3,
            ],
            [
                'category_id' => $roti->id,
                'name' => 'Tandoori Butter Roti',
                'slug' => 'tandoori-butter-roti',
                'description' => 'Hand-stretched whole wheat flatbread baked crisp in a clay tandoor and brushed with cultured butter.',
                'price' => 45.00,
                'promotional_price' => null,
                'status' => 'published',
                'is_available' => true,
                'is_featured' => true,
                'has_options' => true,
                'options' => ['Roasted Garlic Brush' => 15.00],
                'sort_order' => 4,
            ],
        ];

        $qrService = app(\App\Services\QrCodeService::class);
        $photoLookup = app(\App\Services\FoodPhotoLookupService::class);
        $qrService->generateMenuQr();

        foreach ($foods as $item) {
            $food = FoodProduct::updateOrCreate(['slug' => $item['slug']], $item);
            if (! $food->image) {
                $url = $photoLookup->findOnlinePhotoUrl($food->name);
                if ($url && ($path = $photoLookup->downloadToPublicStorage($url, $food->name))) {
                    $food->update(['image' => $path]);
                }
            }
            Inventory::firstOrCreate(
                ['food_product_id' => $food->id],
                ['quantity' => 45, 'low_stock_threshold' => 10]
            );
            $qrService->generateFoodQr($food);
        }

        $clothing = [
            [
                'category_id' => $tops->id,
                'name' => 'Premium Hoodie',
                'slug' => 'premium-hoodie',
                'description' => '480gsm organic brushed fleece with dropped shoulders and tonal embroidery.',
                'display_price' => 88.00,
                'promotional_price' => 74.00,
                'sizes' => ['S', 'M', 'L', 'XL'],
                'colours' => ['Black', 'Cream', 'Olive'],
                'external_store_url' => 'https://softyx.shop/products/premium-hoodie',
                'external_store_name' => 'SOFTYX',
                'redirect_enabled' => true,
                'fallback_redirect_enabled' => true,
                'status' => 'published',
                'is_featured' => true,
                'sort_order' => 1,
            ],
            [
                'category_id' => $tops->id,
                'name' => 'Atelier Heavyweight Tee',
                'slug' => 'atelier-heavyweight-tee',
                'description' => 'Boxy-fit combed cotton jersey tee garment-dyed in warm earth pigments.',
                'display_price' => 42.00,
                'promotional_price' => null,
                'sizes' => ['XS', 'S', 'M', 'L', 'XL'],
                'colours' => ['White', 'Cream', 'Brown', 'Black'],
                'external_store_url' => 'https://softyx.shop/products/atelier-heavyweight-tee',
                'external_store_name' => 'SOFTYX',
                'redirect_enabled' => true,
                'fallback_redirect_enabled' => true,
                'status' => 'published',
                'is_featured' => true,
                'sort_order' => 2,
            ],
            [
                'category_id' => $accessories->id,
                'name' => 'Softyx Canvas Studio Tote',
                'slug' => 'softyx-canvas-studio-tote',
                'description' => '16oz unbleached duck canvas carryall with reinforced webbing straps.',
                'display_price' => 36.00,
                'promotional_price' => null,
                'sizes' => ['One Size'],
                'colours' => ['Cream', 'Black'],
                'external_store_url' => 'https://softyx.shop/products/canvas-studio-tote',
                'external_store_name' => 'SOFTYX',
                'redirect_enabled' => true,
                'fallback_redirect_enabled' => true,
                'status' => 'published',
                'is_featured' => false,
                'sort_order' => 3,
            ],
        ];

        foreach ($clothing as $item) {
            ClothingProduct::firstOrCreate(['slug' => $item['slug']], $item);
        }

        foreach (['Table 01', 'Table 02', 'Table 03', 'Patio 01'] as $name) {
            RestaurantTable::firstOrCreate(['name' => $name], ['capacity' => 4, 'is_active' => true]);
        }

        Promotion::firstOrCreate(
            ['code' => 'SOFTYX10'],
            [
                'name' => 'Welcome 10% Off',
                'type' => 'percentage',
                'value' => 10,
                'applies_to' => 'all',
                'is_active' => true,
            ]
        );

        Setting::setValue('business_name', 'SOFTYX & SIP');
        Setting::setValue('currency_symbol', 'BDT');
        Setting::setValue('external_clothing_store', 'https://softyx.shop');
    }
}
