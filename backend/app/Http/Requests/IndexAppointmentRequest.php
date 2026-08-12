<?php

namespace App\Http\Requests;

use App\Enums\AppointmentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IndexAppointmentRequest extends FormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'patient_id' => ['required', 'integer', Rule::exists('patients', 'id')],
            'status' => ['nullable', Rule::enum(AppointmentStatus::class)],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'patient_id.required' => 'Informe o paciente para listar as consultas.',
            'patient_id.exists' => 'Paciente não encontrado.',
            'status.enum' => 'Status inválido. Use: '.implode(', ', AppointmentStatus::values()).'.',
        ];
    }

    public function status(): ?AppointmentStatus
    {
        return AppointmentStatus::tryFrom((string) $this->query('status'));
    }
}
