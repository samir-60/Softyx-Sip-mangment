<?php
namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\ClothingProduct;
use App\Services\ClothingRedirectService;
use App\Services\SoftyxLiveFeedService;
use Inertia\Inertia;
use Inertia\Response;

class ClothingController extends Controller
{
    public function __construct(
        private ClothingRedirectService $redirectService,
        private SoftyxLiveFeedService $liveFeed
    ) {}

    public function index(): Response
    {
        $liveProducts = $this->liveFeed->getLiveProducts();
        $products = ClothingProduct::published()
            ->with('category')
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($p) => [
                'id'               => $p->id,
                'name'             => $p->name,
                'slug'             => $p->slug,
                'description'      => $p->description,
                'display_price'    => $p->display_price,
                'promotional_price'=> $p->promotional_price,
                'image'            => $p->image ? asset('storage/' . $p->image) : null,
                'sizes'            => $p->sizes ?? [],
                'colours'          => $p->colours ?? [],
                'category'         => $p->category?->name,
                'is_featured'      => $p->is_featured,
                'has_redirect'     => $p->redirect_enabled && ($p->external_store_url || $p->fallback_redirect_enabled),
                'redirect_url'     => route('public.clothing.redirect', $p->slug),
            ]);

        return Inertia::render('Public/Clothing', compact('products', 'liveProducts'));
    }

    /**
     * Redirect to the validated softyx.shop product URL.
     * Any URL not on softyx.shop is rejected by ClothingRedirectService.
     */
    public function redirect(string $slug)
    {
        $product = ClothingProduct::published()->where('slug', $slug)->firstOrFail();
        $url     = $this->redirectService->getValidatedUrl($product);

        return redirect()->away($url);
    }
}
