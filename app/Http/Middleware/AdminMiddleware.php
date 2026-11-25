<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (! $user || ! $user->is_active || ! in_array($user->role, ['admin', 'manager', 'staff'], true)) {
            abort(403, 'Access denied.');
        }

        return $next($request);
    }
}
