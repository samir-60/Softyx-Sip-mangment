<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\FoodProduct;
use App\Services\FoodPhotoLookupService;
use App\Services\QrCodeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FoodController extends Controller
{
    public function __construct(
        private QrCodeService $qrService,
        private FoodPhotoLookupService $photoLookup
    ) {}

    public function index()
    {
        $products   = FoodProduct::with('category')->orderBy('sort_order')->paginate(20);
        $categories = Category::where('type', 'food')->get();

        return Inertia::render('Admin/Foods/Index', compact('products', 'categories'));
    }

    public function create()
    {
        $categories = Category::where('type', 'food')->orderBy('sort_order')->get();
        return Inertia::render('Admin/Foods/Create', compact('categories'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'              => 'required|string|max:255',
            'category_id'       => 'nullable|exists:categories,id',
            'description'       => 'nullable|string',
            'price'             => 'required|numeric|min:0',
            'promotional_price' => 'nullable|numeric|min:0',
            'status'            => 'required|in:draft,published,archived',
            'is_available'      => 'boolean',
            'is_featured'       => 'boolean',
            'has_options'       => 'boolean',
            'options'           => 'nullable|array',
            'sort_order'        => 'integer',
            'image'             => 'nullable|image|max:5120',
            'auto_image_url'    => 'nullable|url|max:1000',
            'model_3d'          => 'nullable|file|mimes:glb,gltf|max:51200',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('food', 'public');
        } else {
            $remoteUrl = $request->input('auto_image_url') ?: $this->photoLookup->findOnlinePhotoUrl($data['name']);
            if ($remoteUrl) {
                $downloaded = $this->photoLookup->downloadToPublicStorage($remoteUrl, $data['name']);
                if ($downloaded) {
                    $data['image'] = $downloaded;
                }
            }
        }
        unset($data['auto_image_url']);

        if ($request->hasFile('model_3d')) {
            $data['model_3d'] = $request->file('model_3d')->store('models', 'public');
        }

        $product = FoodProduct::create($data);

        // Automatically generate a name-wise QR code for every newly added food item
        $this->qrService->generateFoodQr($product);

        return redirect()->route('admin.menu-card')
            ->with('success', "Added {$product->name} with auto photo and QR scanner on the Master Menu Card.");
    }

    public function edit(FoodProduct $food)
    {
        $categories = Category::where('type', 'food')->orderBy('sort_order')->get();
        return Inertia::render('Admin/Foods/Edit', ['food' => $food, 'categories' => $categories]);
    }

    public function update(Request $request, FoodProduct $food)
    {
        $data = $request->validate([
            'name'              => 'required|string|max:255',
            'category_id'       => 'nullable|exists:categories,id',
            'description'       => 'nullable|string',
            'price'             => 'required|numeric|min:0',
            'promotional_price' => 'nullable|numeric|min:0',
            'status'            => 'required|in:draft,published,archived',
            'is_available'      => 'boolean',
            'is_featured'       => 'boolean',
            'has_options'       => 'boolean',
            'options'           => 'nullable|array',
            'sort_order'        => 'integer',
            'image'             => 'nullable|image|max:5120',
            'model_3d'          => 'nullable|file|mimes:glb,gltf|max:51200',
        ]);

        if ($request->hasFile('image')) {
            if ($food->image) {
                Storage::disk('public')->delete($food->image);
            }
            $data['image'] = $request->file('image')->store('food', 'public');
        }

        if ($request->hasFile('model_3d')) {
            if ($food->model_3d) {
                Storage::disk('public')->delete($food->model_3d);
            }
            $data['model_3d'] = $request->file('model_3d')->store('models', 'public');
        }

        $food->update($data);
        $this->qrService->generateFoodQr($food);

        return redirect()->route('admin.foods.index')->with('success', 'Food product updated.');
    }

    public function menuCard(FoodProduct $food)
    {
        $qr = $this->qrService->generateFoodQr($food);
        $food->load('category');

        return Inertia::render('Admin/Foods/MenuCard', [
            'food' => [
                'id' => $food->id,
                'name' => $food->name,
                'slug' => $food->slug,
                'description' => $food->description,
                'price' => (float) $food->price,
                'effective_price' => (float) $food->effective_price,
                'promotional_price' => $food->promotional_price ? (float) $food->promotional_price : null,
                'image' => $food->image ? asset('storage/' . $food->image) : null,
                'category' => $food->category?->name ?? 'Kitchen Special',
                'status' => $food->status,
            ],
            'qr' => [
                'uuid' => $qr->uuid,
                'image_url' => asset('storage/' . $qr->image_path),
                'scan_url' => route('public.qr', $qr->uuid),
                'download_url' => route('admin.qrcodes.download', $qr->id),
            ],
        ]);
    }

    public function masterMenuCard()
    {
        $mainQr = $this->qrService->generateMenuQr();
        $categories = Category::where('type', 'food')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $foods = FoodProduct::published()
            ->with(['category', 'qrCodes'])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(function (FoodProduct $food) {
                $qr = $food->qrCodes->first() ?? $this->qrService->generateFoodQr($food);
                return [
                    'id' => $food->id,
                    'name' => $food->name,
                    'slug' => $food->slug,
                    'description' => $food->description,
                    'price' => (float) $food->price,
                    'effective_price' => (float) $food->effective_price,
                    'promotional_price' => $food->promotional_price ? (float) $food->promotional_price : null,
                    'image' => $food->image ? asset('storage/' . $food->image) : null,
                    'category_id' => $food->category_id,
                    'category_name' => $food->category?->name ?? 'House Specials',
                    'qr_image_url' => asset('storage/' . $qr->image_path),
                    'qr_download_url' => route('admin.qrcodes.download', $qr->id),
                ];
            });

        return Inertia::render('Admin/Foods/MasterMenuCard', [
            'categories' => $categories,
            'foods' => $foods,
            'mainQrUrl' => asset('storage/' . $mainQr->image_path),
        ]);
    }

    public function lookupPhoto(Request $request)
    {
        $q = (string) $request->query('q', '');
        $url = $this->photoLookup->findOnlinePhotoUrl($q);

        return response()->json(['url' => $url]);
    }

    public function destroy(FoodProduct $food)
    {
        if ($food->image) {
            Storage::disk('public')->delete($food->image);
        }
        if ($food->model_3d) {
            Storage::disk('public')->delete($food->model_3d);
        }
        $food->qrCodes()->delete();
        $food->forceDelete();

        return redirect()->route('admin.foods.index')->with('success', 'Food product permanently deleted.');
    }

    public function restore(int $id)
    {
        $food = FoodProduct::withTrashed()->findOrFail($id);
        $food->restore();
        return redirect()->route('admin.foods.index')->with('success', 'Food product restored.');
    }

    public function generateQr(FoodProduct $food)
    {
        $qr = $this->qrService->generateFoodQr($food);
        return back()->with('success', 'Food QR code generated: ' . asset('storage/' . $qr->image_path));
    }
}
