<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('food_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('promotional_price', 10, 2)->nullable();
            $table->string('image')->nullable();
            $table->string('model_3d')->nullable()->comment('GLB/GLTF file path');
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->boolean('is_available')->default(true);
            $table->boolean('has_options')->default(false);
            $table->json('options')->nullable()->comment('Extra toppings and food options');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('food_products');
    }
};
