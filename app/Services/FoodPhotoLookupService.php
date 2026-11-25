<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FoodPhotoLookupService
{
    /**
     * Search Wikimedia Commons for an exact variant-matched real photograph.
     */
    public function findOnlinePhotoUrl(string $query): ?string
    {
        $clean = trim($query);
        if ($clean === '') {
            return null;
        }

        // Try exact variant query first (e.g. "milk tea", "masala tea"), then broader fallback
        $url = $this->searchWikimedia($clean);
        if ($url !== null) {
            return $url;
        }

        return $this->searchWikimedia($clean . ' food');
    }

    private function searchWikimedia(string $searchTerm): ?string
    {
        try {
            $response = Http::timeout(6)
                ->withHeaders(['User-Agent' => 'SoftyxSip/1.0 (https://softyx.shop)'])
                ->get('https://commons.wikimedia.org/w/api.php', [
                    'action' => 'query',
                    'generator' => 'search',
                    'gsrnamespace' => 6,
                    'gsrsearch' => $searchTerm,
                    'gsrlimit' => 8,
                    'prop' => 'imageinfo',
                    'iiprop' => 'url|mime',
                    'iiurlwidth' => 640,
                    'format' => 'json',
                ]);

            if (! $response->successful()) {
                return null;
            }

            $pages = $response->json('query.pages');
            if (! is_array($pages)) {
                return null;
            }

            $tokens = array_values(array_filter(explode(' ', strtolower($searchTerm)), fn ($t) => strlen($t) > 2));
            $bestUrl = null;
            $bestScore = -1;

            foreach ($pages as $page) {
                $info = $page['imageinfo'][0] ?? null;
                if (! is_array($info)) {
                    continue;
                }
                $mime = strtolower((string) ($info['mime'] ?? ''));
                if (! in_array($mime, ['image/jpeg', 'image/png', 'image/webp'], true)) {
                    continue;
                }

                $candidateUrl = $info['thumburl'] ?? $info['url'] ?? null;
                if (! $candidateUrl) {
                    continue;
                }

                $title = strtolower((string) ($page['title'] ?? ''));
                $score = 0;
                foreach ($tokens as $token) {
                    if (str_contains($title, $token)) {
                        $score++;
                    }
                }

                if ($score > $bestScore) {
                    $bestScore = $score;
                    $bestUrl = $candidateUrl;
                }
            }

            return $bestUrl;
        } catch (\Throwable) {
            return null;
        }
    }

    /**
     * Download a real online photo to local public storage.
     */
    public function downloadToPublicStorage(string $imageUrl, string $name): ?string
    {
        try {
            $response = Http::timeout(8)
                ->withHeaders(['User-Agent' => 'SoftyxSip/1.0'])
                ->get($imageUrl);

            if (! $response->successful() || strlen($response->body()) < 500) {
                return null;
            }

            $filename = 'food/' . Str::slug($name) . '-' . Str::lower(Str::random(5)) . '.jpg';
            Storage::disk('public')->put($filename, $response->body());

            return $filename;
        } catch (\Throwable) {
            return null;
        }
    }
}
