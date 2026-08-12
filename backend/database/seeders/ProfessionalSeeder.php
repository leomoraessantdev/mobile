<?php

namespace Database\Seeders;

use App\Models\Professional;
use App\Models\Specialty;
use Illuminate\Database\Seeder;

class ProfessionalSeeder extends Seeder
{
    /** @var array<string, array<int, string>> */
    private const PROFESSIONALS = [
        'Cardiologia' => ['Dra. Ana Oliveira', 'Dr. Carlos Mendes'],
        'Dermatologia' => ['Dra. Juliana Santos', 'Dr. Rafael Costa'],
        'Clínica Geral' => ['Dra. Mariana Souza', 'Dr. Felipe Almeida'],
    ];

    public function run(): void
    {
        foreach (self::PROFESSIONALS as $specialtyName => $names) {
            $specialty = Specialty::query()->where('name', $specialtyName)->sole();

            foreach ($names as $name) {
                Professional::query()->firstOrCreate([
                    'specialty_id' => $specialty->id,
                    'name' => $name,
                ]);
            }
        }
    }
}
