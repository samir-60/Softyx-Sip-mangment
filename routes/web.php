<?php

use App\Http\Controllers\Admin;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Public as PublicControllers;
use Illuminate\Support\Facades\Route;

// ----- Public Routes -----
Route::get('/', [PublicControllers\WelcomeController::class, 'index'])->name('public.welcome');

Route::prefix('menu')->name('public.menu.')->group(function () {
    Route::get('/', [PublicControllers\MenuController::class, 'index'])->name('index');
    Route::get('/{slug}', [PublicControllers\MenuController::class, 'show'])->name('show');
});

Route::post('/orders', [PublicControllers\OrderController::class, 'store'])
    ->middleware('throttle:20,1')
    ->name('public.orders.store');
Route::post('/orders/validate-promo', [PublicControllers\OrderController::class, 'validatePromo'])
    ->middleware('throttle:30,1')
    ->name('public.orders.validate-promo');
Route::get('/orders/{orderNumber}/confirmation', [PublicControllers\OrderController::class, 'confirmation'])
    ->name('public.orders.confirmation');
Route::get('/orders/{orderNumber}/status', [PublicControllers\OrderController::class, 'liveStatus'])
    ->name('public.orders.status');
Route::post('/orders/{orderNumber}/spin', [PublicControllers\OrderController::class, 'spin'])
    ->middleware('throttle:15,1')
    ->name('public.orders.spin');
Route::get('/orders/{orderNumber}/invoice', [PublicControllers\OrderController::class, 'invoice'])
    ->name('public.orders.invoice');

Route::get('/clothing', [PublicControllers\ClothingController::class, 'index'])->name('public.clothing');
Route::get('/clothing/{slug}/redirect', [PublicControllers\ClothingController::class, 'redirect'])
    ->middleware('throttle:60,1')
    ->name('public.clothing.redirect');

Route::get('/qr/{uuid}', [PublicControllers\QrRedirectController::class, 'handle'])
    ->middleware('throttle:120,1')
    ->name('public.qr');

// Redirect Breeze /dashboard to /admin for staff/admins
Route::get('/dashboard', fn () => redirect()->route('admin.dashboard'))
    ->middleware(['auth'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ----- Admin Routes -----
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [Admin\DashboardController::class, 'index'])->name('dashboard');
    Route::get('live-orders', [Admin\DashboardController::class, 'liveOrders'])->name('live-orders');

    Route::get('foods/lookup-photo', [Admin\FoodController::class, 'lookupPhoto'])->name('foods.lookup-photo');
    Route::get('menu-card', [Admin\FoodController::class, 'masterMenuCard'])->name('menu-card');
    Route::resource('foods', Admin\FoodController::class);
    Route::post('foods/{food}/qr', [Admin\FoodController::class, 'generateQr'])->name('foods.qr');
    Route::get('foods/{food}/menu-card', [Admin\FoodController::class, 'menuCard'])->name('foods.menu-card');
    Route::post('foods/{id}/restore', [Admin\FoodController::class, 'restore'])->name('foods.restore');

    Route::resource('clothing', Admin\ClothingController::class);
    Route::post('clothing/{id}/restore', [Admin\ClothingController::class, 'restore'])->name('clothing.restore');

    Route::resource('categories', Admin\CategoryController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::get('inventory', [Admin\InventoryController::class, 'index'])->name('inventory.index');
    Route::post('inventory/adjust', [Admin\InventoryController::class, 'adjust'])->name('inventory.adjust');

    Route::get('orders/live', [Admin\OrderController::class, 'liveList'])->name('orders.live');
    Route::resource('orders', Admin\OrderController::class)->only(['index', 'show', 'destroy']);
    Route::post('orders/{order}/confirm', [Admin\OrderController::class, 'confirm'])->name('orders.confirm');
    Route::patch('orders/{order}/status', [Admin\OrderController::class, 'updateStatus'])->name('orders.status');
    Route::patch('orders/{order}/payment', [Admin\OrderController::class, 'updatePayment'])->name('orders.payment');

    Route::resource('promotions', Admin\PromotionController::class)->only(['index', 'store', 'update', 'destroy']);

    Route::get('qr-codes', [Admin\QrCodeController::class, 'index'])->name('qrcodes.index');
    Route::post('qr-codes/menu', [Admin\QrCodeController::class, 'generateMenu'])->name('qrcodes.menu');
    Route::post('qr-codes/tables', [Admin\QrCodeController::class, 'storeTable'])->name('qrcodes.tables.store');
    Route::post('qr-codes/table/{table}', [Admin\QrCodeController::class, 'generateTable'])->name('qrcodes.table');
    Route::get('qr-codes/{qrCode}/download', [Admin\QrCodeController::class, 'download'])->name('qrcodes.download');

    Route::resource('staff', Admin\StaffController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::get('reports', [Admin\ReportController::class, 'index'])->name('reports.index');
    Route::get('settings', [Admin\SettingController::class, 'index'])->name('settings.index');
    Route::post('settings', [Admin\SettingController::class, 'update'])->name('settings.update');
});

require __DIR__.'/auth.php';
