<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->unsignedTinyInteger('prep_minutes')->default(10)->after('notes');
            $table->timestamp('prep_started_at')->nullable()->after('prep_minutes');
            $table->json('spin_reward')->nullable()->after('prep_started_at');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['prep_minutes', 'prep_started_at', 'spin_reward']);
        });
    }
};
