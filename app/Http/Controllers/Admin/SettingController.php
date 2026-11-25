<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $settings = [
            'business_name' => Setting::getValue('business_name', 'SOFTYX & SIP'),
            'currency_symbol' => Setting::getValue('currency_symbol', '$'),
            'contact_email' => Setting::getValue('contact_email', 'hello@softyxsip.local'),
            'contact_phone' => Setting::getValue('contact_phone', ''),
            'address' => Setting::getValue('address', ''),
            'external_clothing_store' => Setting::getValue('external_clothing_store', 'https://softyx.shop'),
        ];

        return Inertia::render('Admin/Settings/Index', compact('settings'));
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'business_name' => 'required|string|max:255',
            'currency_symbol' => 'required|string|max:10',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:500',
        ]);

        foreach ($data as $key => $value) {
            Setting::setValue($key, $value);
        }

        AuditLogService::record('settings.updated', null, null, $data);

        return back()->with('success', 'Business settings saved.');
    }
}
