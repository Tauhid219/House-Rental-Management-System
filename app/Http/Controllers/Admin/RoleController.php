<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * System defined protected roles that cannot be deleted.
     */
    protected array $protectedRoles = ['admin', 'manager', 'tenant'];

    /**
     * Group available permissions into human-readable functional categories.
     */
    protected function getGroupedPermissions(): array
    {
        $permissions = Permission::all();

        $groups = [
            'Flats & Properties' => ['view flats', 'create flats', 'edit flats', 'delete flats'],
            'Tenants Directory' => ['view tenants', 'create tenants', 'edit tenants', 'delete tenants'],
            'Lease Agreements' => ['view leases', 'create leases', 'edit leases', 'delete leases'],
            'Rent Invoices & Billing' => ['view invoices', 'create invoices', 'edit invoices', 'delete invoices'],
            'Payments & Receipts' => ['view payments', 'create payments'],
            'Property Maintenance' => ['view maintenances', 'create maintenances', 'edit maintenances'],
            'Building Expenses' => ['view expenses', 'create expenses', 'edit expenses'],
            'Financial Reports' => ['view reports'],
            'Tour Leads & Inquiries' => ['view contacts'],
            'Access Control (RBAC)' => ['view roles', 'manage roles', 'manage users'],
        ];

        $grouped = [];
        foreach ($groups as $category => $permNames) {
            $grouped[$category] = $permissions->filter(fn ($p) => in_array($p->name, $permNames))->values();
        }

        return $grouped;
    }

    /**
     * Display a listing of all roles.
     */
    public function index(): Response
    {
        $roles = Role::withCount('users')
            ->with('permissions')
            ->orderBy('id', 'asc')
            ->get();

        return Inertia::render('admin/roles/index', [
            'roles' => $roles,
            'protectedRoles' => $this->protectedRoles,
            'totalPermissions' => Permission::count(),
        ]);
    }

    /**
     * Show form for creating a new role.
     */
    public function create(): Response
    {
        return Inertia::render('admin/roles/create', [
            'groupedPermissions' => $this->getGroupedPermissions(),
        ]);
    }

    /**
     * Store a newly created role in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:50', 'unique:roles,name'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ]);

        $roleName = strtolower(trim($validated['name']));
        $role = Role::create([
            'name' => $roleName,
            'guard_name' => 'web',
        ]);

        if (!empty($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return redirect()
            ->route('admin.roles.index')
            ->with('success', "Role '{$role->name}' created successfully with assigned permissions.");
    }

    /**
     * Show form for editing an existing role.
     */
    public function edit(Role $role): Response
    {
        $role->load('permissions');

        return Inertia::render('admin/roles/edit', [
            'role' => $role,
            'rolePermissions' => $role->permissions->pluck('name')->toArray(),
            'groupedPermissions' => $this->getGroupedPermissions(),
            'isProtected' => in_array($role->name, $this->protectedRoles),
        ]);
    }

    /**
     * Update the specified role in storage.
     */
    public function update(Request $request, Role $role): RedirectResponse
    {
        $isProtected = in_array($role->name, $this->protectedRoles);

        $rules = [
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ];

        if (!$isProtected) {
            $rules['name'] = ['required', 'string', 'max:50', 'unique:roles,name,' . $role->id];
        }

        $validated = $request->validate($rules);

        if (!$isProtected && isset($validated['name'])) {
            $role->name = strtolower(trim($validated['name']));
            $role->save();
        }

        // If it's the admin role, ensure critical RBAC permissions are always retained to prevent lockout
        $permissionsToSync = $validated['permissions'] ?? [];
        if ($role->name === 'admin') {
            $mandatoryAdmin = ['manage roles', 'view roles', 'manage users'];
            $permissionsToSync = array_unique(array_merge($permissionsToSync, $mandatoryAdmin));
        }

        $role->syncPermissions($permissionsToSync);

        return redirect()
            ->route('admin.roles.index')
            ->with('success', "Role '{$role->name}' and its permissions updated successfully.");
    }

    /**
     * Remove the specified role from storage.
     */
    public function destroy(Role $role): RedirectResponse
    {
        if (in_array($role->name, $this->protectedRoles)) {
            return back()->with('error', "Default system role '{$role->name}' is protected and cannot be deleted.");
        }

        if ($role->users()->count() > 0) {
            return back()->with('error', "Cannot delete role '{$role->name}' because {$role->users()->count()} user(s) are currently assigned to it.");
        }

        $roleName = $role->name;
        $role->delete();

        return redirect()
            ->route('admin.roles.index')
            ->with('success', "Custom role '{$roleName}' deleted successfully.");
    }
}
