<?php
namespace App\Services;

use App\Models\ClothingProduct;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ClothingRedirectService
{
    private const ALLOWED_DOMAIN = 'softyx.shop';
    private const FALLBACK_URL   = 'https://softyx.shop';

    /**
     * Returns a validated redirect URL for the given clothing product.
     * Always redirects to softyx.shop — no other domains are permitted.
     */
    public function getValidatedUrl(ClothingProduct $product): string
    {
        if ($product->status !== 'published') {
            throw new NotFoundHttpException('Product is not available.');
        }

        $url = $product->getValidatedRedirectUrl();

        if ($url === null) {
            throw new AccessDeniedHttpException('Redirect not available for this product.');
        }

        return $url;
    }

    public function validateExternalUrl(string $url): bool
    {
        $host = parse_url($url, PHP_URL_HOST);
        return in_array($host, [self::ALLOWED_DOMAIN, 'www.' . self::ALLOWED_DOMAIN], true);
    }
}
