<?php

namespace App\Http\Resources;

use App\Models\Professional;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Professional */
class ProfessionalResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'specialty' => SpecialtyResource::make($this->whenLoaded('specialty')),
        ];
    }
}
