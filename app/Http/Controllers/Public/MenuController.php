<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\FoodProduct;
use App\Models\RestaurantTable;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MenuController extends Controller
{
    public function index(Request $request): Response
    {
        $categories = Category::where('type', 'food')
            ->where('is_active', true)
            ->withCount(['foodProducts' => fn ($q) => $q->published()->available()])
            ->orderBy('sort_order')
            ->get();

        $products = FoodProduct::published()
            ->available()
            ->with('category')
            ->orderBy('sort_order')
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
                'has_3d' => (bool) $p->model_3d,
                'has_options' => $p->has_options,
                'options' => $p->options,
                'category_id' => $p->category_id,
                'is_featured' => $p->is_featured,
            ]);

        $tables = RestaurantTable::where('is_active', true)->orderBy('name')->get(['id', 'name']);
        $selectedTableId = $request->integer('table') ?: null;

        return Inertia::render('Public/Menu', compact('categories', 'products', 'tables', 'selectedTableId'));
    }

    public function show(string $slug): Response
    {
        $product = FoodProduct::published()->available()->where('slug', $slug)->firstOrFail();

        return Inertia::render('Public/FoodDetail', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'price' => (float) $product->price,
                'effective_price' => (float) $product->effective_price,
                'promotional_price' => $product->promotional_price ? (float) $product->promotional_price : null,
                'image' => $product->image ? asset('storage/' . $product->image) : null,
                'model_3d_url' => $product->model_3d ? asset('storage/' . $product->model_3d) : null,
                'options' => $product->options,
                'category' => $product->category?->name,
            ],
        ]);
    }
}
