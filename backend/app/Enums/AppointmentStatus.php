<?php

namespace App\Enums;

enum AppointmentStatus: string
{
    case Scheduled = 'agendado';
    case Confirmed = 'confirmado';
    case Completed = 'realizado';
    case Canceled = 'cancelado';

    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function label(): string
    {
        return match ($this) {
            self::Scheduled => 'Agendado',
            self::Confirmed => 'Confirmado',
            self::Completed => 'Realizado',
            self::Canceled => 'Cancelado',
        };
    }

    /** RN-06: apenas consultas agendadas ou confirmadas podem ser canceladas. */
    public function isCancellable(): bool
    {
        return in_array($this, [self::Scheduled, self::Confirmed], true);
    }

    /** Status que ocupam a agenda do profissional (RN-02). */
    public function occupiesSlot(): bool
    {
        return $this !== self::Canceled;
    }
}
