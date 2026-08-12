<?php

namespace App\Services;

use App\Enums\AppointmentStatus;
use App\Exceptions\BusinessRuleException;
use App\Models\Appointment;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;

class AppointmentService
{
    private const SLOT_TAKEN = 'Este profissional já possui uma consulta neste horário.';

    /**
     * @return Collection<int, Appointment>
     */
    public function historyFor(int $patientId, ?AppointmentStatus $status = null): Collection
    {
        return Appointment::query()
            ->with(['patient', 'professional.specialty'])
            ->where('patient_id', $patientId)
            ->withStatus($status)
            ->chronological()
            ->get();
    }

    /**
     * RN-03/RN-04: a consulta nasce vinculada a paciente e profissional já
     * validados pelo Form Request e sempre com o status "agendado".
     *
     * @param  array{patient_id:int, professional_id:int, appointment_date:string, appointment_time:string, notes?:string|null}  $data
     */
    public function schedule(array $data): Appointment
    {
        try {
            return DB::transaction(function () use ($data) {
                $this->guardAgainstSlotConflict(
                    (int) $data['professional_id'],
                    $data['appointment_date'],
                    $data['appointment_time'],
                );

                return Appointment::create([
                    'patient_id' => $data['patient_id'],
                    'professional_id' => $data['professional_id'],
                    'appointment_date' => $data['appointment_date'],
                    'appointment_time' => $data['appointment_time'],
                    'notes' => $data['notes'] ?? null,
                    'status' => AppointmentStatus::Scheduled,
                ]);
            });
        } catch (UniqueConstraintViolationException) {
            // Rede de segurança: duas requisições simultâneas podem passar pela
            // verificação acima, mas o índice único parcial barra a segunda.
            throw new BusinessRuleException(self::SLOT_TAKEN);
        }
    }

    /** RN-06 */
    public function cancel(Appointment $appointment): Appointment
    {
        if (! $appointment->status->isCancellable()) {
            throw new BusinessRuleException(
                "Uma consulta com status \"{$appointment->status->label()}\" não pode ser cancelada."
            );
        }

        $appointment->status = AppointmentStatus::Canceled;
        $appointment->save();

        return $appointment->load(['patient', 'professional.specialty']);
    }

    /** RN-02: consultas canceladas não ocupam a agenda. */
    private function guardAgainstSlotConflict(int $professionalId, string $date, string $time): void
    {
        $taken = Appointment::query()
            ->forSlot($professionalId, $date, $time)
            ->whereNot('status', AppointmentStatus::Canceled)
            ->lockForUpdate()
            ->exists();

        if ($taken) {
            throw new BusinessRuleException(self::SLOT_TAKEN);
        }
    }
}
