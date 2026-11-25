<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\ClothingProduct;
use App\Models\FoodProduct;
use App\Models\Promotion;
use App\Services\SoftyxLiveFeedService;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    public function index(SoftyxLiveFeedService $liveFeed): Response
    {
        $featuredFoods = FoodProduct::published()
            ->available()
            ->where('is_featured', true)
            ->orderBy('sort_order')
            ->take(4)
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'slug' => $p->slug,
                'description' => $p->description,
                'price' => (float) $p->price,
                'effective_price' => (float) $p->effective_price,
                'promotional_price' => $p->promotional_price ? (float) $p->promotional_price : null,
                'image' => $p->image ? asset('storage/' . $p->image) : null,
            ]);

        $featuredClothing = ClothingProduct::published()
            ->where('is_featured', true)
            ->orderBy('sort_order')
            ->take(4)
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'slug' => $p->slug,
                'display_price' => $p->display_price ? (float) $p->display_price : null,
                'promotional_price' => $p->promotional_price ? (float) $p->promotional_price : null,
                'image' => $p->image ? asset('storage/' . $p->image) : null,
                'sizes' => $p->sizes ?? [],
                'colours' => $p->colours ?? [],
                'has_redirect' => $p->redirect_enabled && ($p->external_store_url || $p->fallback_redirect_enabled),
                'redirect_url' => route('public.clothing.redirect', $p->slug),
            ]);

        $activePromotions = Promotion::where('is_active', true)
            ->get()
            ->filter(fn ($promo) => $promo->isValid())
            ->values()
            ->map(fn ($promo) => [
                'id' => $promo->id,
                'name' => $promo->name,
                'code' => $promo->code,
                'type' => $promo->type,
                'value' => (float) $promo->value,
            ]);

        $liveClothing = $liveFeed->getLiveProducts();

        return Inertia::render('Public/Welcome', compact('featuredFoods', 'featuredClothing', 'liveClothing', 'activePromotions'));
    }
}
