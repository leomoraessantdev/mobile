<?php

namespace Tests\Feature;

use App\Models\Professional;
use App\Models\Specialty;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CatalogTest extends TestCase
{
    use RefreshDatabase;

    public function test_lista_especialidades_em_ordem_alfabetica(): void
    {
        Specialty::factory()->create(['name' => 'Dermatologia']);
        Specialty::factory()->create(['name' => 'Cardiologia']);

        $this->getJson('/api/specialties')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.name', 'Cardiologia');
    }

    public function test_lista_apenas_profissionais_da_especialidade_informada(): void
    {
        $cardiologia = Specialty::factory()->create(['name' => 'Cardiologia']);
        $dermatologia = Specialty::factory()->create(['name' => 'Dermatologia']);

        Professional::factory()->for($cardiologia)->create(['name' => 'Dra. Ana Oliveira']);
        Professional::factory()->for($dermatologia)->create(['name' => 'Dr. Rafael Costa']);

        $this->getJson("/api/professionals?specialty_id={$cardiologia->id}")
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Dra. Ana Oliveira')
            ->assertJsonPath('data.0.specialty.name', 'Cardiologia');
    }

    public function test_recusa_especialidade_inexistente(): void
    {
        $this->getJson('/api/professionals?specialty_id=999')
            ->assertStatus(422)
            ->assertJsonValidationErrors('specialty_id');
    }
}
