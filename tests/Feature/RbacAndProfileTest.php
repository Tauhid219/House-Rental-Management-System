<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class RbacAndProfileTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;
    protected User $managerUser;
    protected Role $adminRole;
    protected Role $managerRole;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed core roles
        $this->adminRole = Role::create(['name' => 'admin', 'guard_name' => 'web']);
        $this->managerRole = Role::create(['name' => 'manager', 'guard_name' => 'web']);
        Role::create(['name' => 'tenant', 'guard_name' => 'web']);

        // Seed basic permissions
        Permission::create(['name' => 'view flats', 'guard_name' => 'web']);
        Permission::create(['name' => 'view roles', 'guard_name' => 'web']);
        Permission::create(['name' => 'manage roles', 'guard_name' => 'web']);
        Permission::create(['name' => 'manage users', 'guard_name' => 'web']);

        $this->adminRole->syncPermissions(Permission::all());
        $this->managerRole->syncPermissions(['view flats']);

        // Create Admin user
        $this->adminUser = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@skyline.com',
            'role' => 'admin',
            'password' => Hash::make('password123'),
        ]);
        $this->adminUser->assignRole('admin');

        // Create Manager user
        $this->managerUser = User::factory()->create([
            'name' => 'Manager User',
            'email' => 'manager@skyline.com',
            'role' => 'manager',
            'password' => Hash::make('password123'),
        ]);
        $this->managerUser->assignRole('manager');
    }

    public function test_admin_can_view_roles_directory(): void
    {
        $response = $this->actingAs($this->adminUser)->get('/admin/roles');

        $response->assertStatus(200);
        $response->assertSee('admin');
        $response->assertSee('manager');
    }

    public function test_non_admin_is_forbidden_from_viewing_roles(): void
    {
        $response = $this->actingAs($this->managerUser)->get('/admin/roles');

        $response->assertStatus(403);
    }

    public function test_admin_can_create_new_custom_role(): void
    {
        $response = $this->actingAs($this->adminUser)->post('/admin/roles', [
            'name' => 'supervisor',
            'permissions' => ['view flats'],
        ]);

        $response->assertRedirect('/admin/roles');
        $this->assertDatabaseHas('roles', ['name' => 'supervisor']);

        $createdRole = Role::findByName('supervisor', 'web');
        $this->assertTrue($createdRole->hasPermissionTo('view flats'));
        $this->assertFalse($createdRole->hasPermissionTo('manage roles'));
    }

    public function test_admin_can_update_role_permissions(): void
    {
        $response = $this->actingAs($this->adminUser)->put("/admin/roles/{$this->managerRole->id}", [
            'permissions' => ['view flats', 'view roles'],
        ]);

        $response->assertRedirect('/admin/roles');
        $this->assertTrue($this->managerRole->fresh()->hasPermissionTo('view roles'));
    }

    public function test_system_default_roles_cannot_be_deleted(): void
    {
        $response = $this->actingAs($this->adminUser)->delete("/admin/roles/{$this->adminRole->id}");

        $response->assertSessionHas('error');
        $this->assertDatabaseHas('roles', ['name' => 'admin']);
    }

    public function test_admin_can_delete_unassigned_custom_role(): void
    {
        $customRole = Role::create(['name' => 'auditor', 'guard_name' => 'web']);

        $response = $this->actingAs($this->adminUser)->delete("/admin/roles/{$customRole->id}");

        $response->assertRedirect('/admin/roles');
        $this->assertDatabaseMissing('roles', ['name' => 'auditor']);
    }

    public function test_admin_can_view_users_list_and_filter(): void
    {
        $response = $this->actingAs($this->adminUser)->get('/admin/users');

        $response->assertStatus(200);
        $response->assertSee('Admin User');
        $response->assertSee('Manager User');
    }

    public function test_admin_can_update_user_role(): void
    {
        $targetUser = User::factory()->create([
            'name' => 'Regular Person',
            'email' => 'person@example.com',
            'role' => 'tenant',
        ]);
        $targetUser->assignRole('tenant');

        $response = $this->actingAs($this->adminUser)->patch("/admin/users/{$targetUser->id}/role", [
            'role' => 'manager',
        ]);

        $response->assertSessionHas('success');
        $this->assertEquals('manager', $targetUser->fresh()->role);
        $this->assertTrue($targetUser->fresh()->hasRole('manager'));
    }

    public function test_admin_cannot_revoke_their_own_admin_role(): void
    {
        $response = $this->actingAs($this->adminUser)->patch("/admin/users/{$this->adminUser->id}/role", [
            'role' => 'manager',
        ]);

        $response->assertSessionHas('error');
        $this->assertEquals('admin', $this->adminUser->fresh()->role);
        $this->assertTrue($this->adminUser->fresh()->hasRole('admin'));
    }

    public function test_user_can_view_and_update_profile(): void
    {
        $response = $this->actingAs($this->adminUser)->get('/admin/profile');
        $response->assertStatus(200);

        $updateResponse = $this->actingAs($this->adminUser)->patch('/admin/profile', [
            'name' => 'Updated Admin Name',
            'email' => 'admin-updated@skyline.com',
            'phone' => '+8801700009999',
        ]);

        $updateResponse->assertSessionHas('success');
        $freshUser = $this->adminUser->fresh();
        $this->assertEquals('Updated Admin Name', $freshUser->name);
        $this->assertEquals('admin-updated@skyline.com', $freshUser->email);
        $this->assertEquals('+8801700009999', $freshUser->phone);
    }

    public function test_user_can_update_password(): void
    {
        $response = $this->actingAs($this->adminUser)->put('/admin/profile/password', [
            'current_password' => 'password123',
            'password' => 'NewSecretPassword99!',
            'password_confirmation' => 'NewSecretPassword99!',
        ]);

        $response->assertSessionHas('success');
        $this->assertTrue(Hash::check('NewSecretPassword99!', $this->adminUser->fresh()->password));
    }

    public function test_user_cannot_update_password_with_incorrect_current_password(): void
    {
        $response = $this->actingAs($this->adminUser)->put('/admin/profile/password', [
            'current_password' => 'wrongpassword',
            'password' => 'NewSecretPassword99!',
            'password_confirmation' => 'NewSecretPassword99!',
        ]);

        $response->assertSessionHasErrors(['current_password']);
        $this->assertTrue(Hash::check('password123', $this->adminUser->fresh()->password));
    }
}
