<?php

namespace Tests\Feature;

use App\Models\Flat;
use App\Models\Lease;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminPortalTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->adminUser = User::factory()->create([
            'email' => 'admin@skyline.com',
            'role' => 'admin',
        ]);
    }

    public function test_admin_can_access_dashboard(): void
    {
        $response = $this->actingAs($this->adminUser)->get('/dashboard');
        $response->assertStatus(200);
    }

    public function test_admin_can_access_flats_directory(): void
    {
        $response = $this->actingAs($this->adminUser)->get('/admin/flats');
        $response->assertStatus(200);
    }

    public function test_admin_can_access_tenants_directory(): void
    {
        $response = $this->actingAs($this->adminUser)->get('/admin/tenants');
        $response->assertStatus(200);
    }

    public function test_admin_can_access_leases_directory(): void
    {
        $response = $this->actingAs($this->adminUser)->get('/admin/leases');
        $response->assertStatus(200);
    }

    public function test_admin_can_access_leads_directory(): void
    {
        $response = $this->actingAs($this->adminUser)->get('/admin/contacts');
        $response->assertStatus(200);
    }

    public function test_creating_lease_transitions_flat_to_occupied(): void
    {
        $flat = Flat::create([
            'flat_number' => '901-Z',
            'floor' => '9th Floor',
            'size_sqft' => 1800,
            'bedrooms' => 3,
            'bathrooms' => 3,
            'balconies' => 2,
            'rent_cost' => 45000,
            'status' => 'vacant',
        ]);

        $tenant = Tenant::create([
            'name' => 'Sakib Al Hasan',
            'nid_passport' => '8219482019',
            'phone' => '+8801700998877',
            'family_members' => 3,
            'status' => 'active',
        ]);

        $response = $this->actingAs($this->adminUser)->post('/admin/leases', [
            'tenant_id' => $tenant->id,
            'flat_id' => $flat->id,
            'start_date' => now()->toDateString(),
            'agreed_monthly_rent' => 45000,
            'security_deposit' => 90000,
            'status' => 'active',
        ]);

        $response->assertRedirect('/admin/leases');
        $this->assertEquals('occupied', $flat->fresh()->status);
    }

    public function test_terminating_lease_reverts_flat_to_vacant(): void
    {
        $flat = Flat::create([
            'flat_number' => '902-Z',
            'floor' => '9th Floor',
            'size_sqft' => 1800,
            'bedrooms' => 3,
            'bathrooms' => 3,
            'balconies' => 2,
            'rent_cost' => 45000,
            'status' => 'occupied',
        ]);

        $tenant = Tenant::create([
            'name' => 'Tamim Iqbal',
            'nid_passport' => '8219482020',
            'phone' => '+8801700998866',
            'family_members' => 4,
            'status' => 'active',
        ]);

        $lease = Lease::create([
            'tenant_id' => $tenant->id,
            'flat_id' => $flat->id,
            'start_date' => now()->subMonths(6)->toDateString(),
            'agreed_monthly_rent' => 45000,
            'security_deposit' => 90000,
            'status' => 'active',
        ]);

        $response = $this->actingAs($this->adminUser)->post("/admin/leases/{$lease->id}/terminate");

        $response->assertRedirect('/admin/leases');
        $this->assertEquals('closed', $lease->fresh()->status);
        $this->assertEquals('vacant', $flat->fresh()->status);
    }
}
