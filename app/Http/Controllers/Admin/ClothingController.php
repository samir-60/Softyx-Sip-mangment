<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\ClothingProduct;
use App\Services\ClothingRedirectService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ClothingController extends Controller
{
    public function __construct(private ClothingRedirectService $redirectService) {}

    public function index()
    {
        $products   = ClothingProduct::with('category')->orderBy('sort_order')->paginate(20);
        $categories = Category::where('type', 'clothing')->get();

        return Inertia::render('Admin/Clothing/Index', compact('products', 'categories'));
    }

    public function create()
    {
        $categories = Category::where('type', 'clothing')->orderBy('sort_order')->get();
        return Inertia::render('Admin/Clothing/Create', compact('categories'));
    }

    public function store(Request $request)
    {
        $redirectService = $this->redirectService;

        $data = $request->validate([
            'name'                     => 'required|string|max:255',
            'category_id'              => 'nullable|exists:categories,id',
            'description'              => 'nullable|string',
            'display_price'            => 'nullable|numeric|min:0',
            'promotional_price'        => 'nullable|numeric|min:0',
            'sizes'                    => 'nullable|array',
            'colours'                  => 'nullable|array',
            'external_store_url'       => [
                'nullable', 'url',
                function ($attr, $val, $fail) use ($redirectService) {
                    if ($val && ! $redirectService->validateExternalUrl($val)) {
                        $fail('The external store URL must belong to softyx.shop.');
                    }
                },
            ],
            'redirect_enabled'         => 'boolean',
            'fallback_redirect_enabled'=> 'boolean',
            'status'                   => 'required|in:draft,published,archived',
            'is_featured'              => 'boolean',
            'sort_order'               => 'integer',
            'image'                    => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('clothing', 'public');
        }

        ClothingProduct::create($data);

        return redirect()->route('admin.clothing.index')->with('success', 'Clothing product created.');
    }

    public function edit(ClothingProduct $clothing)
    {
        $categories = Category::where('type', 'clothing')->orderBy('sort_order')->get();
        return Inertia::render('Admin/Clothing/Edit', ['clothing' => $clothing, 'categories' => $categories]);
    }

    public function update(Request $request, ClothingProduct $clothing)
    {
        $redirectService = $this->redirectService;

        $data = $request->validate([
            'name'                     => 'required|string|max:255',
            'category_id'              => 'nullable|exists:categories,id',
            'description'              => 'nullable|string',
            'display_price'            => 'nullable|numeric|min:0',
            'promotional_price'        => 'nullable|numeric|min:0',
            'sizes'                    => 'nullable|array',
            'colours'                  => 'nullable|array',
            'external_store_url'       => [
                'nullable', 'url',
                function ($attr, $val, $fail) use ($redirectService) {
                    if ($val && ! $redirectService->validateExternalUrl($val)) {
                        $fail('The external store URL must belong to softyx.shop.');
                    }
                },
            ],
            'redirect_enabled'         => 'boolean',
            'fallback_redirect_enabled'=> 'boolean',
            'status'                   => 'required|in:draft,published,archived',
            'is_featured'              => 'boolean',
            'sort_order'               => 'integer',
            'image'                    => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('image')) {
            if ($clothing->image) {
                Storage::disk('public')->delete($clothing->image);
            }
            $data['image'] = $request->file('image')->store('clothing', 'public');
        }

        $clothing->update($data);

        return redirect()->route('admin.clothing.index')->with('success', 'Clothing product updated.');
    }

    public function destroy(ClothingProduct $clothing)
    {
        if ($clothing->image) {
            Storage::disk('public')->delete($clothing->image);
        }
        $clothing->forceDelete();

        return redirect()->route('admin.clothing.index')->with('success', 'Clothing product permanently deleted.');
    }

    public function restore(int $id)
    {
        $clothing = ClothingProduct::withTrashed()->findOrFail($id);
        $clothing->restore();
        return redirect()->route('admin.clothing.index')->with('success', 'Clothing product restored.');
    }
}
