<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Promotion;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PromotionController extends Controller
{
    public function index()
    {
        $promotions = Promotion::latest()->get();
        return Inertia::render('Admin/Promotions/Index', compact('promotions'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50|unique:promotions,code',
            'type' => 'required|in:percentage,fixed,bogo,combo',
            'value' => 'required|numeric|min:0',
            'applies_to' => 'required|in:all,category,product',
            'minimum_order' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date|after_or_equal:starts_at',
            'is_active' => 'boolean',
        ]);

        if (! empty($data['code'])) {
            $data['code'] = strtoupper(trim($data['code']));
        }

        $promo = Promotion::create($data);
        AuditLogService::record('promotion.created', $promo, null, $data);

        return back()->with('success', 'Promotion created.');
    }

    public function update(Request $request, Promotion $promotion)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50|unique:promotions,code,' . $promotion->id,
            'type' => 'required|in:percentage,fixed,bogo,combo',
            'value' => 'required|numeric|min:0',
            'applies_to' => 'required|in:all,category,product',
            'minimum_order' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date|after_or_equal:starts_at',
            'is_active' => 'boolean',
        ]);

        if (! empty($data['code'])) {
            $data['code'] = strtoupper(trim($data['code']));
        }

        $old = $promotion->toArray();
        $promotion->update($data);
        AuditLogService::record('promotion.updated', $promotion, $old, $data);

        return back()->with('success', 'Promotion updated.');
    }

    public function destroy(Promotion $promotion)
    {
        AuditLogService::record('promotion.deleted', $promotion, $promotion->toArray(), null);
        $promotion->delete();

        return back()->with('success', 'Promotion deleted.');
    }
}
