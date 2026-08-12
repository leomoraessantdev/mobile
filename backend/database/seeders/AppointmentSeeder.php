<?php

namespace Database\Seeders;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\Professional;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class AppointmentSeeder extends Seeder
{
    public function run(): void
    {
        $today = Carbon::today();

        /*
         * Um exemplo de cada status. As datas são relativas a hoje para que o
         * seed continue coerente com as regras de negócio em qualquer dia:
         * "realizado" no passado, "agendado" e "confirmado" no futuro.
         * Cada consulta usa um profissional/horário diferente, então nenhuma
         * delas atrapalha um novo agendamento durante a avaliação — a exceção
         * proposital é a cancelada, que serve para demonstrar que um horário
         * cancelado volta a ficar livre.
         */
        $examples = [
            [
                'professional' => 'Dra. Ana Oliveira',
                'date' => $today->copy()->addDays(3),
                'time' => '09:00',
                'status' => AppointmentStatus::Scheduled,
                'notes' => 'Consulta de rotina para acompanhamento de pressão arterial.',
            ],
            [
                'professional' => 'Dra. Juliana Santos',
                'date' => $today->copy()->addDays(7),
                'time' => '14:00',
                'status' => AppointmentStatus::Confirmed,
                'notes' => 'Avaliação de mancha na pele.',
            ],
            [
                'professional' => 'Dra. Mariana Souza',
                'date' => $today->copy()->subDays(10),
                'time' => '10:00',
                'status' => AppointmentStatus::Completed,
                'notes' => 'Check-up anual. Exames solicitados.',
            ],
            [
                'professional' => 'Dr. Carlos Mendes',
                'date' => $today->copy()->addDays(5),
                'time' => '16:00',
                'status' => AppointmentStatus::Canceled,
                'notes' => 'Cancelada a pedido do paciente.',
            ],
        ];

        foreach ($examples as $example) {
            $professional = Professional::query()->where('name', $example['professional'])->sole();

            $appointment = Appointment::query()
                ->forSlot($professional->id, $example['date']->toDateString(), $example['time'])
                ->first() ?? new Appointment;

            $appointment->fill([
                'patient_id' => PatientSeeder::DEMO_PATIENT_ID,
                'professional_id' => $professional->id,
                'appointment_date' => $example['date']->toDateString(),
                'appointment_time' => $example['time'],
                'status' => $example['status'],
                'notes' => $example['notes'],
            ])->save();
        }
    }
}
