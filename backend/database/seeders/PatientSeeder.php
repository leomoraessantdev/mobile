<?php

namespace Database\Seeders;

use App\Models\Patient;
use Illuminate\Database\Seeder;

class PatientSeeder extends Seeder
{
    /** O app não tem login: todas as telas usam este paciente fixo. */
    public const DEMO_PATIENT_ID = 1;

    public const DEMO_PATIENT_NAME = 'João da Silva';

    public function run(): void
    {
        Patient::query()
            ->firstOrNew(['id' => self::DEMO_PATIENT_ID])
            ->forceFill([
                'id' => self::DEMO_PATIENT_ID,
                'name' => self::DEMO_PATIENT_NAME,
            ])
            ->save();
    }
}
