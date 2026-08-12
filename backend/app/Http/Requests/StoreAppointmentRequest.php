<?php

namespace App\Http\Requests;

use Carbon\CarbonImmutable;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAppointmentRequest extends FormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'patient_id' => ['required', 'integer', Rule::exists('patients', 'id')],
            // O vínculo com uma especialidade é obrigatório no cadastro do
            // profissional; a checagem explícita evita agendar em um registro
            // inconsistente carregado por outro caminho.
            'professional_id' => ['required', 'integer', Rule::exists('professionals', 'id')->whereNotNull('specialty_id')],
            'appointment_date' => ['required', 'date_format:Y-m-d'],
            'appointment_time' => ['required', 'date_format:H:i'],
            'notes' => ['nullable', 'string', 'max:500'],
            // RN-04: o status inicial é responsabilidade do backend.
            'status' => ['prohibited'],
        ];
    }

    /**
     * RN-01: a data e o horário só fazem sentido juntos — 08:00 de hoje já
     * passou, 08:00 de amanhã não.
     *
     * @return array<int, callable>
     */
    public function after(): array
    {
        return [
            function (Validator $validator) {
                if ($validator->errors()->hasAny(['appointment_date', 'appointment_time'])) {
                    return;
                }

                // startOfMinute porque createFromFormat completa os segundos
                // que faltam no formato com o relógio do momento.
                $slot = CarbonImmutable::createFromFormat(
                    'Y-m-d H:i',
                    $this->string('appointment_date').' '.$this->string('appointment_time'),
                )->startOfMinute();

                if ($slot->isPast()) {
                    $validator->errors()->add(
                        'appointment_date',
                        'Não é possível agendar uma consulta em data ou horário que já passou.'
                    );
                }
            },
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'patient_id.required' => 'Informe o paciente.',
            'patient_id.exists' => 'Paciente não encontrado.',
            'professional_id.required' => 'Selecione um profissional.',
            'professional_id.exists' => 'Profissional não encontrado.',
            'appointment_date.required' => 'Selecione a data da consulta.',
            'appointment_date.date_format' => 'A data deve estar no formato AAAA-MM-DD.',
            'appointment_time.required' => 'Selecione o horário da consulta.',
            'appointment_time.date_format' => 'O horário deve estar no formato HH:MM.',
            'notes.max' => 'As observações devem ter no máximo 500 caracteres.',
            'status.prohibited' => 'O status não pode ser enviado: toda nova consulta é criada como "agendado".',
        ];
    }
}
