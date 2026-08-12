<?php

namespace Tests\Feature;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CancelAppointmentTest extends TestCase
{
    use RefreshDatabase;

    /** RN-06 */
    public function test_cancela_consulta_agendada(): void
    {
        $appointment = Appointment::factory()->withStatus(AppointmentStatus::Scheduled)->create();

        $this->patchJson("/api/appointments/{$appointment->id}/cancel")
            ->assertOk()
            ->assertJsonPath('data.status', AppointmentStatus::Canceled->value)
            ->assertJsonPath('data.can_cancel', false);

        $this->assertSame(AppointmentStatus::Canceled, $appointment->refresh()->status);
    }

    /** RN-06 */
    public function test_cancela_consulta_confirmada(): void
    {
        $appointment = Appointment::factory()->withStatus(AppointmentStatus::Confirmed)->create();

        $this->patchJson("/api/appointments/{$appointment->id}/cancel")->assertOk();

        $this->assertSame(AppointmentStatus::Canceled, $appointment->refresh()->status);
    }

    /** RN-06 */
    public function test_nao_cancela_consulta_realizada(): void
    {
        $appointment = Appointment::factory()->withStatus(AppointmentStatus::Completed)->create();

        $this->patchJson("/api/appointments/{$appointment->id}/cancel")
            ->assertStatus(400)
            ->assertJsonPath('message', 'Uma consulta com status "Realizado" não pode ser cancelada.');

        $this->assertSame(AppointmentStatus::Completed, $appointment->refresh()->status);
    }

    /** RN-06 */
    public function test_nao_cancela_consulta_ja_cancelada(): void
    {
        $appointment = Appointment::factory()->withStatus(AppointmentStatus::Canceled)->create();

        $this->patchJson("/api/appointments/{$appointment->id}/cancel")->assertStatus(400);
    }

    public function test_cancelamento_preserva_o_registro(): void
    {
        $appointment = Appointment::factory()->create();

        $this->patchJson("/api/appointments/{$appointment->id}/cancel")->assertOk();

        $this->assertDatabaseHas('appointments', [
            'id' => $appointment->id,
            'status' => AppointmentStatus::Canceled->value,
        ]);
    }

    public function test_retorna_404_para_consulta_inexistente(): void
    {
        $this->patchJson('/api/appointments/999/cancel')
            ->assertNotFound()
            ->assertJsonPath('message', 'Recurso não encontrado.');
    }
}
