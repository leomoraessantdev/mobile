<?php

namespace Tests\Feature;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Professional;
use App\Models\Specialty;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class ScheduleAppointmentTest extends TestCase
{
    use RefreshDatabase;

    private Patient $patient;

    private Professional $professional;

    protected function setUp(): void
    {
        parent::setUp();

        Carbon::setTestNow('2026-03-10 08:00:00');

        $this->patient = Patient::factory()->create();
        $this->professional = Professional::factory()
            ->for(Specialty::factory())
            ->create();
    }

    public function test_cria_consulta_com_status_agendado(): void
    {
        $response = $this->postJson('/api/appointments', $this->payload());

        $response->assertCreated()
            ->assertJsonPath('data.status', AppointmentStatus::Scheduled->value)
            ->assertJsonPath('data.can_cancel', true)
            ->assertJsonPath('data.patient.id', $this->patient->id)
            ->assertJsonPath('data.professional.id', $this->professional->id)
            ->assertJsonPath('data.appointment_time', '10:00');

        $this->assertDatabaseHas('appointments', [
            'patient_id' => $this->patient->id,
            'professional_id' => $this->professional->id,
            'appointment_date' => '2026-03-20',
            'appointment_time' => '10:00:00',
            'status' => AppointmentStatus::Scheduled->value,
        ]);
    }

    /** RN-01 */
    public function test_recusa_agendamento_em_data_passada(): void
    {
        $response = $this->postJson('/api/appointments', $this->payload([
            'appointment_date' => '2026-03-09',
        ]));

        $response->assertStatus(422)->assertJsonValidationErrors('appointment_date');
        $this->assertDatabaseCount('appointments', 0);
    }

    /** RN-01: o horário também conta, não só o dia. */
    public function test_recusa_horario_que_ja_passou_no_dia_de_hoje(): void
    {
        $response = $this->postJson('/api/appointments', $this->payload([
            'appointment_date' => '2026-03-10',
            'appointment_time' => '07:00',
        ]));

        $response->assertStatus(422)->assertJsonValidationErrors('appointment_date');
    }

    /** RN-02 */
    public function test_recusa_horario_ja_ocupado_pelo_profissional(): void
    {
        Appointment::factory()->create([
            'professional_id' => $this->professional->id,
            'appointment_date' => '2026-03-20',
            'appointment_time' => '10:00',
            'status' => AppointmentStatus::Confirmed,
        ]);

        $response = $this->postJson('/api/appointments', $this->payload());

        $response->assertStatus(400)
            ->assertJsonPath('message', 'Este profissional já possui uma consulta neste horário.');
        $this->assertDatabaseCount('appointments', 1);
    }

    /** RN-02: consulta cancelada libera o horário. */
    public function test_permite_reaproveitar_horario_de_consulta_cancelada(): void
    {
        Appointment::factory()->create([
            'professional_id' => $this->professional->id,
            'appointment_date' => '2026-03-20',
            'appointment_time' => '10:00',
            'status' => AppointmentStatus::Canceled,
        ]);

        $this->postJson('/api/appointments', $this->payload())->assertCreated();

        $this->assertDatabaseCount('appointments', 2);
    }

    public function test_permite_o_mesmo_horario_para_profissionais_diferentes(): void
    {
        $outro = Professional::factory()->for(Specialty::factory())->create();

        Appointment::factory()->create([
            'professional_id' => $outro->id,
            'appointment_date' => '2026-03-20',
            'appointment_time' => '10:00',
        ]);

        $this->postJson('/api/appointments', $this->payload())->assertCreated();
    }

    /** RN-04: o cliente não escolhe o status inicial. */
    public function test_recusa_status_enviado_pelo_cliente(): void
    {
        $response = $this->postJson('/api/appointments', $this->payload([
            'status' => AppointmentStatus::Completed->value,
        ]));

        $response->assertStatus(422)->assertJsonValidationErrors('status');
    }

    /** RN-03 */
    public function test_recusa_paciente_ou_profissional_inexistente(): void
    {
        $response = $this->postJson('/api/appointments', $this->payload([
            'patient_id' => 999,
            'professional_id' => 999,
        ]));

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['patient_id', 'professional_id']);
    }

    public function test_recusa_horario_fora_do_formato_esperado(): void
    {
        $response = $this->postJson('/api/appointments', $this->payload([
            'appointment_time' => '10h',
        ]));

        $response->assertStatus(422)->assertJsonValidationErrors('appointment_time');
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function payload(array $overrides = []): array
    {
        return array_merge([
            'patient_id' => $this->patient->id,
            'professional_id' => $this->professional->id,
            'appointment_date' => '2026-03-20',
            'appointment_time' => '10:00',
            'notes' => 'Consulta de rotina',
        ], $overrides);
    }
}
