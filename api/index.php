<?php

// Vercel Serverless PHP entrypoint for Laravel
if (getenv('VERCEL')) {
    $dirs = [
        '/tmp/storage/framework/views',
        '/tmp/storage/framework/cache',
        '/tmp/storage/framework/sessions',
        '/tmp/storage/logs',
        '/tmp/storage/app/public',
    ];
    foreach ($dirs as $dir) {
        if (!is_dir($dir)) {
            @mkdir($dir, 0777, true);
        }
    }

    // Fallback APP_KEY if not configured in Vercel Environment Variables
    if (!getenv('APP_KEY')) {
        $fallbackKey = 'base64:' . base64_encode(hash('sha256', __DIR__ . (getenv('VERCEL_URL') ?: 'softyx-sip'), true));
        putenv("APP_KEY={$fallbackKey}");
        $_ENV['APP_KEY'] = $fallbackKey;
        $_SERVER['APP_KEY'] = $fallbackKey;
    }

    // Initialize ephemeral SQLite in /tmp if using sqlite without external DB
    $dbConn = getenv('DB_CONNECTION') ?: 'sqlite';
    $dbPath = getenv('DB_DATABASE') ?: '/tmp/database.sqlite';
    if ($dbConn === 'sqlite' && !file_exists($dbPath)) {
        @touch($dbPath);
        define('LARAVEL_START', microtime(true));
        require __DIR__ . '/../vendor/autoload.php';
        $app = require __DIR__ . '/../bootstrap/app.php';
        $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
        $kernel->bootstrap();
        Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
        Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]);
    }
}

require __DIR__ . '/../public/index.php';
