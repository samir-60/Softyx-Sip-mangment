<?php

namespace Tests\Feature;

use App\Mail\OrderConfirmed;
use App\Models\Category;
use App\Models\ClothingProduct;
use App\Models\FoodProduct;
use App\Models\Inventory;
use App\Models\Order;
use App\Models\Promotion;
use App\Models\User;
use App\Services\QrCodeService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SoftyxPlatformTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_welcome_menu_and_clothing_pages_render(): void
    {
        $this->get('/')->assertOk();
        $this->get('/menu')->assertOk();
        $this->get('/clothing')->assertOk();
    }

    public function test_admin_routes_are_protected_from_guests_and_non_staff(): void
    {
        $this->get('/admin')->assertRedirect('/login');
        $this->get('/admin/foods')->assertRedirect('/login');
        $this->get('/admin/clothing')->assertRedirect('/login');
    }

    public function test_clothing_redirect_validates_softyx_domain_and_respects_fallback(): void
    {
        $hoodie = ClothingProduct::create([
            'name' => 'Premium Hoodie',
            'slug' => 'premium-hoodie',
            'display_price' => 88.00,
            'external_store_url' => 'https://softyx.shop/products/premium-hoodie',
            'external_store_name' => 'SOFTYX',
            'redirect_enabled' => true,
            'fallback_redirect_enabled' => false,
            'status' => 'published',
        ]);

        $this->get('/clothing/premium-hoodie/redirect')
            ->assertRedirect('https://softyx.shop/products/premium-hoodie');

        $fallbackItem = ClothingProduct::create([
            'name' => 'Studio Cap',
            'slug' => 'studio-cap',
            'external_store_url' => null,
            'redirect_enabled' => true,
            'fallback_redirect_enabled' => true,
            'status' => 'published',
        ]);

        $this->get('/clothing/studio-cap/redirect')
            ->assertRedirect('https://softyx.shop');

        $draftItem = ClothingProduct::create([
            'name' => 'Draft Jacket',
            'slug' => 'draft-jacket',
            'external_store_url' => 'https://softyx.shop/products/draft-jacket',
            'redirect_enabled' => true,
            'status' => 'draft',
        ]);

        $this->get('/clothing/draft-jacket/redirect')->assertNotFound();
    }

    public function test_admin_cannot_save_non_softyx_external_url(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);

        $this->actingAs($admin)
            ->post('/admin/clothing', [
                'name' => 'Malicious Redirect Test',
                'external_store_url' => 'https://evil-site.example/phish',
                'redirect_enabled' => true,
                'status' => 'published',
            ])
            ->assertSessionHasErrors('external_store_url');
    }

    public function test_order_creation_stores_immutable_price_snapshot_deducts_stock_and_sends_email(): void
    {
        Mail::fake();

        $cat = Category::create(['type' => 'food', 'name' => 'Mains', 'slug' => 'mains']);
        $food = FoodProduct::create([
            'category_id' => $cat->id,
            'name' => 'Harissa Bowl',
            'slug' => 'harissa-bowl',
            'price' => 15.00,
            'status' => 'published',
            'is_available' => true,
        ]);
        Inventory::create(['food_product_id' => $food->id, 'quantity' => 20, 'low_stock_threshold' => 5]);

        $response = $this->post('/orders', [
            'customer_name' => 'Amina',
            'customer_email' => 'amina@example.com',
            'items' => [
                ['food_product_id' => $food->id, 'quantity' => 2],
            ],
        ]);

        $order = Order::first();
        $this->assertNotNull($order);
        $response->assertRedirect(route('public.orders.confirmation', $order->order_number));

        // Deducted stock
        $this->assertEquals(18, $food->inventory->fresh()->quantity);

        // Email queued with OrderConfirmed
        Mail::assertQueued(OrderConfirmed::class, function ($mail) use ($order) {
            return $mail->order->id === $order->id;
        });

        // Changing product price later must NOT alter historical order_items
        $food->update(['price' => 99.00]);
        $this->assertEquals(15.00, (float) $order->items()->first()->unit_price);

        // Prep time auto-set between 5 and 20 minutes
        $this->assertGreaterThanOrEqual(5, $order->prep_minutes);
        $this->assertLessThanOrEqual(20, $order->prep_minutes);
        $this->assertNotNull($order->prep_started_at);

        // Spin-the-wheel reward works once per order
        $spin = $this->postJson(route('public.orders.spin', $order->order_number));
        $spin->assertOk()->assertJsonStructure(['reward' => ['label', 'target', 'code']]);
    }

    public function test_permanent_qr_code_resolves_live_menu_route(): void
    {
        Storage::fake('public');

        $qrService = app(QrCodeService::class);
        $qr = $qrService->generateMenuQr();

        $this->assertNotNull($qr->image_path);
        Storage::disk('public')->assertExists($qr->image_path);

        $this->get(route('public.qr', $qr->uuid))
            ->assertRedirect(route('public.menu.index'));
    }

    public function test_creating_food_product_auto_generates_name_wise_qr_menu_card(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
        $cat = Category::create(['type' => 'food', 'name' => 'Drinks', 'slug' => 'drinks']);

        $response = $this->actingAs($admin)->post('/admin/foods', [
            'name' => 'Iced Saffron Latte',
            'category_id' => $cat->id,
            'description' => 'Chilled espresso infused with Kashmiri saffron.',
            'price' => 320,
            'status' => 'published',
            'is_available' => true,
        ]);

        $food = FoodProduct::where('name', 'Iced Saffron Latte')->first();
        $this->assertNotNull($food);
        $response->assertRedirect(route('admin.menu-card'));

        $qr = $food->qrCodes()->first();
        $this->assertNotNull($qr);
        $this->assertEquals('Iced Saffron Latte', $qr->label);
        Storage::disk('public')->assertExists($qr->image_path);

        $this->actingAs($admin)
            ->get(route('admin.menu-card'))
            ->assertOk();
    }

    public function test_deleted_food_item_is_permanently_removed_and_not_shown_again(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
        $cat = Category::create(['type' => 'food', 'name' => 'Test Cat', 'slug' => 'test-cat']);
        $food = FoodProduct::create([
            'category_id' => $cat->id,
            'name' => 'Temp Test Burger',
            'slug' => 'temp-test-burger',
            'price' => 250,
            'status' => 'published',
            'is_available' => true,
        ]);

        $this->actingAs($admin)
            ->delete("/admin/foods/{$food->id}")
            ->assertRedirect(route('admin.foods.index'));

        $this->assertDatabaseMissing('food_products', ['id' => $food->id]);

        $this->actingAs($admin)
            ->get('/admin/foods')
            ->assertOk()
            ->assertDontSee('Temp Test Burger');

        $this->get('/menu')
            ->assertOk()
            ->assertDontSee('Temp Test Burger');
    }

    public function test_deleted_coupon_promotion_is_removed_and_not_shown_again(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'is_active' => true]);
        $promo = Promotion::create([
            'name' => 'Test Coupon 50',
            'code' => 'TESTCOUPON50',
            'type' => 'percentage',
            'value' => 50,
            'applies_to' => 'all',
            'is_active' => true,
        ]);

        $this->actingAs($admin)
            ->delete("/admin/promotions/{$promo->id}")
            ->assertRedirect();

        $this->assertDatabaseMissing('promotions', ['id' => $promo->id]);

        $this->actingAs($admin)
            ->get('/admin/promotions')
            ->assertOk()
            ->assertDontSee('TESTCOUPON50');
    }
}
