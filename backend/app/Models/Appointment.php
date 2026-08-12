<?php

namespace App\Models;

use App\Enums\AppointmentStatus;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'professional_id',
        'appointment_date',
        'appointment_time',
        'status',
        'notes',
    ];

    protected $casts = [
        'status' => AppointmentStatus::class,
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function professional(): BelongsTo
    {
        return $this->belongsTo(Professional::class);
    }

    /**
     * Data e horário são gravados sempre como "YYYY-MM-DD" e "HH:MM:SS". O
     * formato fixo é o que permite comparar o horário direto na cláusula WHERE
     * e manter o índice único de horário ocupado confiável (RN-02). O cast
     * "date" padrão do Eloquent gravaria "YYYY-MM-DD 00:00:00", por isso a
     * conversão é explícita aqui.
     */
    protected function appointmentDate(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => CarbonImmutable::parse($value)->startOfDay(),
            set: fn (CarbonImmutable|string $value) => CarbonImmutable::parse($value)->toDateString(),
        );
    }

    protected function appointmentTime(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => substr($value, 0, 5),
            set: fn (string $value) => self::normalizeTime($value),
        );
    }

    public static function normalizeTime(string $time): string
    {
        return substr($time, 0, 5).':00';
    }

    /** Localiza a consulta de um profissional em um dia e horário exatos. */
    public function scopeForSlot(Builder $query, int $professionalId, string $date, string $time): Builder
    {
        return $query
            ->where('professional_id', $professionalId)
            ->where('appointment_date', $date)
            ->where('appointment_time', self::normalizeTime($time));
    }

    public function scopeWithStatus(Builder $query, ?AppointmentStatus $status): Builder
    {
        return $query->when($status, fn (Builder $q) => $q->where('status', $status));
    }

    /** Ordena do compromisso mais próximo para o mais distante. */
    public function scopeChronological(Builder $query): Builder
    {
        return $query->orderBy('appointment_date')->orderBy('appointment_time');
    }
}
