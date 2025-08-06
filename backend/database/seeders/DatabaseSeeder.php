<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@admin.com',
            'type' => 'admin',
            'password' => Hash::make('password'),
        ]);

        // Create categories
        $electronics = Category::create([
            'name' => 'Electronics'
        ]);

        $clothing = Category::create([
            'name' => 'Clothing'
        ]);

        $home = Category::create([
            'name' => 'Home & Garden'
        ]);

        // Create products for Electronics
        Product::create([
            'name' => 'Smartphone Pro Max',
            'category_id' => $electronics->id,
            'unit_price' => 999.99,
            'quantity' => 50
        ]);

        Product::create([
            'name' => 'Wireless Headphones',
            'category_id' => $electronics->id,
            'unit_price' => 199.99,
            'quantity' => 75
        ]);

        Product::create([
            'name' => 'Gaming Laptop',
            'category_id' => $electronics->id,
            'unit_price' => 1299.99,
            'quantity' => 25
        ]);

        // Create products for Clothing
        Product::create([
            'name' => 'Premium Cotton T-Shirt',
            'category_id' => $clothing->id,
            'unit_price' => 29.99,
            'quantity' => 100
        ]);

        Product::create([
            'name' => 'Designer Jeans',
            'category_id' => $clothing->id,
            'unit_price' => 89.99,
            'quantity' => 60
        ]);

        Product::create([
            'name' => 'Winter Jacket',
            'category_id' => $clothing->id,
            'unit_price' => 149.99,
            'quantity' => 40
        ]);

        // Create products for Home & Garden
        Product::create([
            'name' => 'Smart Home Hub',
            'category_id' => $home->id,
            'unit_price' => 79.99,
            'quantity' => 30
        ]);

        Product::create([
            'name' => 'Garden Tool Set',
            'category_id' => $home->id,
            'unit_price' => 49.99,
            'quantity' => 45
        ]);

        Product::create([
            'name' => 'LED String Lights',
            'category_id' => $home->id,
            'unit_price' => 24.99,
            'quantity' => 80
        ]);
    }
}
