<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('clothing_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('display_price', 10, 2)->nullable()->comment('Configurable display price — not live-synced with softyx.shop');
            $table->decimal('promotional_price', 10, 2)->nullable();
            $table->string('image')->nullable();
            $table->json('sizes')->nullable();
            $table->json('colours')->nullable();
            $table->string('external_store_url')->nullable()->comment('https://softyx.shop/products/...');
            $table->string('external_store_name')->default('SOFTYX');
            $table->boolean('redirect_enabled')->default(true);
            $table->boolean('fallback_redirect_enabled')->default(false);
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->boolean('is_featured')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clothing_products');
    }
};
