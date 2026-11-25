<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('food_product_id')->nullable()->constrained('food_products')->nullOnDelete();
            $table->string('product_name')->comment('Immutable snapshot at time of order');
            $table->decimal('unit_price', 10, 2)->comment('Immutable snapshot at time of order');
            $table->integer('quantity');
            $table->json('options')->nullable();
            $table->decimal('subtotal', 10, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
