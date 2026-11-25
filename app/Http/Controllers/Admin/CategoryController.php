<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount(['foodProducts', 'clothingProducts'])
            ->orderBy('type')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Admin/Categories/Index', compact('categories'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => 'required|in:food,clothing',
            'name' => 'required|string|max:255',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $data['slug'] = Str::slug($data['name']) . '-' . Str::lower(Str::random(4));
        $category = Category::create($data);
        AuditLogService::record('category.created', $category, null, $data);

        return back()->with('success', 'Category created.');
    }

    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'type' => 'required|in:food,clothing',
            'name' => 'required|string|max:255',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $old = $category->toArray();
        $category->update($data);
        AuditLogService::record('category.updated', $category, $old, $data);

        return back()->with('success', 'Category updated.');
    }

    public function destroy(Category $category)
    {
        AuditLogService::record('category.deleted', $category, $category->toArray(), null);
        $category->delete();

        return back()->with('success', 'Category deleted.');
    }
}
