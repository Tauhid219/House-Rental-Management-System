<?php

namespace Database\Seeders;

use App\Models\Flat;
use App\Models\Lease;
use App\Models\RentInvoice;
use App\Models\Tenant;
use Illuminate\Database\Seeder;

class ClientUttaraPropertySeeder extends Seeder
{
    public function run(): void
    {
        $clientUnits = [
            [
                'serial' => 1,
                'flat_number' => '54/1',
                'floor' => '1st Floor',
                'tenant_name' => 'LUTHFOR RAHMAN',
                'phone' => '+8801710540001',
                'email' => 'luthfor.rahman@example.com',
                'occupation_date' => '2024-09-01',
                'monthly_rent' => 16000.00,
                'water_bill' => 1100.00,
                'service_charge' => 3500.00,
                'gas_type' => 'prepaid',
                'electricity_type' => 'prepaid',
                'other_charges' => 0.00,
                'other_description' => null,
                'total' => 20600.00,
            ],
            [
                'serial' => 2,
                'flat_number' => '54/2',
                'floor' => '1st Floor',
                'tenant_name' => 'MR. MONJURUL HAQUE',
                'phone' => '+8801710540002',
                'email' => 'monjurul.haque@example.com',
                'occupation_date' => '2024-01-01',
                'monthly_rent' => 16000.00,
                'water_bill' => 1000.00,
                'service_charge' => 3500.00,
                'gas_type' => 'prepaid',
                'electricity_type' => 'prepaid',
                'other_charges' => 0.00,
                'other_description' => null,
                'total' => 20500.00,
            ],
            [
                'serial' => 5,
                'flat_number' => '54/6',
                'floor' => '3rd Floor',
                'tenant_name' => 'MR. REZAUL KARIM',
                'phone' => '+8801710540006',
                'email' => 'rezaul.karim@example.com',
                'occupation_date' => '2024-05-01',
                'monthly_rent' => 15500.00,
                'water_bill' => 1000.00,
                'service_charge' => 3500.00,
                'gas_type' => 'prepaid',
                'electricity_type' => 'prepaid',
                'other_charges' => 0.00,
                'other_description' => null,
                'total' => 20000.00,
            ],
            [
                'serial' => 6,
                'flat_number' => '54/7',
                'floor' => '4th Floor',
                'tenant_name' => 'MR. HAMIDUR RAHMAN',
                'phone' => '+8801710540007',
                'email' => 'hamidur.rahman@example.com',
                'occupation_date' => '2021-06-01',
                'monthly_rent' => 15500.00,
                'water_bill' => 1500.00,
                'service_charge' => 3500.00,
                'gas_type' => 'prepaid',
                'electricity_type' => 'prepaid',
                'other_charges' => 0.00,
                'other_description' => null,
                'total' => 20500.00,
            ],
            [
                'serial' => 7,
                'flat_number' => '54/8',
                'floor' => '4th Floor',
                'tenant_name' => 'MR. NAFIN AHMED ABIR',
                'phone' => '+8801710540008',
                'email' => 'nafin.abir@example.com',
                'occupation_date' => '2025-06-01',
                'monthly_rent' => 16000.00,
                'water_bill' => 1100.00,
                'service_charge' => 3500.00,
                'gas_type' => 'prepaid',
                'electricity_type' => 'prepaid',
                'other_charges' => 0.00,
                'other_description' => null,
                'total' => 20600.00,
            ],
            [
                'serial' => 8,
                'flat_number' => '54/9',
                'floor' => '5th Floor',
                'tenant_name' => 'MD. JAHIDUL ISLAM (MAMUN)',
                'phone' => '+8801710540009',
                'email' => 'jahidul.mamun@example.com',
                'occupation_date' => '2023-01-31',
                'monthly_rent' => 16000.00,
                'water_bill' => 1600.00,
                'service_charge' => 3500.00,
                'gas_type' => 'prepaid',
                'electricity_type' => 'prepaid',
                'other_charges' => 0.00,
                'other_description' => null,
                'total' => 21100.00,
            ],
            [
                'serial' => 9,
                'flat_number' => '54/10',
                'floor' => '5th Floor',
                'tenant_name' => 'MR. LEYAKAT HOSSAIN',
                'phone' => '+8801710540010',
                'email' => 'leyakat.hossain@example.com',
                'occupation_date' => '2020-03-01',
                'monthly_rent' => 16000.00,
                'water_bill' => 1600.00,
                'service_charge' => 3500.00,
                'gas_type' => 'prepaid',
                'electricity_type' => 'prepaid',
                'other_charges' => 0.00,
                'other_description' => null,
                'total' => 21100.00,
            ],
            [
                'serial' => 10,
                'flat_number' => '54/B',
                'floor' => 'Ground Floor',
                'tenant_name' => 'MS MISKAT JERIN EMA',
                'phone' => '+8801710540011',
                'email' => 'miskat.ema@example.com',
                'occupation_date' => '2023-08-01',
                'monthly_rent' => 13000.00,
                'water_bill' => 1300.00,
                'service_charge' => 3500.00,
                'gas_type' => 'prepaid',
                'electricity_type' => 'prepaid',
                'other_charges' => 0.00,
                'other_description' => null,
                'total' => 17800.00,
            ],
            [
                'serial' => 11,
                'flat_number' => '54/A',
                'floor' => 'Ground Floor (Commercial)',
                'tenant_name' => 'MD DELOWER HOSSAIN',
                'phone' => '+8801710540012',
                'email' => 'delower.hossain@example.com',
                'occupation_date' => '2024-01-01',
                'monthly_rent' => 2000.00,
                'water_bill' => 0.00,
                'service_charge' => 0.00,
                'gas_type' => 'prepaid',
                'electricity_type' => 'prepaid',
                'other_charges' => 5000.00,
                'other_description' => 'Shop rent JULY 26',
                'total' => 7000.00,
            ],
        ];

        foreach ($clientUnits as $item) {
            // 1. Create or update Flat
            $flat = Flat::firstOrCreate(
                ['flat_number' => $item['flat_number']],
                [
                    'floor' => $item['floor'],
                    'size_sqft' => $item['flat_number'] === '54/A' ? 250 : 1250,
                    'bedrooms' => $item['flat_number'] === '54/A' ? 1 : 3,
                    'bathrooms' => $item['flat_number'] === '54/A' ? 1 : 2,
                    'balconies' => $item['flat_number'] === '54/A' ? 0 : 2,
                    'rent_cost' => $item['monthly_rent'],
                    'status' => 'occupied',
                    'description' => "Plot No. 54, Road No. 10, Sector 10, Uttara, Dhaka-1230",
                ]
            );

            // 2. Create or update Tenant
            $tenant = Tenant::firstOrCreate(
                ['phone' => $item['phone']],
                [
                    'name' => $item['tenant_name'],
                    'email' => $item['email'],
                    'nid_passport' => 'NID-' . rand(1000000000, 9999999999),
                    'permanent_address' => 'Plot 54, Road 10, Sector 10, Uttara, Dhaka',
                    'emergency_contact' => '+8801711999999',
                    'status' => 'active',
                ]
            );

            // 3. Create or update Lease with defaults
            $lease = Lease::firstOrCreate(
                [
                    'tenant_id' => $tenant->id,
                    'flat_id' => $flat->id,
                ],
                [
                    'start_date' => $item['occupation_date'],
                    'end_date' => null,
                    'agreed_monthly_rent' => $item['monthly_rent'],
                    'default_water_bill' => $item['water_bill'],
                    'default_service_charge' => $item['service_charge'],
                    'default_gas_type' => $item['gas_type'],
                    'default_electricity_type' => $item['electricity_type'],
                    'security_deposit' => $item['monthly_rent'] * 2,
                    'advance_paid' => $item['monthly_rent'],
                    'status' => 'active',
                ]
            );

            // Update lease default values if already exists
            $lease->update([
                'default_water_bill' => $item['water_bill'],
                'default_service_charge' => $item['service_charge'],
                'default_gas_type' => $item['gas_type'],
                'default_electricity_type' => $item['electricity_type'],
                'start_date' => $item['occupation_date'],
            ]);

            // 4. Create or update Rent Invoice for September 2026 matching client Excel
            $invoiceNo = 'BILL-202609-' . str_pad((string) $item['serial'], 3, '0', STR_PAD_LEFT);
            RentInvoice::updateOrCreate(
                [
                    'lease_id' => $lease->id,
                    'billing_month' => '2026-09',
                ],
                [
                    'invoice_no' => $invoiceNo,
                    'tenant_id' => $tenant->id,
                    'rent_amount' => $item['monthly_rent'],
                    'water_bill' => $item['water_bill'],
                    'service_charge' => $item['service_charge'],
                    'gas_bill' => 0.00,
                    'gas_type' => $item['gas_type'],
                    'electricity_bill' => 0.00,
                    'electricity_type' => $item['electricity_type'],
                    'utility_charges' => $item['water_bill'] + $item['service_charge'],
                    'other_charges' => $item['other_charges'],
                    'other_charges_description' => $item['other_description'],
                    'advance_adjustment' => 0.00,
                    'discount' => 0.00,
                    'total_payable' => $item['total'],
                    'paid_amount' => 0.00,
                    'due_date' => '2026-09-07',
                    'status' => 'unpaid',
                    'created_at' => '2026-09-02 10:00:00',
                ]
            );
        }
    }
}
