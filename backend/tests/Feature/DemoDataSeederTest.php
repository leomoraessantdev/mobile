<?php

namespace Tests\Feature;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\Patient;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\PatientSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DemoDataSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_cria_o_conjunto_de_demonstracao(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->assertDatabaseCount('specialties', 3);
        $this->assertDatabaseCount('professionals', 6);
        $this->assertDatabaseCount('patients', 1);
        $this->assertDatabaseCount('appointments', 4);

        $patient = Patient::query()->find(PatientSeeder::DEMO_PATIENT_ID);
        $this->assertNotNull($patient);
        $this->assertSame(PatientSeeder::DEMO_PATIENT_NAME, $patient->name);

        $this->assertEqualsCanonicalizing(
            AppointmentStatus::values(),
            Appointment::query()->pluck('status')->map->value->all(),
        );
    }

    public function test_pode_ser_executado_novamente_sem_duplicar_dados(): void
    {
        $this->seed(DatabaseSeeder::class);
        $this->seed(DatabaseSeeder::class);

        $this->assertDatabaseCount('specialties', 3);
        $this->assertDatabaseCount('professionals', 6);
        $this->assertDatabaseCount('patients', 1);
        $this->assertDatabaseCount('appointments', 4);
    }
}
