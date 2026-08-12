<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IndexProfessionalRequest extends FormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            // Opcional: sem o filtro a rota devolve todos os profissionais.
            'specialty_id' => ['nullable', 'integer', Rule::exists('specialties', 'id')],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'specialty_id.exists' => 'Especialidade não encontrada.',
        ];
    }
}
