<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class StaffController extends Controller
{
    public function index()
    {
        $staff = User::orderBy('name')->get(['id', 'name', 'email', 'role', 'is_active', 'created_at']);
        return Inertia::render('Admin/Staff/Index', compact('staff'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,manager,staff',
            'is_active' => 'boolean',
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'],
            'is_active' => $data['is_active'] ?? true,
        ]);

        AuditLogService::record('staff.created', $user, null, ['email' => $user->email, 'role' => $user->role]);

        return back()->with('success', 'Staff member added.');
    }

    public function update(Request $request, User $staff)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|in:admin,manager,staff',
            'is_active' => 'boolean',
        ]);

        $old = $staff->only(['name', 'role', 'is_active']);
        $staff->update($data);
        AuditLogService::record('staff.updated', $staff, $old, $data);

        return back()->with('success', 'Staff member updated.');
    }

    public function destroy(User $staff)
    {
        if ($staff->id === auth()->id()) {
            return back()->with('error', 'You cannot remove your own account.');
        }
        AuditLogService::record('staff.deleted', $staff, $staff->only(['email', 'role']), null);
        $staff->delete();

        return back()->with('success', 'Staff member removed.');
    }
}
