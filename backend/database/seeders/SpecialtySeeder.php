<?php

namespace Database\Seeders;

use App\Models\Specialty;
use Illuminate\Database\Seeder;

class SpecialtySeeder extends Seeder
{
    public function run(): void
    {
        foreach (['Cardiologia', 'Dermatologia', 'Clínica Geral'] as $name) {
            Specialty::query()->firstOrCreate(['name' => $name]);
        }
    }
}
