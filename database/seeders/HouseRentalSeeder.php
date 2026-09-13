<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\Expense;
use App\Models\Flat;
use App\Models\Lease;
use App\Models\Maintenance;
use App\Models\Payment;
use App\Models\RentInvoice;
use App\Models\Subscriber;
use App\Models\Tenant;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class HouseRentalSeeder extends Seeder
{
    public function run(): void
    {
        // 0. Reset Spatie cached permissions & Setup Roles/Permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $roleNames = ['admin', 'manager', 'tenant'];
        foreach ($roleNames as $roleName) {
            Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
        }

        $permissions = [
            'view flats', 'create flats', 'edit flats', 'delete flats',
            'view tenants', 'create tenants', 'edit tenants', 'delete tenants',
            'view leases', 'create leases', 'edit leases', 'delete leases',
            'view invoices', 'create invoices', 'edit invoices', 'delete invoices',
            'view payments', 'create payments',
            'view maintenances', 'create maintenances', 'edit maintenances',
            'view expenses', 'create expenses', 'edit expenses',
            'view reports',
            'view contacts',
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm, 'guard_name' => 'web']);
        }

        $adminRole = Role::findByName('admin', 'web');
        $adminRole->syncPermissions(Permission::all());

        $managerRole = Role::findByName('manager', 'web');
        $managerRole->syncPermissions([
            'view flats', 'create flats', 'edit flats',
            'view tenants', 'create tenants', 'edit tenants',
            'view leases', 'create leases', 'edit leases',
            'view invoices', 'create invoices', 'edit invoices',
            'view payments', 'create payments',
            'view maintenances', 'create maintenances', 'edit maintenances',
            'view expenses', 'create expenses', 'edit expenses',
            'view reports',
            'view contacts',
        ]);

        $tenantRole = Role::findByName('tenant', 'web');
        $tenantRole->syncPermissions([
            'view flats',
            'view invoices',
            'view payments',
        ]);

        // 1. Users
        $admin = User::firstOrCreate(
            ['email' => 'admin@rental.com'],
            [
                'name' => 'Tauhidur Rahman (Admin)',
                'phone' => '+8801711000001',
                'role' => 'admin',
                'status' => 'active',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );
        $admin->syncRoles(['admin']);

        $manager = User::firstOrCreate(
            ['email' => 'manager@rental.com'],
            [
                'name' => 'Arif Hassan (Property Manager)',
                'phone' => '+8801711000002',
                'role' => 'manager',
                'status' => 'active',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );
        $manager->syncRoles(['manager']);

        // 2. Flats
        $flatsData = [
            [
                'flat_number' => '101-A',
                'floor' => '1st Floor',
                'size_sqft' => 1250,
                'bedrooms' => 2,
                'bathrooms' => 2,
                'balconies' => 1,
                'rent_cost' => 22000.00,
                'status' => 'vacant',
                'description' => 'Bright and cozy 2-bedroom apartment with an open-plan kitchen, south-facing windows, and 24/7 water supply.',
                'amenities' => ['24/7 Security', 'Elevator', 'Backup Generator', 'Natural Gas', 'Balcony View'],
                'images' => [
                    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
                ],
            ],
            [
                'flat_number' => '102-B',
                'floor' => '1st Floor',
                'size_sqft' => 950,
                'bedrooms' => 2,
                'bathrooms' => 1,
                'balconies' => 1,
                'rent_cost' => 17500.00,
                'status' => 'vacant',
                'description' => 'Compact executive 2BHK flat suitable for small families or young professionals, close to public transport.',
                'amenities' => ['24/7 Security', 'Backup Generator', 'CCTV Surveillance'],
                'images' => [
                    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
                ],
            ],
            [
                'flat_number' => '201-A',
                'floor' => '2nd Floor',
                'size_sqft' => 1600,
                'bedrooms' => 3,
                'bathrooms' => 3,
                'balconies' => 2,
                'rent_cost' => 32000.00,
                'status' => 'occupied',
                'description' => 'Luxurious 3BHK flat featuring spacious master bedroom with attached bathroom, Italian marble tiles, and custom modular kitchen cabinets.',
                'amenities' => ['24/7 Security', 'Elevator', 'Dedicated Parking', 'Backup Generator', 'High-speed Internet Ready', 'Geyser in all baths'],
                'images' => [
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80',
                ],
            ],
            [
                'flat_number' => '202-B',
                'floor' => '2nd Floor',
                'size_sqft' => 1400,
                'bedrooms' => 3,
                'bathrooms' => 2,
                'balconies' => 2,
                'rent_cost' => 28000.00,
                'status' => 'vacant',
                'description' => 'Well-ventilated east-facing 3-bedroom unit receiving ample morning sunlight, large dining lounge, and modern fixtures.',
                'amenities' => ['24/7 Security', 'Elevator', 'Backup Generator', 'CCTV', 'Rooftop Garden'],
                'images' => [
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
                ],
            ],
            [
                'flat_number' => '301-A',
                'floor' => '3rd Floor',
                'size_sqft' => 1750,
                'bedrooms' => 3,
                'bathrooms' => 3,
                'balconies' => 3,
                'rent_cost' => 35000.00,
                'status' => 'occupied',
                'description' => 'Premium corner flat with 3 sides open, exceptional natural ventilation, servant room with bath, and dedicated basement parking.',
                'amenities' => ['24/7 Security', 'Elevator', 'Dedicated Parking', 'Backup Generator', 'Servant Room', 'Intercom System'],
                'images' => [
                    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80',
                ],
            ],
            [
                'flat_number' => '302-B',
                'floor' => '3rd Floor',
                'size_sqft' => 1100,
                'bedrooms' => 2,
                'bathrooms' => 2,
                'balconies' => 1,
                'rent_cost' => 20000.00,
                'status' => 'vacant',
                'description' => 'Charming 2-bedroom home with timber flooring, recessed LED lighting, and built-in wardrobes.',
                'amenities' => ['24/7 Security', 'Elevator', 'Backup Generator', 'Water Filtration'],
                'images' => [
                    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
                ],
            ],
            [
                'flat_number' => '401-A',
                'floor' => '4th Floor',
                'size_sqft' => 1850,
                'bedrooms' => 4,
                'bathrooms' => 3,
                'balconies' => 3,
                'rent_cost' => 42000.00,
                'status' => 'occupied',
                'description' => 'Expansive 4BHK family residence offering panoramic city views, large drawing and dining zones, and top-tier interior craftsmanship.',
                'amenities' => ['24/7 Security', 'High-Speed Elevator', 'Dedicated Parking', 'Full Power Backup', 'Fire Safety', 'Gym Access'],
                'images' => [
                    'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80',
                ],
            ],
            [
                'flat_number' => '402-B',
                'floor' => '4th Floor',
                'size_sqft' => 1500,
                'bedrooms' => 3,
                'bathrooms' => 2,
                'balconies' => 2,
                'rent_cost' => 30000.00,
                'status' => 'vacant',
                'description' => 'Modern 3-bedroom flat on the 4th floor with private balcony facing the quiet residential tree-lined avenue.',
                'amenities' => ['24/7 Security', 'Elevator', 'Backup Generator', 'Rooftop Community Hall'],
                'images' => [
                    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80',
                ],
            ],
            [
                'flat_number' => '501-PENT',
                'floor' => '5th Floor (Penthouse)',
                'size_sqft' => 2300,
                'bedrooms' => 4,
                'bathrooms' => 4,
                'balconies' => 4,
                'rent_cost' => 58000.00,
                'status' => 'vacant',
                'description' => 'Elite penthouse apartment with private rooftop terrace, wrap-around balconies, jacuzzi bathroom, and smart home automation.',
                'amenities' => ['Private Terrace', 'Smart Door Lock', '2 Reserved Parkings', 'Jacuzzi', '24/7 Concierge', 'Full Power Backup'],
                'images' => [
                    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=1200&q=80',
                ],
            ],
            [
                'flat_number' => '502-B',
                'floor' => '5th Floor',
                'size_sqft' => 1300,
                'bedrooms' => 2,
                'bathrooms' => 2,
                'balconies' => 2,
                'rent_cost' => 25000.00,
                'status' => 'maintenance',
                'description' => 'Upper floor 2-bedroom unit currently undergoing comprehensive plumbing renovation and modern paint refresh.',
                'amenities' => ['24/7 Security', 'Elevator', 'Backup Generator', 'Balcony View'],
                'images' => [
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
                ],
            ],
        ];

        $flats = [];
        foreach ($flatsData as $item) {
            $flats[$item['flat_number']] = Flat::updateOrCreate(['flat_number' => $item['flat_number']], $item);
        }

        // 3. Tenants & Associated Users
        $tenantsData = [
            [
                'name' => 'Tanvir Ahmed',
                'email' => 'tanvir.ahmed@example.com',
                'phone' => '+8801812345671',
                'nid_passport' => '5912384729102',
                'emergency_contact' => '+8801812345600 (Brother)',
                'occupation' => 'Senior Software Engineer, BrainStation23',
                'family_members' => 3,
                'permanent_address' => 'House 14, Road 5, Sector 7, Uttara, Dhaka',
                'status' => 'active',
            ],
            [
                'name' => 'Dr. Nusrat Jahan',
                'email' => 'dr.nusrat@example.com',
                'phone' => '+8801712345672',
                'nid_passport' => '8291039481723',
                'emergency_contact' => '+8801712345601 (Father)',
                'occupation' => 'Assistant Professor, Dhaka Medical College',
                'family_members' => 4,
                'permanent_address' => 'Vill: Joypur, P.O: Chandpur Sadar, Chandpur',
                'status' => 'active',
            ],
            [
                'name' => 'Mahmudul Hasan',
                'email' => 'mahmudul.h@example.com',
                'phone' => '+8801912345673',
                'nid_passport' => '4728193847162',
                'emergency_contact' => '+8801912345602 (Spouse)',
                'occupation' => 'Branch Manager, Standard Chartered Bank',
                'family_members' => 4,
                'permanent_address' => 'Plot 45, Block C, Halishahar, Chattogram',
                'status' => 'active',
            ],
            [
                'name' => 'Sabrina Sultana',
                'email' => 'sabrina.s@example.com',
                'phone' => '+8801612345674',
                'nid_passport' => '9381726354819',
                'emergency_contact' => '+8801612345603 (Mother)',
                'occupation' => 'Lead UI/UX Designer, Toptal',
                'family_members' => 2,
                'permanent_address' => 'Holding 12, Upashahar, Rajshahi',
                'status' => 'active',
            ],
            [
                'name' => 'Kamrul Islam',
                'email' => 'kamrul.islam@example.com',
                'phone' => '+8801512345675',
                'nid_passport' => '1029384756192',
                'emergency_contact' => '+8801512345604 (Uncle)',
                'occupation' => 'Chartered Accountant, KPMG Bangladesh',
                'family_members' => 3,
                'permanent_address' => 'Kandirpar, Cumilla Sadar, Cumilla',
                'status' => 'past',
            ],
        ];

        $tenants = [];
        foreach ($tenantsData as $index => $tData) {
            $user = User::firstOrCreate(
                ['email' => $tData['email']],
                [
                    'name' => $tData['name'],
                    'phone' => $tData['phone'],
                    'role' => 'tenant',
                    'status' => 'active',
                    'password' => Hash::make('tenant123'),
                    'email_verified_at' => now(),
                ]
            );
            $user->syncRoles(['tenant']);

            $tenants[$index] = Tenant::updateOrCreate(
                ['nid_passport' => $tData['nid_passport']],
                array_merge($tData, ['user_id' => $user->id])
            );
        }

        // 4. Leases (Assigning Flats to 3 Active Tenants)
        $currentMonth = Carbon::now()->format('Y-m');
        $lastMonth = Carbon::now()->subMonth()->format('Y-m');

        // Lease 1: Tanvir Ahmed in Flat 201-A
        $flat201 = $flats['201-A'];
        $lease1 = Lease::updateOrCreate(
            ['tenant_id' => $tenants[0]->id, 'flat_id' => $flat201->id],
            [
                'start_date' => Carbon::now()->subMonths(3)->startOfMonth(),
                'end_date' => Carbon::now()->addMonths(9)->endOfMonth(),
                'agreed_monthly_rent' => 32000.00,
                'security_deposit' => 64000.00,
                'advance_paid' => 32000.00,
                'status' => 'active',
            ]
        );
        $flat201->update(['status' => 'occupied']);

        // Lease 2: Dr. Nusrat Jahan in Flat 301-A
        $flat301 = $flats['301-A'];
        $lease2 = Lease::updateOrCreate(
            ['tenant_id' => $tenants[1]->id, 'flat_id' => $flat301->id],
            [
                'start_date' => Carbon::now()->subMonths(2)->startOfMonth(),
                'end_date' => Carbon::now()->addMonths(10)->endOfMonth(),
                'agreed_monthly_rent' => 35000.00,
                'security_deposit' => 70000.00,
                'advance_paid' => 35000.00,
                'status' => 'active',
            ]
        );
        $flat301->update(['status' => 'occupied']);

        // Lease 3: Mahmudul Hasan in Flat 401-A
        $flat401 = $flats['401-A'];
        $lease3 = Lease::updateOrCreate(
            ['tenant_id' => $tenants[2]->id, 'flat_id' => $flat401->id],
            [
                'start_date' => Carbon::now()->subMonth()->startOfMonth(),
                'end_date' => Carbon::now()->addMonths(11)->endOfMonth(),
                'agreed_monthly_rent' => 42000.00,
                'security_deposit' => 84000.00,
                'advance_paid' => 42000.00,
                'status' => 'active',
            ]
        );
        $flat401->update(['status' => 'occupied']);

        // 5. Rent Invoices & Payments

        // Invoices for Last Month
        // Invoice 1: Lease 1 - Paid in full
        $inv1 = RentInvoice::updateOrCreate(
            ['invoice_no' => 'INV-'.$lastMonth.'-001'],
            [
                'lease_id' => $lease1->id,
                'tenant_id' => $tenants[0]->id,
                'billing_month' => $lastMonth,
                'rent_amount' => 32000.00,
                'utility_charges' => 2500.00,
                'other_charges' => 500.00,
                'discount' => 0.00,
                'total_payable' => 35000.00,
                'paid_amount' => 35000.00,
                'due_date' => Carbon::parse($lastMonth.'-10'),
                'status' => 'paid',
            ]
        );

        Payment::updateOrCreate(
            ['payment_no' => 'REC-'.$lastMonth.'-001'],
            [
                'invoice_id' => $inv1->id,
                'lease_id' => $lease1->id,
                'amount_paid' => 35000.00,
                'payment_method' => 'bank',
                'transaction_id' => 'EBL-TXN-8829102',
                'payment_date' => Carbon::parse($lastMonth.'-07'),
                'received_by_user_id' => $admin->id,
                'notes' => 'Received via Eastern Bank transfer.',
            ]
        );

        // Invoice 2: Lease 2 - Paid in full
        $inv2 = RentInvoice::updateOrCreate(
            ['invoice_no' => 'INV-'.$lastMonth.'-002'],
            [
                'lease_id' => $lease2->id,
                'tenant_id' => $tenants[1]->id,
                'billing_month' => $lastMonth,
                'rent_amount' => 35000.00,
                'utility_charges' => 3000.00,
                'other_charges' => 0.00,
                'discount' => 0.00,
                'total_payable' => 38000.00,
                'paid_amount' => 38000.00,
                'due_date' => Carbon::parse($lastMonth.'-10'),
                'status' => 'paid',
            ]
        );

        Payment::updateOrCreate(
            ['payment_no' => 'REC-'.$lastMonth.'-002'],
            [
                'invoice_id' => $inv2->id,
                'lease_id' => $lease2->id,
                'amount_paid' => 38000.00,
                'payment_method' => 'bkash',
                'transaction_id' => 'BKS892716382',
                'payment_date' => Carbon::parse($lastMonth.'-08'),
                'received_by_user_id' => $manager->id,
                'notes' => 'Received via bKash Merchant.',
            ]
        );

        // Invoices for Current Month
        // Current month Invoice 1 (Lease 1): Paid
        $invCurrent1 = RentInvoice::updateOrCreate(
            ['invoice_no' => 'INV-'.$currentMonth.'-001'],
            [
                'lease_id' => $lease1->id,
                'tenant_id' => $tenants[0]->id,
                'billing_month' => $currentMonth,
                'rent_amount' => 32000.00,
                'utility_charges' => 2500.00,
                'other_charges' => 0.00,
                'discount' => 0.00,
                'total_payable' => 34500.00,
                'paid_amount' => 34500.00,
                'due_date' => Carbon::parse($currentMonth.'-10'),
                'status' => 'paid',
            ]
        );

        Payment::updateOrCreate(
            ['payment_no' => 'REC-'.$currentMonth.'-001'],
            [
                'invoice_id' => $invCurrent1->id,
                'lease_id' => $lease1->id,
                'amount_paid' => 34500.00,
                'payment_method' => 'cash',
                'transaction_id' => null,
                'payment_date' => Carbon::parse($currentMonth.'-05'),
                'received_by_user_id' => $manager->id,
                'notes' => 'Full cash payment handed over to manager.',
            ]
        );

        // Current month Invoice 2 (Lease 2): Partially Paid
        $invCurrent2 = RentInvoice::updateOrCreate(
            ['invoice_no' => 'INV-'.$currentMonth.'-002'],
            [
                'lease_id' => $lease2->id,
                'tenant_id' => $tenants[1]->id,
                'billing_month' => $currentMonth,
                'rent_amount' => 35000.00,
                'utility_charges' => 3000.00,
                'other_charges' => 0.00,
                'discount' => 0.00,
                'total_payable' => 38000.00,
                'paid_amount' => 20000.00,
                'due_date' => Carbon::parse($currentMonth.'-10'),
                'status' => 'partially_paid',
            ]
        );

        Payment::updateOrCreate(
            ['payment_no' => 'REC-'.$currentMonth.'-002'],
            [
                'invoice_id' => $invCurrent2->id,
                'lease_id' => $lease2->id,
                'amount_paid' => 20000.00,
                'payment_method' => 'nagad',
                'transaction_id' => 'NGD99281726',
                'payment_date' => Carbon::parse($currentMonth.'-06'),
                'received_by_user_id' => $manager->id,
                'notes' => 'Partial rent payment. Balance 18,000 due next week.',
            ]
        );

        // Current month Invoice 3 (Lease 3): Unpaid
        RentInvoice::updateOrCreate(
            ['invoice_no' => 'INV-'.$currentMonth.'-003'],
            [
                'lease_id' => $lease3->id,
                'tenant_id' => $tenants[2]->id,
                'billing_month' => $currentMonth,
                'rent_amount' => 42000.00,
                'utility_charges' => 3500.00,
                'other_charges' => 1000.00,
                'discount' => 500.00,
                'total_payable' => 46000.00,
                'paid_amount' => 0.00,
                'due_date' => Carbon::parse($currentMonth.'-10'),
                'status' => 'unpaid',
            ]
        );

        // 6. Maintenance Records
        Maintenance::updateOrCreate(
            ['flat_id' => $flats['502-B']->id, 'title' => 'Master bathroom pipe leak and tile replacement'],
            [
                'description' => 'Replaced concealed copper pipe leak under the master bathroom floor and re-tiled the affected floor section.',
                'cost' => 6500.00,
                'reported_date' => Carbon::now()->subDays(4),
                'completed_date' => null,
                'status' => 'in_progress',
            ]
        );

        Maintenance::updateOrCreate(
            ['flat_id' => $flats['101-A']->id, 'title' => 'Master Bedroom Inverter AC Servicing & Gas Refill'],
            [
                'description' => 'General maintenance and refrigerant gas refill for General 1.5 Ton split AC unit.',
                'cost' => 3200.00,
                'reported_date' => Carbon::now()->subDays(18),
                'completed_date' => Carbon::now()->subDays(17),
                'status' => 'completed',
            ]
        );

        // 7. Expenses
        $expensesData = [
            [
                'category' => 'salary',
                'title' => 'Security Guard and Caretaker Monthly Salaries',
                'amount' => 28000.00,
                'expense_date' => Carbon::parse($currentMonth.'-01'),
                'notes' => 'Salaries for 2 day/night guards and 1 building caretaker.',
            ],
            [
                'category' => 'utility',
                'title' => 'Common Area Electricity Bill (DESCO)',
                'amount' => 6450.00,
                'expense_date' => Carbon::parse($currentMonth.'-04'),
                'notes' => 'Hallways, staircase, parking, and pump motor consumption.',
            ],
            [
                'category' => 'maintenance',
                'title' => 'Otis Elevator Monthly Maintenance & Lubrication Service',
                'amount' => 4500.00,
                'expense_date' => Carbon::parse($currentMonth.'-05'),
                'notes' => 'Scheduled safety check and cable lubrication by Otis technician.',
            ],
            [
                'category' => 'utility',
                'title' => 'Emergency Standby Generator Diesel (120 Liters)',
                'amount' => 13200.00,
                'expense_date' => Carbon::parse($currentMonth.'-08'),
                'notes' => 'Fuel refill from Meghna Petroleum station.',
            ],
            [
                'category' => 'others',
                'title' => 'Building Cleaning Chemicals, Dustbins & Pest Control',
                'amount' => 3800.00,
                'expense_date' => Carbon::parse($currentMonth.'-06'),
                'notes' => 'Monthly floor cleaning soap, mop sets and pest spray.',
            ],
        ];

        foreach ($expensesData as $exp) {
            Expense::updateOrCreate(['title' => $exp['title'], 'expense_date' => $exp['expense_date']], $exp);
        }

        // 8. Public Inquiries (Contacts)
        Contact::updateOrCreate(
            ['email' => 'farhan.khan@gmail.com'],
            [
                'name' => 'Farhan Khan',
                'phone' => '+8801799887766',
                'preferred_flat_type' => '3 Bedroom',
                'visit_date' => Carbon::now()->addDays(2),
                'message' => 'Interested in viewing Flat 202-B or any vacant 3BHK flat on a weekday afternoon.',
                'status' => 'new',
            ]
        );

        Contact::updateOrCreate(
            ['email' => 'tahmina.chowdhury@yahoo.com'],
            [
                'name' => 'Tahmina Chowdhury',
                'phone' => '+8801899112233',
                'preferred_flat_type' => 'Penthouse',
                'visit_date' => Carbon::now()->addDays(4),
                'message' => 'Looking for top floor flat with good security and parking facility for 2 cars.',
                'status' => 'contacted',
            ]
        );

        // 9. Newsletter Subscribers
        $subscribers = [
            'investor.reza@gmail.com',
            'shahnewaz.property@outlook.com',
            'mizan.propconsult@gmail.com',
        ];

        foreach ($subscribers as $subEmail) {
            Subscriber::firstOrCreate(['email' => $subEmail]);
        }
    }
}
