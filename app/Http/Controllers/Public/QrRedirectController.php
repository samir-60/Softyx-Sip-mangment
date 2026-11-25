<?php
namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\QrCode;

class QrRedirectController extends Controller
{
    public function handle(string $uuid)
    {
        $qr = QrCode::where('uuid', $uuid)->firstOrFail();
        return redirect($qr->target_url);
    }
}
