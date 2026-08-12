<?php

namespace Tests\Feature;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\Patient;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AppointmentHistoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_lista_consultas_do_paciente_em_ordem_cronologica(): void
    {
        $patient = Patient::factory()->create();

        Appointment::factory()->for($patient)->create([
            'appointment_date' => '2026-05-10',
            'appointment_time' => '15:00',
        ]);
        Appointment::factory()->for($patient)->create([
            'appointment_date' => '2026-05-10',
            'appointment_time' => '08:00',
        ]);
        Appointment::factory()->for($patient)->create([
            'appointment_date' => '2026-04-02',
            'appointment_time' => '11:00',
        ]);

        $response = $this->getJson("/api/appointments?patient_id={$patient->id}");

        $response->assertOk()
            ->assertJsonCount(3, 'data')
            ->assertJsonPath('data.0.appointment_date', '2026-04-02')
            ->assertJsonPath('data.1.appointment_time', '08:00')
            ->assertJsonPath('data.2.appointment_time', '15:00');
    }

    public function test_nao_mistura_consultas_de_outros_pacientes(): void
    {
        $patient = Patient::factory()->create();
        Appointment::factory()->for($patient)->create();
        Appointment::factory()->create();

        $this->getJson("/api/appointments?patient_id={$patient->id}")
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_filtra_por_status(): void
    {
        $patient = Patient::factory()->create();
        Appointment::factory()->for($patient)->withStatus(AppointmentStatus::Scheduled)->create();
        Appointment::factory()->for($patient)->withStatus(AppointmentStatus::Completed)->create([
            'appointment_time' => '11:00',
        ]);

        $this->getJson("/api/appointments?patient_id={$patient->id}&status=realizado")
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.status', AppointmentStatus::Completed->value);
    }

    public function test_recusa_status_invalido(): void
    {
        $patient = Patient::factory()->create();

        $this->getJson("/api/appointments?patient_id={$patient->id}&status=inexistente")
            ->assertStatus(422)
            ->assertJsonValidationErrors('status');
    }

    public function test_recusa_paciente_inexistente(): void
    {
        $this->getJson('/api/appointments?patient_id=999')
            ->assertStatus(422)
            ->assertJsonValidationErrors('patient_id');
    }

    public function test_detalhes_trazem_paciente_profissional_e_especialidade(): void
    {
        $appointment = Appointment::factory()->create(['notes' => 'Levar exames anteriores']);

        $this->getJson("/api/appointments/{$appointment->id}")
            ->assertOk()
            ->assertJsonPath('data.id', $appointment->id)
            ->assertJsonPath('data.notes', 'Levar exames anteriores')
            ->assertJsonPath('data.patient.name', $appointment->patient->name)
            ->assertJsonPath('data.professional.name', $appointment->professional->name)
            ->assertJsonPath('data.professional.specialty.name', $appointment->professional->specialty->name);
    }

    public function test_detalhes_de_consulta_inexistente_retornam_404(): void
    {
        $this->getJson('/api/appointments/999')->assertNotFound();
    }
}
