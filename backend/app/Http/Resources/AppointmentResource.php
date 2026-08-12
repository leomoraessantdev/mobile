<?php

namespace App\Http\Resources;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Mesma representação na listagem e no detalhe: o app monta a tela de
 * detalhes sem precisar buscar paciente, profissional e especialidade
 * em requisições separadas.
 *
 * @mixin Appointment
 */
class AppointmentResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'appointment_date' => $this->appointment_date->toDateString(),
            'appointment_time' => $this->appointment_time,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'can_cancel' => $this->status->isCancellable(),
            'notes' => $this->notes,
            'patient' => PatientResource::make($this->whenLoaded('patient')),
            'professional' => ProfessionalResource::make($this->whenLoaded('professional')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
