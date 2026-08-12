<?php

namespace Database\Factories;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Professional;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends Factory<Appointment>
 */
class AppointmentFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'patient_id' => Patient::factory(),
            'professional_id' => Professional::factory(),
            'appointment_date' => Carbon::today()->addDays(7)->toDateString(),
            'appointment_time' => '10:00',
            'status' => AppointmentStatus::Scheduled,
            'notes' => null,
        ];
    }

    public function withStatus(AppointmentStatus $status): static
    {
        return $this->state(fn () => ['status' => $status]);
    }
}
