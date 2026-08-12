<?php

use App\Enums\AppointmentStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->foreignId('professional_id')->constrained()->cascadeOnDelete();
            $table->date('appointment_date');
            $table->time('appointment_time');
            $table->string('status')->default(AppointmentStatus::Scheduled->value);
            $table->text('notes')->nullable();
            $table->timestamps();

            // Histórico do paciente, com e sem filtro de status (RN-05).
            $table->index(['patient_id', 'status']);
            $table->index(['professional_id', 'appointment_date']);
        });

        $this->createSlotUniqueIndex();
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }

    /**
     * RN-02: um profissional não pode ter duas consultas ativas no mesmo
     * horário. Consultas canceladas ficam de fora do índice para que o
     * horário volte a ficar livre, o que exige um índice parcial — suportado
     * por SQLite e PostgreSQL. Nos demais bancos o índice composto acima já
     * atende as consultas e a regra fica garantida pela camada de serviço.
     */
    private function createSlotUniqueIndex(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if (! in_array($driver, ['sqlite', 'pgsql'], true)) {
            return;
        }

        DB::statement(sprintf(
            "CREATE UNIQUE INDEX appointments_active_slot_unique
             ON appointments (professional_id, appointment_date, appointment_time)
             WHERE status <> '%s'",
            AppointmentStatus::Canceled->value
        ));
    }
};
