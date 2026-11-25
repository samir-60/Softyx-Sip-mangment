<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\QrCode;
use App\Models\RestaurantTable;
use App\Services\QrCodeService;
use Illuminate\Support\Str;
use Inertia\Inertia;

class QrCodeController extends Controller
{
    public function __construct(private QrCodeService $qrService) {}

    public function index()
    {
        $qrCodes = QrCode::with(['foodProduct', 'table'])->latest()->get();
        $tables  = RestaurantTable::where('is_active', true)->get();

        return Inertia::render('Admin/QrCodes/Index', compact('qrCodes', 'tables'));
    }

    public function generateMenu()
    {
        $this->qrService->generateMenuQr();
        return back()->with('success', 'Main menu QR code generated.');
    }

    public function storeTable(\Illuminate\Http\Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'capacity' => 'nullable|integer|min:1|max:50',
        ]);

        $table = RestaurantTable::create($data + ['is_active' => true]);
        $this->qrService->generateTableQr($table);

        return back()->with('success', "Table {$table->name} and its QR code created.");
    }

    public function generateTable(RestaurantTable $table)
    {
        $this->qrService->generateTableQr($table);
        return back()->with('success', "QR code generated for {$table->name}.");
    }

    public function download(QrCode $qrCode)
    {
        if (! $qrCode->image_path || ! \Illuminate\Support\Facades\Storage::disk('public')->exists($qrCode->image_path)) {
            $this->qrService->renderQrImage($qrCode);
        }

        $path = storage_path('app/public/' . $qrCode->image_path);
        return response()->download($path, Str::slug($qrCode->label) . '.svg');
    }
}
