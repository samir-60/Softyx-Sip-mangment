<?php

namespace App\Services;

use App\Models\FoodProduct;
use App\Models\QrCode;
use App\Models\RestaurantTable;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Illuminate\Support\Facades\Storage;

class QrCodeService
{
    public function generateMenuQr(): QrCode
    {
        return $this->findOrCreateQr('menu', 'Main Menu', route('public.menu.index'));
    }

    public function generateFoodQr(FoodProduct $product): QrCode
    {
        return $this->findOrCreateQr(
            'food',
            $product->name,
            route('public.menu.show', $product->slug),
            $product->id
        );
    }

    public function generateTableQr(RestaurantTable $table): QrCode
    {
        return $this->findOrCreateQr(
            'table',
            'Table: ' . $table->name,
            route('public.menu.index', ['table' => $table->id]),
            null,
            $table->id
        );
    }

    private function findOrCreateQr(
        string $type,
        string $label,
        string $targetUrl,
        ?int $foodId = null,
        ?int $tableId = null
    ): QrCode {
        $qr = QrCode::where('type', $type)
            ->when($foodId, fn ($q) => $q->where('food_product_id', $foodId))
            ->when($tableId, fn ($q) => $q->where('table_id', $tableId))
            ->when($type === 'menu', fn ($q) => $q->whereNull('food_product_id')->whereNull('table_id'))
            ->first();

        if (! $qr) {
            $qr = QrCode::create([
                'type' => $type,
                'label' => $label,
                'target_url' => $targetUrl,
                'food_product_id' => $foodId,
                'table_id' => $tableId,
            ]);
        } else {
            $qr->update([
                'label' => $label,
                'target_url' => $targetUrl,
            ]);
        }

        $this->renderQrImage($qr);

        return $qr;
    }

    public function renderQrImage(QrCode $qr): void
    {
        $redirectUrl = route('public.qr', $qr->uuid);
        $renderer = new ImageRenderer(
            new RendererStyle(360, 2),
            new SvgImageBackEnd()
        );
        $writer = new Writer($renderer);
        $svg = $writer->writeString($redirectUrl);

        $path = "qrcodes/{$qr->uuid}.svg";
        Storage::disk('public')->put($path, $svg);
        $qr->update(['image_path' => $path]);
    }
}
